import { pluginCreator, pluginConfig } from "./source/index.js";
import { createPlugin } from "./lib/pluginEngine.js";
import { resolveCSSVars } from "./lib/parseCssValue.js";
import { parseAnimationCssValue } from "./lib/parseAnimationCssValue.js";
import { mergeMotiProps } from "./lib/motiProps.js";
import check from 'check-types';

// Instanciate the tailwind-motion plugin via our plugin mock interface
const { solveClassNamesToObjects, solveClassNamesToVars, listUtilities, getVar, getVars } = createPlugin(pluginCreator, pluginConfig);

// List data
console.log('=== List of utilities ===');
console.log(listUtilities());
console.log('');
console.log('=== List of variables ===');
console.log(JSON.stringify(getVars(), null, 4));
console.log('');


const presets = [
    "motion-preset-fade",
	"motion-preset-slide-right",
	"motion-preset-slide-left",
	"motion-preset-slide-up",
	"motion-preset-slide-down",
	"motion-preset-focus",
	"motion-preset-blur-right",
	"motion-preset-blur-left",
	"motion-preset-blur-up",
	"motion-preset-blur-down",
	"motion-preset-bounce",
	"motion-preset-expand",
	"motion-preset-shrink",
	"motion-preset-pop",
	"motion-preset-compress",
	"motion-preset-shake",
	"motion-preset-wiggle",
	// "motion-preset-confetti",
	// "motion-preset-typewriter-[number of characters]",
	// "motion-preset-flomoji"
]
const index = 3;


const runTest = (classNames) => {
    const solved = solveClassNamesToObjects(classNames);
    console.log('=== Solved classes ===');
    console.log(JSON.stringify(solved, null, 4));

    if (!check.nonEmptyArray(solved)) {
        throw new Error('No classes found for input: "'+ classNames +'"');
    }
    
    
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
    
    
    const merged = mergeMotiProps(parsedAnimation.map(a => a.moti));
    console.log('=== Merged animation ===');
    console.log(JSON.stringify(merged, null, 4));
}

// Test all presets
presets.forEach(p => runTest("." + p));