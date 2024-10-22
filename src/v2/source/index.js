import addKeyframes from "./keyframes.js";
import addDefaults from "./defaults.js";
import { addBaseAnimations, baseAnimationsTheme } from "./baseAnimations.js";
import { addModifiers, modifiersTheme } from "./modifiers.js";
import { addPresets } from "./presets.js";

/** @type {import('tailwindcss/types/config').PluginCreator} */
export const pluginCreator = ({
  matchUtilities,
  theme,
  addBase,
  addUtilities,
  addComponents,
  matchComponents,
}) => {
  addDefaults(addBase);
  addKeyframes(addUtilities);
  addModifiers(matchUtilities, theme);
  addBaseAnimations(matchUtilities, theme);
  addPresets(addComponents, matchComponents, theme);
};

/** @type {import('tailwindcss/types/config').Config}*/
export const pluginConfig = {
  theme: {
    ...modifiersTheme,
    ...baseAnimationsTheme,
  },
};
