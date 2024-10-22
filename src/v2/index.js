import { pluginCreator, pluginConfig } from "./source/index.js";
import { createPlugin } from "./lib/pluginEngine.js";
import { resolveCSSVars } from "./lib/parseCssValue.js";
import { parseAnimationCssValue } from "./lib/parseAnimationCssValue.js";

// Instanciate the tailwind-motion plugin via our plugin mock interface
const { solveClassNamesToObjects, solveClassNamesToVars, listUtilities, getVar, getVars } = createPlugin(pluginCreator, pluginConfig);

// List data
console.log('=== List of utilities ===');
console.log(listUtilities());
console.log('');
console.log('=== List of variables ===');
console.log(JSON.stringify(getVars(), null, 4));
console.log('');


// Example usage
const classNames = ' .motion-preset-bounce -motion-translate-y-in-150 motion-duration-2000';
const solved = solveClassNamesToObjects(classNames);
console.log('=== Solved classes ===');
console.log(JSON.stringify(solved, null, 4));


const combined = {};
solved.forEach((solvedClass) => {
    Object.assign(combined, solvedClass);
});
console.log('=== Combined classes ===');
console.log(JSON.stringify(combined, null, 4));

const vars = Object.entries({ ...getVars(), ...combined }).filter(([key, value]) => key.startsWith('--')).reduce((acc, [key, value]) => {
    acc[key.substring(2)] = value;
    return acc;
}, {});
console.log('=== Combined vars ===');
console.log(JSON.stringify(vars, null, 4));

const resolved = Object.entries(combined).filter(([key, value]) => !key.startsWith('--')).reduce((acc, [key, value]) => {
    acc[key] = resolveCSSVars(value, vars);
    return acc;
}, {});
console.log('=== Resolved values ===');
console.log(JSON.stringify(resolved, null, 4));

const animation = resolved['animation'];
const parsedAnimation = parseAnimationCssValue(animation, (varName) => vars[varName.replace('--', '')]);
console.log('=== Parsed animation ===');
console.log(JSON.stringify(parsedAnimation, null, 4));