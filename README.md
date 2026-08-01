# tailwind-motion-native

Turn [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) animation classes into [Moti](https://moti.fyi/) / [Reanimated](https://docs.swmansion.com/react-native-reanimated/) animation props for React Native.

```
"motion-preset-slide-up"  →  { from: {...}, animate: {...}, transition: {...} }
```

## Why

[tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) is a great way to describe animations with Tailwind classes (`motion-preset-fade`, `motion-preset-bounce`, ...), but it outputs CSS keyframe animations — which don't exist in React Native. NativeWind can't help here either, since it doesn't support CSS animations.

This project is a proof of concept that bridges the gap: instead of generating CSS, it runs the tailwindcss-motion plugin against a mock Tailwind plugin API in plain JavaScript, resolves the CSS variables and `animation` shorthand it produces, and maps the resulting keyframes to native animation props you can spread onto a Moti component.

## How to start

```bash
yarn install
yarn start
```

This runs `index.js`, a demo that resolves every supported `motion-preset-*` class and prints each step of the pipeline: matched utilities, resolved CSS variables, parsed animation shorthand, and the final merged Moti props.

## How it works

| Folder | What it does |
| --- | --- |
| `source/` | The tailwindcss-motion plugin source (presets, base animations, modifiers), adapted from [romboHQ/tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) |
| `lib/pluginEngine.js` | A minimal mock of the Tailwind plugin API that runs the plugin in plain JS and lets you resolve class names to style objects |
| `lib/` | CSS variable resolution, `animation` shorthand parsing, and merging of per-animation props into a single Moti props object |
| `react-native/keyframes.js` | Maps each CSS keyframe animation (e.g. `motion-translate-in`) to native `from`/`animate` values |
| `constants/` | The Tailwind default theme values needed to run the plugin standalone |
| `index.js` | Demo / test script running the whole pipeline on all presets |

## Status

Experimental. Presets like fade, slide, blur, bounce, pop, shake and wiggle resolve correctly; easing functions and a few exotic presets (confetti, typewriter) are not handled yet.

## License

[MIT](LICENSE)
