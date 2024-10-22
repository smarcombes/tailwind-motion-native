import check from 'check-types';
import postcss from 'postcss';
import postcssCalc from 'postcss-calc';

export function resolveCSSVars(cssString, vars) {
  // Recursively resolve `var(--varName)` in the CSS string using the known vars dict
  function resolveVarRecursively(value) {
    const varRegex = /var\(--([\w-]+)\)/g;

    if (!check.nonEmptyString(value)) {
      return value;
    }
    
    return value.replace(varRegex, (_, varName) => {
      const resolvedValue = vars[varName];
      if (resolvedValue === undefined) {
        throw new Error(`Variable --${varName} not found in context.`);
      }
      
      // Resolve the value recursively in case it references other variables
      return resolveVarRecursively(resolvedValue);
    });
  }

  // Resolve all variables in the input CSS string
  const resolvedCSS = resolveVarRecursively(cssString);

  // Use postcss with the postcss-calc plugin to compute the final static value
  const result = postcss([
    postcssCalc(),
  ]).process(`body { val: ${resolvedCSS} }`, { from: undefined }).css;
  
  // Remove the `body { val:` and `}` parts from the result
  return result.split('val:')[1].trim().slice(0, -1).trim();
}

