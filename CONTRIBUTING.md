# Contributing

Thanks for taking a look! Issues and pull requests are welcome.

## Getting set up

```bash
npm install     # also runs `bob build` via the prepare script
npm test        # builds, then runs the unit tests
npm run typecheck
```

The tests run in plain Node against `dist/module/core`, because everything up to
"here is the animation data" is deliberately free of React Native imports.

```bash
npm run demo                                   # all presets
npm run demo -- "motion-preset-pop motion-duration-1000"
```

`npm run demo` prints the resolved animations for a class string — the fastest way
to see what a change does.

## Trying it in a real app

```bash
npm run example:install     # build + npm pack + install the tarball in the example
cd examples/expo-nativewind
npx expo start
```

Installing the packed tarball (rather than linking the source) means the example
consumes exactly what `npm publish` would upload, so a missing entry in `files`
or `exports` shows up locally.

## Layout

| Path | What lives there |
| --- | --- |
| `src/core/plugin` | Vendored tailwindcss-motion source, see its [README](./src/core/plugin/README.md) |
| `src/core` | The Tailwind plugin runner, CSS resolution, and class → animation data |
| `src/native` | Reanimated playback, the `Motion.*` primitives, Nativewind interop |
| `test` | Node unit tests |
| `examples/expo-nativewind` | Runnable demo app |

## Updating tailwindcss-motion

The plugin source is vendored so it can run without Tailwind. To move to a new
release:

```bash
npm run vendor:upstream -- 1.2.0
npm test
```

The `every plugin class resolves to an animation` test fails with a list of any
new utilities that still need a native mapping — add those to
`src/core/keyframes.ts` (and `src/native/useMotion.ts` if they touch a new style
property).

## Releasing

Publishing runs from CI on a tag:

```bash
npm version minor          # or patch / major
git push --follow-tags
```

The `release` workflow builds, tests and publishes to npm using the `NPM_TOKEN`
repository secret (a granular automation token with publish access to
`tailwind-motion-native`). `prepublishOnly` re-runs the typecheck and tests, so a
broken build can't be published by accident.
