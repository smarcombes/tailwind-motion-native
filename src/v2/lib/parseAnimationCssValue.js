import check from 'check-types';
import split from 'string-split-by';
import { keyframes } from '../react-native/keyframes.js';
// import { parseCSSEasing } from './parseEasings.js';


// TODO: Improve using @hookun/parse-animation-shorthand once we'll have it compile
function parseSingleAnimationCssValue(cssValue, getVar) {
    const parts = split(cssValue, ' ');
    if (parts.length !== 5) {
        throw new Error(`Can't parse this animation value: ${cssValue}`)
    }
    const [name, duration, timingFunction, delay, direction] = parts;
    return {
        name,
        duration: parseInt(duration),
        timingFunction,
        delay: parseInt(delay.replace('ms', '')),
        direction,
        moti: {
            ...keyframes[name](getVar),
            transition: {
                type: 'timing',
                duration: parseInt(duration),
                easing: {}, // parseCSSEasing(timingFunction),
                delay:  parseInt(delay.replace('ms', '')),
            }
        }
    };
}

export function parseAnimationCssValue(cssValue, getVar) {
    return split(cssValue, ',')
        .map(v => v.trim())
        .filter(v => v.length > 0 && v !== 'none')
        .map(v => parseSingleAnimationCssValue(v, getVar));
}