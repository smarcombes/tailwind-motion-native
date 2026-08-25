# Examples

[`expo-nativewind/`](./expo-nativewind) is a runnable Expo Router app — the same
one the README's snippets come from.

```bash
cd examples/expo-nativewind
npm install         # builds the local package and installs it
npx expo start      # then press i, a, or w
```

`npm install` picks up the library from the repo root (`file:../..` with
`install-links=true`, so the example gets a real copy of the built package rather
than a symlink). After changing library source, re-run `npm install` — or, from
the repo root, `npm run example:install`, which packs the tarball `npm publish`
would upload and installs that instead.

## What's in it

| File | Shows |
| --- | --- |
| [`examples/hero.tsx`](./expo-nativewind/examples/hero.tsx) | One preset, three delays |
| [`examples/enter-presets.tsx`](./expo-nativewind/examples/enter-presets.tsx) | Every enter preset, staggered with `motion-delay-[…]` |
| [`examples/loops.tsx`](./expo-nativewind/examples/loops.tsx) | The looping presets |
| [`examples/staggered-list.tsx`](./expo-nativewind/examples/staggered-list.tsx) | A list reveal |
| [`examples/replay-on-press.tsx`](./expo-nativewind/examples/replay-on-press.tsx) | Replaying with `motionKey` |
| [`examples/escape-hatches.tsx`](./expo-nativewind/examples/escape-hatches.tsx) | `motion()` and `useMotion()` |
| [`app/index.tsx`](./expo-nativewind/app/index.tsx) | The gallery that renders them all |

Each section in the app has a Replay button, which remounts that example so you
can watch the enter animations again.
