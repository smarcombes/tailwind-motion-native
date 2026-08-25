import type {
  CSSRuleObject,
  MatchOptions,
  PluginAPI,
  ThemeFn,
  UtilityFn,
} from "./plugin/api.js";
import { pluginCreator, pluginTheme } from "./plugin/index.js";
import { TAILWIND_DEFAULT_THEME } from "./tailwindTheme.js";

/** A class name that the plugin knows about, resolved to flat CSS declarations. */
export type ResolvedRule = {
  className: string;
  /** Utilities win over components, exactly like Tailwind's layer order. */
  layer: "components" | "utilities";
  declarations: Record<string, string>;
};

type DynamicRule = {
  base: string;
  layer: ResolvedRule["layer"];
  fn: UtilityFn;
  options: MatchOptions;
};

const asString = (value: string | number): string => `${value}`;

/** `[36px]` -> `36px`, `[cubic-bezier(1,_0,_0,_1)]` -> `cubic-bezier(1, 0, 0, 1)`. */
const parseArbitraryValue = (raw: string): string | null => {
  if (!raw.startsWith("[") || !raw.endsWith("]")) return null;
  return raw.slice(1, -1).replace(/_/g, " ").trim() || null;
};

/** Splits `motion-delay-500/rotate` into `["motion-delay-500", "rotate"]`. */
const splitModifier = (className: string): [string, string | null] => {
  let depth = 0;
  for (let i = className.length - 1; i >= 0; i -= 1) {
    const char = className[i];
    if (char === "]") depth += 1;
    else if (char === "[") depth -= 1;
    else if (char === "/" && depth === 0) {
      return [className.slice(0, i), className.slice(i + 1)];
    }
  }
  return [className, null];
};

const flattenDeclarations = (rule: CSSRuleObject): Record<string, string> => {
  const declarations: Record<string, string> = {};
  Object.entries(rule).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      declarations[key] = asString(value);
    }
  });
  return declarations;
};

const createTheme = (): ThemeFn => {
  const cache = new Map<string, Record<string, string>>();

  const theme: ThemeFn = (path) => {
    const cached = cache.get(path);
    if (cached) return cached;

    const source =
      (pluginTheme as Record<string, unknown>)[path] ??
      TAILWIND_DEFAULT_THEME[path];

    if (source === undefined) {
      throw new Error(`tailwind-motion-native: unknown theme path "${path}"`);
    }

    const raw =
      typeof source === "function"
        ? (source as (t: ThemeFn) => Record<string, unknown>)(theme)
        : (source as Record<string, unknown>);

    const values: Record<string, string> = {};
    Object.entries(raw).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      // Nested scales (`colors.red.500`) are handed over untouched so the
      // plugin can flatten them itself.
      values[key] =
        typeof value === "object"
          ? (value as unknown as string)
          : asString(value as string | number);
    });

    cache.set(path, values);
    return values;
  };

  return theme;
};

/**
 * Runs a Tailwind plugin against a mock plugin API so class names can be
 * resolved to CSS declarations in plain JavaScript, with no Tailwind, PostCSS or
 * bundler involved.
 */
