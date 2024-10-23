import check from 'check-types';

// TODO: Add support for exitTransition and other keys
export function mergeMotiProps(propsArray) {
    if (!check.nonEmptyArray(propsArray)) {
        return {};
    }

    // Clean animations array
    const cleanProps = propsArray.filter(check.nonEmptyObject);
    if (cleanProps.length === 0) {
        return {};
    }
    if (cleanProps.length === 1) {
        return cleanProps[0];
    }

    // Prepare the output props object
    const out = {};
    const addOutProp = (base, key, val) => {
        if (!check.nonEmptyString(key) || !check.nonEmptyString(base)) {
            return;
        }
        if (val === undefined || val === null) {
            return;
        }
        if (!out[base]) {
            out[base] = {};
        }
        out[base][key] = val;
    }

    // Transform each animation into clean per-animation-key props
    cleanProps.forEach(animationProps => {
        const animatedKeys = Object.keys(animationProps.animate).filter(key => {
            let valueChanges = false;
            if (animationProps.from?.[key] !== undefined && animationProps.from[key] !== animationProps.animate[key]) {
                valueChanges = true;
            }
            if (animationProps.exit?.[key] !== undefined && animationProps.exit[key] !== animationProps.animate[key]) {
                valueChanges = true;
            }
            return valueChanges;
        });

        let cleanTransition = undefined;
        if (animationProps.transition) {
            cleanTransition = {};
            if (check.nonEmptyString(animationProps.transition.timing)) {
                cleanTransition.timing = animationProps.transition.timing;
            }
            if (animationProps.transition.duration) {
                cleanTransition.duration = animationProps.transition.duration;
            }
            if (animationProps.transition.easing) {
                cleanTransition.easing = animationProps.transition.easing;
            }
            if (animationProps.transition.delay) {
                cleanTransition.delay = animationProps.transition.delay;
            }
        }

        const transitionPerKey = animatedKeys.reduce((acc, val) => ({
            ...acc,
            [val]: cleanTransition,
        }), {});

        animatedKeys.forEach(key => {
            // Add any existing keys to the right place
            addOutProp('from', key, animationProps.from?.[key]);
            addOutProp('animate', key, animationProps.animate?.[key]);
            addOutProp('exit', key, animationProps.exit?.[key]);
            addOutProp('transition', key, transitionPerKey[key]);
        });
    });

    // Merge transitions together if we can
    const finalAnimatedKeys = Object.keys(out.animate || {});
    const allTransitionProps = {
        delay: [],
        duration: [],
        type: [],
        repeat: [],
        repeatReverse: [],
        loop: [],
        easing: [],
    }
    const transitionKeys = Object.keys(allTransitionProps);

    finalAnimatedKeys.forEach(aKey => {
        transitionKeys.forEach(tKey => {
            allTransitionProps[tKey].push(out.transition?.[aKey]?.[tKey]);
        });
    });

    console.log('>>>> out =', JSON.stringify(out, null, 4))
    console.log('>>>> finalAnimatedKeys =', JSON.stringify(finalAnimatedKeys, null, 4))
    console.log('>>>> allTransitionProps =', JSON.stringify(allTransitionProps, null, 4))

    const sharedTransitionProps = Object.keys(allTransitionProps).reduce((acc, key) => {
        if (check.nonEmptyArray(allTransitionProps[key])) {
            const countPerValue = new Map();
            allTransitionProps[key].forEach(val => {
                if (val === undefined) {
                    return;
                }
                if (!countPerValue.has(val)) {
                    countPerValue.set(val, 0);
                }
                countPerValue.set(val, countPerValue.get(val) + 1);
            });

            const entries = [...countPerValue.entries()].filter(([_, count]) => count > 1);
            if (check.nonEmptyArray(entries)) {
                const mostCommonValue = [...countPerValue.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0];
                acc[key] = mostCommonValue;
            }   
        }

        return acc;
    }, {});

    const mergedTransition = {
        ...sharedTransitionProps,
        ...(Object.assign({}, ...finalAnimatedKeys.map(key => {
            const transitionForKey = {};
            Object.keys(out.transition[key]).forEach(tKey => {
                const val = out.transition[key][tKey];
                if (val !== undefined && val !== null && val !== sharedTransitionProps[tKey]) {
                    transitionForKey[tKey] = val;
                }
            });

            if (!check.nonEmptyObject(transitionForKey)) {
                return null;
            }

            return {
                [key]: transitionForKey,
            };
        }).filter(check.nonEmptyObject))),
    }

    out.transition = mergedTransition;

    return out;
}