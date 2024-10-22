// Base animatons strings
const createAnimationObject = (name, type, getVar) => ({
    name: `motion-${name}-${type}`,
    duration: getVar(`--motion-${name}-duration`) * getVar(`--motion-${name}-perceptual-duration-multiplier`),
    timingFunction: getVar(`--motion-${name}-timing`),
    delay: getVar(`--motion-${name}-delay`),
    fillMode: 'both'
  });
  
  export const scaleInAnimation = (getVar) => createAnimationObject('scale', 'in', getVar);
  export const scaleOutAnimation = (getVar) => createAnimationObject('scale', 'out', getVar);
  export const translateInAnimation = (getVar) => createAnimationObject('translate', 'in', getVar);
  export const translateOutAnimation = (getVar) => createAnimationObject('translate', 'out', getVar);
  export const rotateInAnimation = (getVar) => createAnimationObject('rotate', 'in', getVar);
  export const rotateOutAnimation = (getVar) => createAnimationObject('rotate', 'out', getVar);
  export const filterInAnimation = (getVar) => createAnimationObject('filter', 'in', getVar);
  export const filterOutAnimation = (getVar) => createAnimationObject('filter', 'out', getVar);
  export const opacityInAnimation = (getVar) => createAnimationObject('opacity', 'in', getVar);
  export const opacityOutAnimation = (getVar) => createAnimationObject('opacity', 'out', getVar);
  export const backgroundColorInAnimation = (getVar) => createAnimationObject('background-color', 'in', getVar);
  export const backgroundColorOutAnimation = (getVar) => createAnimationObject('background-color', 'out', getVar);
  export const textColorInAnimation = (getVar) => createAnimationObject('text-color', 'in', getVar);
  export const textColorOutAnimation = (getVar) => createAnimationObject('text-color', 'out', getVar);


  const animationsByVarName = {
    '--motion-scale-in-animation': scaleInAnimation,
    '--motion-scale-out-animation': scaleOutAnimation,
    '--motion-translate-in-animation': translateInAnimation,
    '--motion-translate-out-animation': translateOutAnimation,
    '--motion-rotate-in-animation': rotateInAnimation,
    '--motion-rotate-out-animation': rotateOutAnimation,
    '--motion-filter-in-animation': filterInAnimation,
    '--motion-filter-out-animation': filterOutAnimation,
    '--motion-opacity-in-animation': opacityInAnimation,
    '--motion-opacity-out-animation': opacityOutAnimation,
    '--motion-background-color-in-animation': backgroundColorInAnimation,
    '--motion-background-color-out-animation': backgroundColorOutAnimation,
    '--motion-text-color-in-animation': textColorInAnimation,
    '--motion-text-color-out-animation': textColorOutAnimation
  }


  // Port matchUtilities to define tailwindAnimations
  const getTailwindAnimationsUtilities = (theme, setVar, getVar) => {
        const tailwindAnimations = {};
        const matchUtilities = (utilities, options) => {
            const parsedUtilities = Object.entries(utilities).reduce((acc, [name, run]) => {
                const { values, supportsNegativeValues = false } = options;
                const utilityValues = values(theme);
                
                const processClassName = (className) => {
                    if (!className.startsWith(acc) && !className.startsWith("-"+acc)) {
                        return null;
                    }
                    const isNegative = className.startsWith("-") && supportsNegativeValues;
                    const valueKey = className.substr(className.startsWith("-") ? 1 : 0).substr(acc.length);
                    if (!utilityValues[valueKey]) {
                        return null;
                    }
                    const value = utilityValues[valueKey];

                    const vars = run(value);
                    Object.keys(vars).filter(v => !v.endsWith('animation')).forEach(varName => {
                        setVar(varName, vars[varName]);
                    });

                    const type = vars.animation?.includes('exit') ? 'exit' : 'enter';
                    const enterAnimations = [];
                    const exitAnimations = [];
                    Object.keys(vars).filter(v => v.endsWith('-animation')).forEach(varName => {
                        if (type === 'enter') {
                            enterAnimations.push(animationsByVarName[varName](getVar));
                        } else {
                            exitAnimations.push(animationsByVarName[varName](getVar));
                        }
                    });

                    return {
                        className,
                        baseClass: acc,
                        valueKey,
                        value,
                        isNegative,
                        type,
                        enterAnimations,
                        exitAnimations
                    }
                };

                return {
                    ...acc,
                    [name]: processClassName,
                }
            }, {});

            Object.assign(tailwindAnimations, parsedUtilities);
        };

        // ////////
        // Code from tailwindcss-motion
        // scale
        matchUtilities(
            {
            "motion-scale-in": (value) => ({
                "--motion-origin-scale-x": value,
                "--motion-origin-scale-y": value,
                "--motion-scale-in-animation": scaleInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),
            "motion-scale-x-in": (value) => ({
                "--motion-origin-scale-x": value,
                "--motion-scale-in-animation": scaleInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),
            "motion-scale-y-in": (value) => ({
                "--motion-origin-scale-y": value,
                "--motion-scale-in-animation": scaleInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-scale-out": (value) => ({
                "--motion-end-scale-x": value,
                "--motion-end-scale-y": value,
                "--motion-scale-out-animation": scaleOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            "motion-scale-x-out": (value) => ({
                "--motion-end-scale-x": value,
                "--motion-scale-out-animation": scaleOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            "motion-scale-y-out": (value) => ({
                "--motion-end-scale-y": value,
                "--motion-scale-out-animation": scaleOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionScale"),
            }
        );

        // translate
        matchUtilities(
            {
            "motion-translate-x-in": (value) => ({
                "--motion-origin-translate-x": value,
                "--motion-translate-in-animation": translateInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),
            "motion-translate-y-in": (value) => ({
                "--motion-origin-translate-y": value,
                "--motion-translate-in-animation": translateInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-translate-x-out": (value) => ({
                "--motion-end-translate-x": value,
                "--motion-translate-out-animation": translateOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            "motion-translate-y-out": (value) => ({
                "--motion-end-translate-y": value,
                "--motion-translate-out-animation": translateOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionTranslate"),
            supportsNegativeValues: true,
            }
        );

        // rotate
        matchUtilities(
            {
            "motion-rotate-in": (value) => ({
                "--motion-origin-rotate": value,
                "--motion-rotate-in-animation": rotateInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-rotate-out": (value) => ({
                "--motion-end-rotate": value,
                "--motion-rotate-out-animation": rotateOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionRotate"),
            supportsNegativeValues: true,
            }
        );

        // blur
        matchUtilities(
            {
            "motion-blur-in": (value) => ({
                "--motion-origin-blur": value,
                "--motion-filter-in-animation": filterInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-blur-out": (value) => ({
                "--motion-end-blur": value,
                "--motion-filter-out-animation": filterOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionBlur"),
            }
        );

        // grayscale
        matchUtilities(
            {
            "motion-grayscale-in": (value) => ({
                "--motion-origin-grayscale": value,
                "--motion-filter-in-animation": filterInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-grayscale-out": (value) => ({
                "--motion-end-grayscale": value,
                "--motion-filter-out-animation": filterOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionGrayscale"),
            }
        );

        // opacity
        matchUtilities(
            {
            "motion-opacity-in": (value) => ({
                "--motion-origin-opacity": value,
                "--motion-opacity-in-animation": opacityInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-opacity-out": (value) => ({
                "--motion-end-opacity": value,
                "--motion-opacity-out-animation": opacityOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionOpacity"),
            }
        );

        // background-color
        matchUtilities(
            {
            "motion-bg-in": (value) => ({
                "--motion-origin-background-color": value,
                "--motion-background-color-in-animation": backgroundColorInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-bg-out": (value) => ({
                "--motion-end-background-color": value,
                "--motion-background-color-out-animation": backgroundColorOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionBackgroundColor"),
            type: "color",
            }
        );

        // text-color
        matchUtilities(
            {
            "motion-text-in": (value) => ({
                "--motion-origin-text-color": value,
                "--motion-text-color-in-animation": textColorInAnimation,
                animation: "var(--motion-all-enter-animations)",
            }),

            "motion-text-out": (value) => ({
                "--motion-end-text-color": value,
                "--motion-text-color-out-animation": textColorOutAnimation,
                animation: "var(--motion-all-exit-animations)",
            }),
            },
            {
            values: theme("motionTextColor"),
            type: "color",
            }
        );

        return tailwindAnimations;
    }

  
  export const baseAnimationsTheme = {
    motionScale: (theme) => ({ ...theme("scale"), DEFAULT: "50%" }),
    motionTranslate: {
      0: "0%",
      25: "25%",
      50: "50%",
      75: "75%",
      100: "100%",
      150: "150%",
      DEFAULT: "25%",
    },
    motionRotate: (theme) => ({ ...theme("rotate"), DEFAULT: "12deg" }),
    motionBlur: (theme) => theme("blur"),
    motionGrayscale: (theme) => theme("grayscale"),
    motionOpacity: (theme) => ({ ...theme("opacity"), DEFAULT: "0", 0: "0.001" }),
    motionBackgroundColor: (theme) => flattenColorPalette(theme("colors")),
    motionTextColor: (theme) => flattenColorPalette(theme("colors")),
  };
  