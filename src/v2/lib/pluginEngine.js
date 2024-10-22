import check from 'check-types';
import { TAILWIND_DEFAULT_THEME } from "../constants/tailwindConstants.js";

const buildTheme = (modifiers) => {
    const themeVar = { ...TAILWIND_DEFAULT_THEME };

    const themeFunction = (path) => {
        if (themeVar[path]) {
            return themeVar[path];
        } else if (modifiers[path]) {
            if (check.function(modifiers[path])) {
                return modifiers[path](themeFunction);
            }
            if (check.nonEmptyObject(modifiers[path])) {
                return { ...modifiers[path] };
            }
        } else {
            throw new Error(`Unknown theme path: ${path}`);
        }
    };

    return { theme: themeFunction };
};

const createUtility = (baseClasses, params) => {
    if (!check.nonEmptyObject(baseClasses)) {
        throw new Error("buildUtility: baseClasses must be a non-empty object");
    }

    const utility = {
        baseClasses,
        params: params || {},

        // Parse a class name into a base class, modifier, and value
        parseClassName: (rawClassName) => {
            let isNegative = false;
            let className = rawClassName.trim();
            if (rawClassName.startsWith(".")) {
                className = rawClassName.slice(1);
            }
            if (rawClassName.startsWith("-")) {
                if (utility.params.supportsNegativeValues) {
                    isNegative = true;
                    className = rawClassName.slice(1);
                } else {
                    return false;
                }
            }

            // Make sure className starts with a base class
            const baseClass = Object.keys(baseClasses).find((bc) => {
                return className.trim().startsWith(bc);
            });
            if (!baseClass) {
                return false;
            }

            console.log('baseClass match found for "'+className+'": ', baseClass);
            let rootName = baseClass;

            const { values, modifiers } = utility.params;

            const modifierKeys = [...Object.keys(modifiers || {})];
            const modifier = modifierKeys.find((mod) => {
                return className.trim().startsWith(`${baseClass}-${mod}`);
            });
            if (modifier) {
                rootName = `${baseClass}-${modifier}`;
            }

            const value = Object.keys(values)
                .find((v) => {
                    if (v === "DEFAULT") {
                        return className.trim() === `${rootName}`;
                    }

                    return className.trim() === `${rootName}-${v}`;
                });
            if (!value) {
                return false;
            }

            return {
                baseClass,
                modifier,
                value: isNegative ? `-${value}` : value,
            };
        },

        // Checks if the given classname matches this utility
        matches: (className) => {
            return !!(utility.parseClassName(className));
        },

        resolveToObject: (className) => {
            const parsed = utility.parseClassName(className);
            if (!parsed) {
                throw new Error("Invalid class name");
            }

            const { baseClass, modifier, value } = parsed;
            return utility.baseClasses[baseClass](value, { modifier });
        },

        resolveToVars: (className, setVar) => {
            const obj = utility.resolveToObject(className);
            Object.keys(obj).forEach((key) => {
                setVar(key, obj[key]);
            });
        },
    };

    return utility;
};

const createComponent = (baseClasses) => {
    if (!check.nonEmptyObject(baseClasses)) {
        throw new Error("buildUtility: baseClasses must be a non-empty object");
    }

    const component = {
        baseClasses,
        params: {},

        // Parse a class name into a base class, modifier, and value
        parseClassName: (rawClassName) => {
            let isNegative = false;
            let className = rawClassName.trim();
            if (rawClassName.startsWith(".")) {
                className = rawClassName.slice(1);
            }

            const baseClass = Object.keys(baseClasses).find((bc) => {
                return className.trim().startsWith(bc.replace(".", ""));
            });
            if (!baseClass) {
                return false;
            }

            return { baseClass, modifier: "", value: "DEFAULT" };
        },

        // Checks if the given classname matches this utility
        matches: (className) => {
            return !!(component.parseClassName(className));
        },

        resolveToObject: (className) => {
            const parsed = component.parseClassName(className);
            if (!parsed) {
                throw new Error("Invalid class name");
            }

            return component.baseClasses[parsed.baseClass];
        },

        resolveToVars: (className, setVar) => {
            const obj = component.resolveToObject(className);
            Object.keys(obj).forEach((key) => {
                setVar(key, obj[key]);
            });
        },
    };

    return component;
};

const buildVars = () => {
    const vars = {};

    const addVar = (path, value) => {
        vars[path] = value;
    };

    const getVar = (path) => {
        if (vars[path] === undefined || vars[path] === null) {
            throw new Error(`Unknown var path: ${path}`);
        }
        return vars[path];
    };

    const getVars = () => {
        return { ...vars };
    };

    return {
        addVar,
        getVar,
        getVars,
    };
};

const buildBase = (addVar) => {
    const addBase = (base) => {
        if (!base || typeof base !== "object") {
            throw new Error("Base must be an object");
        }

        Object.keys(base).forEach((key) => {
            if (typeof base[key] !== "object") {
                throw new Error("Sub-Base must be an object");
            }

            Object.keys(base[key]).forEach((subKey) => {
                if (typeof base[key][subKey] === "string") {
                    addVar(`${subKey}`, base[key][subKey]);
                }
            });
        });
    };

    return { addBase };
};

const buildUtilityTools = () => {
    const utilities = [];

    const matchUtilities = (baseClasses, params) => {
        const utility = createUtility(baseClasses, params);

        // Add the utility to the global list
        utilities.push(utility);
    };

    const addComponents = (baseClasses) => {
        const component = createComponent(baseClasses);

        // Add the utility to the global list
        utilities.push(component);
    };

    const solveClassNamesToObjects = (classNames) => {
        const cn = classNames
            .split(" ")
            .filter((str) => check.nonEmptyString(str))
            .map((str) => str.trim());

        const objects = cn
            .map((className) => {
                const utility = utilities.find((u) => u.matches(className));
                console.log('Utility for class "'+className+'": ', utility);
                if (!utility) {
                    return null;
                }

                return utility.resolveToObject(className);
            })
            .filter((obj) => obj !== null);

        return objects;
    };

    const solveClassNamesToVars = (classNames, setVars) => {
        const cn = classNames
            .split(" ")
            .filter((str) => check.nonEmptyString(str))
            .map((str) => str.trim());

        cn
            .forEach((className) => {
                const utility = utilities.find((u) => u.matches(className));
                if (!utility) {
                    return;
                }

                utility.resolveToVars(className, setVars);
            })
            .filter((obj) => obj !== null);
    };

    const listUtilities = () => {
        return utilities;
    };

    return {
        matchUtilities,
        matchComponents: matchUtilities,
        solveClassNamesToObjects,
        solveClassNamesToVars,
        listUtilities,
        addComponents,
        addUtilities: () => {
            /* Unimplemented */
        },
    };
};

export const createPlugin = (pluginCreator, pluginConfig) => {
    const { theme } = buildTheme(pluginConfig?.theme || {});
    const { addVar, getVar, getVars } = buildVars();
    const { addBase } = buildBase(addVar);
    const {
        matchUtilities,
        matchComponents,
        solveClassNamesToObjects,
        solveClassNamesToVars,
        listUtilities,
        addComponents,
        addUtilities,
    } = buildUtilityTools();

    pluginCreator({
        matchUtilities,
        theme,
        addBase,
        addUtilities,
        addComponents,
        matchComponents,
    });

    return { solveClassNamesToObjects, solveClassNamesToVars, listUtilities, getVar, getVars };
};