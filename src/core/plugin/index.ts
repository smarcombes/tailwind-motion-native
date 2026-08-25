import { addBaseAnimations, baseAnimationsTheme } from "./baseAnimations.js";
import addDefaults from "./defaults.js";
import addKeyframes from "./keyframes.js";
import { addModifiers, modifiersTheme } from "./modifiers.js";
import { addPresets } from "./presets.js";
import type { PluginAPI } from "./api.js";

/** The tailwindcss-motion plugin body, unchanged from upstream. */
export const pluginCreator = ({
  matchUtilities,
  theme,
  addBase,
  addUtilities,
  addComponents,
  matchComponents,
}: PluginAPI): void => {
  addDefaults(addBase);
  addKeyframes(addBase);
  addPresets(addComponents, matchComponents);
  addBaseAnimations(matchUtilities, theme);
  addModifiers(matchUtilities, addUtilities, theme);
};

/** The theme extensions the plugin registers (`motionScale`, `motionDuration`, ...). */
export const pluginTheme = {
  ...modifiersTheme,
  ...baseAnimationsTheme,
};

export const UPSTREAM_VERSION = "1.1.1";
