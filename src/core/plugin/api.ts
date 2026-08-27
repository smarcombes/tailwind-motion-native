/**
 * Minimal stand-ins for the parts of the Tailwind CSS plugin API that
 * tailwindcss-motion uses. Keeping them here means the vendored plugin source
 * stays a near-verbatim copy of upstream while `tailwindcss` itself never has to
 * be bundled into a React Native app.
 */

export type CSSRuleObject = {
  [key: string]: string | number | CSSRuleObject | undefined;
};

export type UtilityOptions = {
  modifier: string | null;
};

export type UtilityFn = (
  value: string,
  options: UtilityOptions
) => CSSRuleObject;

export type MatchOptions = {
  values?: Record<string, string | number>;
  modifiers?: Record<string, string>;
  supportsNegativeValues?: boolean;
  type?: string | string[];
};

export type ThemeFn = (path: string) => Record<string, string>;

export type PluginAPI = {
  addBase: (base: CSSRuleObject) => void;
  addUtilities: (utilities: CSSRuleObject) => void;
  addComponents: (components: CSSRuleObject) => void;
  matchUtilities: (
    utilities: Record<string, UtilityFn>,
    options?: MatchOptions
  ) => void;
  matchComponents: (
    components: Record<string, UtilityFn>,
    options?: MatchOptions
  ) => void;
  theme: ThemeFn;
};
