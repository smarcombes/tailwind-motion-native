/**
 * The little bit of CSS that tailwindcss-motion needs at runtime: custom
 * property resolution (with fallbacks), `calc()` evaluation and unit parsing.
 * Hand-rolled so the package ships with zero runtime dependencies instead of
 * pulling PostCSS into a mobile bundle.
 */

/** Splits on a separator, ignoring separators nested inside `()` or `[]`. */
export const splitTopLevel = (value: string, separator: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of value) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;

    if (char === separator && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);

  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
};

/** Index of the `)` matching the `(` that opens at `openIndex`. */
const findClosingParen = (value: string, openIndex: number): number => {
  let depth = 0;
  for (let i = openIndex; i < value.length; i += 1) {
    if (value[i] === "(") depth += 1;
    else if (value[i] === ")") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

export type ResolveVarsOptions = {
  /**
   * Custom properties whose name should survive resolution, e.g. the spring
   * easings: `var(--motion-spring-bouncy)` carries meaning that its
   * `linear(...)` definition would lose on the native side.
   */
  keepSymbolic?: (name: string) => boolean;
};

/** Replaces every `var(--name, fallback)` with its value, recursively. */
export const resolveVars = (
  value: string,
  vars: Record<string, string>,
  options: ResolveVarsOptions = {}
): string => {
  const { keepSymbolic } = options;

  const resolve = (input: string, seen: Set<string>): string => {
    const start = input.indexOf("var(");
    if (start === -1) return input;

    const open = input.indexOf("(", start);
    const close = findClosingParen(input, open);
    if (close === -1) return input;

    const args = splitTopLevel(input.slice(open + 1, close), ",");
    const name = args[0] ?? "";
    const fallback = args.slice(1).join(", ");

    let replacement: string;
    if (keepSymbolic?.(name)) {
      replacement = `var(${name})`;
    } else if (vars[name] !== undefined && vars[name] !== "" && !seen.has(name)) {
      replacement = resolve(vars[name], new Set([...seen, name]));
    } else if (fallback) {
      replacement = resolve(fallback, seen);
    } else {
      replacement = "";
    }

    const rest = resolve(input.slice(close + 1), seen);
    return `${input.slice(0, start)}${replacement}${rest}`;
  };

  return resolve(value, new Set()).replace(/\s+/g, " ").trim();
};

type Measure = { value: number; unit: string };

const UNIT_PATTERN = /^([+-]?(?:\d+\.?\d*|\.\d+))(e[+-]?\d+)?([a-z%]*)$/i;

/** `"12.5deg"` -> `{ value: 12.5, unit: "deg" }`. */
export const parseMeasure = (raw: string): Measure | null => {
  const match = UNIT_PATTERN.exec(raw.trim());
  if (!match) return null;
  const [, digits, exponent, unit] = match;
  return { value: Number(`${digits}${exponent ?? ""}`), unit: unit ?? "" };
};

const formatMeasure = ({ value, unit }: Measure): string => {
  const rounded = Math.round(value * 1e6) / 1e6;
  return `${rounded}${unit}`;
};

const combine = (
  left: Measure,
  right: Measure,
  operator: "+" | "-" | "*" | "/"
): Measure => {
  if (operator === "*" || operator === "/") {
    if (left.unit && right.unit && left.unit !== right.unit) {
      throw new Error(`cannot ${operator} "${left.unit}" by "${right.unit}"`);
    }
    const unit = operator === "*" ? left.unit || right.unit : left.unit;
    const value =
      operator === "*" ? left.value * right.value : left.value / right.value;
    return { value, unit };
  }

  if (left.unit && right.unit && left.unit !== right.unit) {
    throw new Error(`cannot ${operator} "${left.unit}" and "${right.unit}"`);
  }
  const unit = left.unit || right.unit;
  const value =
    operator === "+" ? left.value + right.value : left.value - right.value;
  return { value, unit };
};

/** Evaluates a `calc()` body: numbers, units, `+ - * /` and nested parentheses. */
const evaluateExpression = (expression: string): Measure => {
  const tokens = expression
    .replace(/([*/()])/g, " $1 ")
    // Only treat `+`/`-` as operators when they are surrounded by whitespace,
    // which is what the CSS `calc()` grammar requires anyway.
    .replace(/\s+([+-])\s+/g, " $1 ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);

  let position = 0;
  const peek = (): string | undefined => tokens[position];

  const parseAtom = (): Measure => {
    const token = tokens[position];
    if (token === undefined) throw new Error("unexpected end of expression");
    position += 1;

    if (token === "(") {
      const value = parseSum();
      if (peek() !== ")") throw new Error("missing closing parenthesis");
      position += 1;
      return value;
    }

    const measure = parseMeasure(token);
    if (!measure) throw new Error(`unexpected token "${token}"`);
    return measure;
  };

  const parseProduct = (): Measure => {
    let left = parseAtom();
    while (peek() === "*" || peek() === "/") {
      const operator = tokens[position] as "*" | "/";
      position += 1;
      left = combine(left, parseAtom(), operator);
    }
    return left;
  };

  const parseSum = (): Measure => {
    let left = parseProduct();
    while (peek() === "+" || peek() === "-") {
      const operator = tokens[position] as "+" | "-";
      position += 1;
      left = combine(left, parseProduct(), operator);
    }
    return left;
  };

  const result = parseSum();
  if (position !== tokens.length) {
    throw new Error(`unexpected token "${tokens[position]}"`);
  }
  return result;
};

/** Replaces every `calc(...)` in a value with its computed result. */
export const evaluateCalc = (value: string): string => {
  const start = value.indexOf("calc(");
  if (start === -1) return value;

  const open = value.indexOf("(", start);
  const close = findClosingParen(value, open);
  if (close === -1) return value;

  const body = evaluateCalc(value.slice(open + 1, close));
  const head = value.slice(0, start);
  const tail = evaluateCalc(value.slice(close + 1));

  try {
    return `${head}${formatMeasure(evaluateExpression(body))}${tail}`;
  } catch {
    return `${head}calc(${body})${tail}`;
  }
};

/** `"0.4s"` -> `400`, `"250ms"` -> `250`. */
export const parseTimeMs = (raw: string): number | null => {
  const measure = parseMeasure(evaluateCalc(raw));
  if (!measure) return null;
  if (measure.unit === "s") return measure.value * 1000;
  if (measure.unit === "ms" || measure.unit === "") return measure.value;
  return null;
};

export const isTimeValue = (raw: string): boolean => parseTimeMs(raw) !== null;
