import { flattenColorPalette, TAILWIND_DEFAULT_THEME } from "./tailwindTheme.js";

let flatPalette: Record<string, string> | undefined;

const palette = (): Record<string, string> => {
  flatPalette ??= flattenColorPalette(
    (TAILWIND_DEFAULT_THEME.colors ?? {}) as Record<string, unknown>
  );
  return flatPalette;
};

/** `red-500` -> `#ef4444`. Only the default Tailwind palette is bundled. */
export const lookupColor = (name: string): string | undefined =>
  palette()[name];

/**
 * The colour animations in tailwindcss-motion animate *to* the element's own
 * colour, which lives in a sibling Tailwind class. Reading it out of the class
 * list lets `motion-bg-in-red-500 bg-blue-500` work without a style round-trip.
 */
export const inferBaseColors = (
  classNames: string[]
): { backgroundColor?: string; color?: string } => {
  const result: { backgroundColor?: string; color?: string } = {};

  classNames.forEach((className) => {
    if (className.includes(":")) return;

    const parse = (prefix: string): string | undefined => {
      if (!className.startsWith(prefix)) return undefined;
      const value = className.slice(prefix.length);
      if (value.startsWith("[") && value.endsWith("]")) {
        return value.slice(1, -1).replace(/_/g, " ");
      }
      return lookupColor(value);
    };

    const background = parse("bg-");
    if (background) result.backgroundColor = background;

    const text = parse("text-");
    if (text) result.color = text;
  });

  return result;
};
