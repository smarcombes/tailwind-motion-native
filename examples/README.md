# Examples

[`expo-nativewind/`](./expo-nativewind) is a runnable Expo Router app — the same
one the README's snippets come from. It has three parts: a gallery of the
presets, [Rombo's six Tailwind Play examples](#rombos-examples-on-device)
recreated for native, and a side-by-side comparison with Nativewind's own
animation classes.

```bash
cd examples/expo-nativewind
npm install         # builds the local package and installs it
npx expo start      # then press i, a, or w
```

## Running it on iOS

Nothing here needs a custom native build: the app uses Reanimated,
`react-native-safe-area-context` and `expo-linear-gradient`, all of which ship
inside Expo Go.

```bash
cd examples/expo-nativewind
npm install
npx expo start          # scan the QR code with the Camera app → Expo Go
# or, with Xcode installed:
npx expo start --ios    # boots the iOS simulator
```

The animations that need the New Architecture (blur, and percentage translates if
you switch `configureMotion({ translatePercentage: 'transform' })`) work in Expo
Go for SDK 54+, where the New Architecture is the default.

## Running it on an Android Studio emulator

```bash
# Android Studio → Device Manager → create/start a device (Pixel 7, API 35 is fine)
cd examples/expo-nativewind
npm install
npx expo start --android   # installs Expo Go on the emulator and opens the app
```

If the emulator is already running, `npx expo start` then pressing `a` does the
same thing. To reach a screen directly:

```bash
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081/--/rombo/island"
```

Give the emulator hardware acceleration (Android Studio does this by default via
KVM on Linux, HAXM/Hypervisor.Framework on macOS). Without it the emulator falls
back to a software CPU and renders single-digit frames per second, which says
nothing about how the animations run on a device.

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

## Rombo's examples, on device

[`app/rombo/`](./expo-nativewind/app/rombo) recreates all six Tailwind Play
examples from the [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion)
README, using the upstream class strings unchanged wherever they survive the
port. Each screen has a Replay button and lists what a Nativewind-only version
would lose — see [docs/nativewind-parity.md](../docs/nativewind-parity.md) for
the full accounting.

| Screen | Original |
| --- | --- |
| [`landing.tsx`](./expo-nativewind/app/rombo/landing.tsx) | [Landing page](https://play.tailwindcss.com/uAuVF8F1vC) |
| [`chat.tsx`](./expo-nativewind/app/rombo/chat.tsx) | [Chat dialog](https://play.tailwindcss.com/gjGqEKswjQ) |
| [`island.tsx`](./expo-nativewind/app/rombo/island.tsx) | [Low Battery Dynamic Island](https://play.tailwindcss.com/tvYFbHtNNQ) |
| [`swatches.tsx`](./expo-nativewind/app/rombo/swatches.tsx) | [Apple Color Swatches](https://play.tailwindcss.com/cvQ3Nk3v8j) |
| [`loop.tsx`](./expo-nativewind/app/rombo/loop.tsx) | [Rombo Loop](https://play.tailwindcss.com/MLdegkb9Wq) |
| [`emoji.tsx`](./expo-nativewind/app/rombo/emoji.tsx) | [Emoji Animations](https://play.tailwindcss.com/86s55I4wmC) |

Web-only pieces are substituted rather than faked: gradients use
`expo-linear-gradient`, the SVG logos and remote avatars become emoji and
coloured initials, the lucide battery is drawn with views, and the wordmark's
`hover:` colour loop becomes a tap. Two porting notes worth knowing:

- An animated transform replaces the whole `transform` array, so a static
  `rotate-12` or `scale-x-75` on the same element has to move to a wrapper.
- `origin-bottom-right` isn't mapped by Nativewind; the chat card sets
  `transformOrigin` in a style prop instead.

And a second screen, [`app/nativewind.tsx`](./expo-nativewind/app/nativewind.tsx),
puts Nativewind's own animation classes next to this package where they differ:

| File | Shows |
| --- | --- |
| [`examples/comparison-springs.tsx`](./expo-nativewind/examples/comparison-springs.tsx) | A hand-authored cubic-bezier overshoot vs a real spring whose damping comes from state |
| [`examples/comparison-stagger.tsx`](./expo-nativewind/examples/comparison-stagger.tsx) | One compiled class for every row vs a per-row delay you can change at runtime |
| [`examples/showcase-shuffle.tsx`](./expo-nativewind/examples/showcase-shuffle.tsx) | Twelve spring recipes, re-rolled on every tap |

The Nativewind column uses real compiled keyframes from
[`tailwind.config.js`](./expo-nativewind/tailwind.config.js), so it animates —
the point is what it can't be told to do, not that it does nothing.

Each section in the app has a Replay button, which remounts that example so you
can watch the enter animations again.