export const createEngine = () => {
  /** `--motion-duration` -> `700ms`, collected from the plugin's `@property` rules. */
  const defaultVars: Record<string, string> = {};
  const staticRules = new Map<string, ResolvedRule>();
  const dynamicRules: DynamicRule[] = [];

  const collectDefaults = (rule: CSSRuleObject): void => {
    Object.entries(rule).forEach(([selector, body]) => {
      if (!body || typeof body !== "object") return;

      if (selector.startsWith("@property ")) {
        const name = selector.slice("@property ".length).trim();
        const initial = (body as CSSRuleObject)["initial-value"];
        defaultVars[name] =
          typeof initial === "string" || typeof initial === "number"
            ? asString(initial)
            : "";
        return;
      }

      if (selector.startsWith("@keyframes")) return;

      // `:root { --x: y }` and `@defaults ... { --x: y }`, used by older releases.
      Object.entries(body as CSSRuleObject).forEach(([key, value]) => {
        if (key.startsWith("--") && typeof value === "string") {
          defaultVars[key] = value;
        }
      });

      if (selector.startsWith("@media")) collectDefaults(body as CSSRuleObject);
    });
  };

  const addStatic = (
    rules: CSSRuleObject,
    layer: ResolvedRule["layer"]
  ): void => {
    Object.entries(rules).forEach(([selector, body]) => {
      if (!body || typeof body !== "object") return;
      if (!selector.startsWith(".")) return;

      const className = selector.slice(1);
      staticRules.set(className, {
        className,
        layer,
        declarations: flattenDeclarations(body as CSSRuleObject),
      });
    });
  };

  const addDynamic = (
    utilities: Record<string, UtilityFn>,
    options: MatchOptions | undefined,
    layer: ResolvedRule["layer"]
  ): void => {
    Object.entries(utilities).forEach(([base, fn]) => {
      dynamicRules.push({
        base: base.startsWith(".") ? base.slice(1) : base,
        layer,
        fn,
        options: options ?? {},
      });
    });
  };

  const api: PluginAPI = {
    addBase: collectDefaults,
    addUtilities: (utilities) => addStatic(utilities, "utilities"),
    addComponents: (components) => addStatic(components, "components"),
    matchUtilities: (utilities, options) =>
      addDynamic(utilities, options, "utilities"),
    matchComponents: (components, options) =>
      addDynamic(components, options, "components"),
    theme: createTheme(),
  };

  pluginCreator(api);

  // Longest base name first so `motion-preset-slide-up-right` is preferred over
  // `motion-preset-slide-up`.
  const sortedDynamicRules = [...dynamicRules].sort(
    (a, b) => b.base.length - a.base.length
  );

  const resolveDynamic = (className: string): ResolvedRule | null => {
    const [withoutModifier, modifier] = splitModifier(className);
    const isNegative = withoutModifier.startsWith("-");
    const bare = isNegative ? withoutModifier.slice(1) : withoutModifier;

    for (const rule of sortedDynamicRules) {
      if (!bare.startsWith(rule.base)) continue;
      if (isNegative && !rule.options.supportsNegativeValues) continue;

      const modifiers = rule.options.modifiers ?? {};
      if (modifier !== null) {
        const arbitraryModifier = parseArbitraryValue(modifier);
        if (arbitraryModifier === null && modifiers[modifier] === undefined) {
          continue;
        }
      }

      const values = rule.options.values ?? {};
      const suffix = bare.slice(rule.base.length);

      let value: string | undefined;
      if (suffix === "") {
        value = values.DEFAULT !== undefined ? asString(values.DEFAULT) : undefined;
      } else if (suffix.startsWith("-")) {
        const key = suffix.slice(1);
        const arbitrary = parseArbitraryValue(key);
        if (arbitrary !== null) value = arbitrary;
        else if (values[key] !== undefined) value = asString(values[key]);
      }

      if (value === undefined) continue;

      const resolvedModifier =
        modifier === null
          ? null
          : (parseArbitraryValue(modifier) ?? modifiers[modifier] ?? modifier);

      return {
        className,
        layer: rule.layer,
        declarations: flattenDeclarations(
          rule.fn(isNegative ? `-${value}` : value, {
            modifier: resolvedModifier,
          })
        ),
      };
    }

    return null;
  };

  return {
    defaultVars,

    /** Resolves one class name, or `null` when the plugin doesn't own it. */
    resolveClass: (className: string): ResolvedRule | null => {
      const bare = className.startsWith(".") ? className.slice(1) : className;
      return staticRules.get(bare) ?? resolveDynamic(bare);
    },

    /** Class names registered as-is, e.g. `motion-preset-pop`. */
    listStaticClassNames: (): string[] => [...staticRules.keys()].sort(),

    /** Every class name / class name prefix the plugin registers. */
    listClassNames: (): string[] =>
      [
        ...staticRules.keys(),
        ...sortedDynamicRules.map((rule) => rule.base),
      ].sort(),

    /** Registered dynamic utilities and the values they accept. */
    listDynamicRules: (): Array<{
      base: string;
      values: string[];
      modifiers: string[];
      supportsNegativeValues: boolean;
    }> =>
      sortedDynamicRules.map((rule) => ({
        base: rule.base,
        values: Object.keys(rule.options.values ?? {}),
        modifiers: Object.keys(rule.options.modifiers ?? {}),
        supportsNegativeValues: rule.options.supportsNegativeValues === true,
      })),
  };
};

export type MotionEngine = ReturnType<typeof createEngine>;

let sharedEngine: MotionEngine | undefined;

/** The engine is stateless once built, so one instance is shared per bundle. */
export const getEngine = (): MotionEngine => {
  if (!sharedEngine) sharedEngine = createEngine();
  return sharedEngine;
};
