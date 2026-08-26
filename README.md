# tailwind-motion-native

**Animate your Expo app with Tailwind classes.**

[tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) gives Tailwind a
lovely animation vocabulary — `motion-preset-slide-up`, `motion-preset-pop`,
`motion-opacity-in-0 motion-duration-1000`. It compiles to CSS keyframes, which
React Native doesn't have.

This package brings the vocabulary to [Nativewind](https://www.nativewind.dev):
it resolves those classes in JavaScript and plays them with
[Reanimated](https://docs.swmansion.com/react-native-reanimated/), on iOS,
Android and web.

```tsx
import { Motion } from 'tailwind-motion-native';

<Motion.View className="motion-preset-slide-up rounded-2xl bg-white p-6">
  <Motion.Text className="motion-preset-fade motion-delay-200 text-xl font-bold">
    Hello, motion
  </Motion.Text>
</Motion.View>;
```

No keyframes. No `useSharedValue`. No Babel, Metro or Tailwind config.

---

## 1. Start a new Nativewind project

Nativewind's own quickstart template (Expo + Tailwind + Reanimated, already wired up):

```bash
npx rn-new@latest --nativewind
```

<details>
<summary>Other starting points</summary>

```bash
# Expo Router + Nativewind
npx rn-new@latest --nativewind --exporouter

# Nativewind v5 preview (Reanimated 4)
npx rn-new@next --nativewind
```

Already have an app? Follow
[Nativewind's installation guide](https://www.nativewind.dev/docs/getting-started/installation)
first — this package needs `nativewind` and `react-native-reanimated` to be
working.

</details>

## 2. Set up tailwind-motion-native

```bash
npx expo install tailwind-motion-native
```

That's the whole setup. `motion-*` classes are resolved at runtime, so there is
nothing to add to `tailwind.config.js`, `babel.config.js` or `metro.config.js`.

> [!TIP]
> Your other Tailwind classes still go through Tailwind, so keep
> `content` in `tailwind.config.js` pointing at every folder with components in
> it.

## 3. Animate away!

### Fade, slide, pop

Any [tailwindcss-motion preset](https://docs.rombo.co/tailwind/using-presets),
mixed in with your normal classes:

```tsx
import { Motion } from 'tailwind-motion-native';

export function Card() {
  return (
    <Motion.View className="motion-preset-pop gap-1 rounded-2xl bg-white p-5 shadow">
      <Motion.Text className="text-lg font-semibold">Nice and springy</Motion.Text>
      <Motion.Text className="text-sm text-slate-500">motion-preset-pop</Motion.Text>
    </Motion.View>
  );
}
```

`Motion.View`, `Motion.Text`, `Motion.Image` and `Motion.ScrollView` take every
prop their React Native counterparts do.

### Stagger a list with one class

```tsx
{
  messages.map((message, index) => (
    <Motion.View
      key={message.id}
      className={`motion-preset-slide-left motion-delay-[${index * 120}ms] rounded-2xl bg-white p-4`}>
      <Motion.Text className="font-medium">{message.title}</Motion.Text>
    </Motion.View>
  ));
}
```

Arbitrary values like `motion-delay-[240ms]` work even though Tailwind never sees
the class — the delay is computed at runtime, so a template string is fine.

### Loop forever

```tsx
<Motion.Text className="motion-preset-spin text-2xl">↻</Motion.Text>
<Motion.View className="motion-preset-pulse h-3 w-3 rounded-full bg-red-500" />
<Motion.Text className="motion-preset-float text-3xl">☁️</Motion.Text>

{/* ...or stop after a couple of laps */}
<Motion.View className="motion-preset-seesaw motion-loop-twice p-4" />
```

Mirror loops (`pulse`, `float`, `seesaw`, …) become Reanimated's
`withRepeat(..., reverse)`; reset loops (`spin`) restart each lap.

### Compose your own animation

Presets are just bundles of base utilities, so build your own:

```tsx
<Motion.View
  className="
    motion-translate-y-in-100 motion-opacity-in-0 motion-scale-in-75
    motion-duration-700 motion-ease-spring-bouncy
    motion-delay-300/opacity
    rounded-3xl bg-white p-6
  "
/>
```

Modifiers apply to everything (`motion-duration-700`) or to one property
(`motion-delay-300/opacity`, `motion-duration-1000/rotate`).

### Replay on demand

Animations play on mount. Change `motionKey` to play them again:

```tsx
const [likes, setLikes] = useState(0);

<Pressable onPress={() => setLikes((n) => n + 1)}>
  <Motion.Text motionKey={likes} className="motion-preset-shake text-3xl">
    ❤️
  </Motion.Text>
</Pressable>;
```

### Bring your own component

`motion()` wraps anything that forwards `style` and `ref`, and `useMotion()`
hands you the animated style directly:

```tsx
import Animated from 'react-native-reanimated';
import { motion, useMotion } from 'tailwind-motion-native';

const MotionCard = motion(Card); // any component from your design system

function Chart() {
  // onLayout is only defined when the animation moves by a percentage, which is
  // measured from the element.
  const { style, onLayout } = useMotion('motion-preset-slide-up motion-duration-1000');
  return <Animated.View style={style} onLayout={onLayout} />;
}
```

Already on [Moti](https://moti.fyi)? `resolveMotiProps()` returns `from`,
`animate`, `exit` and `transition` for a class string.

> **All of these examples are runnable in [`/examples`](./examples)** —
> `cd examples/expo-nativewind && npm install && npx expo start`.

---

## Why not just Nativewind's `animate-*`?

Nativewind already runs keyframe animations: `animate-spin`, `animate-pulse`, and
your own keyframes from `tailwind.config.js`. If your animation is fixed and you
are happy writing keyframes, you may not need this package.

Two things a CSS animation class can't do, and this is what the
[`/nativewind`](./examples/expo-nativewind/app/nativewind.tsx) screen in the
example app demonstrates side by side:

**1. Springs.** Nativewind v4 drives animations with `withTiming` and an
ease / cubic-bezier / steps curve. Nativewind v5 hands them to Reanimated's CSS
animations, whose easings are cubic-bezier, `linear()` and steps. Neither has a
spring, because CSS doesn't — the closest a class gets is an overshoot drawn by
hand into a keyframe, fixed at build time. Here, tailwindcss-motion's spring
easings become real `withSpring` calls, and

```tsx
<Motion.View className={`motion-scale-in-50 motion-ease-[spring(${damping})]`} />
```

takes the damping ratio from state. (`spring()` is the one addition to the
tailwindcss-motion vocabulary, for exactly this reason.)

**2. Values that don't exist at build time.** Tailwind compiles CSS before your
app runs, so `animate-[slide_700ms_${index * 110}ms_both]` is a class nobody
generated. Because the class string is parsed at runtime here, every number can
be arithmetic — from an index, a measurement, state, or data:

```tsx
// A stagger whose step is a state variable
className={`motion-preset-slide-left motion-delay-[${index * step}ms]`}

// A different spring recipe per item, re-rolled on every tap
className={`motion-translate-y-in-[${distance}%] motion-rotate-in-[${angle}deg]
            motion-duration-[${duration}ms] motion-ease-[spring(${damping})]`}
```

Measured on that comparison screen: a compiled `animate-slide-in` on five rows
moves all five opacities in lockstep (`0.21, 0.21, 0.21, 0.21, 0.21` sixty
milliseconds in), while `motion-delay-[${index * 110}ms]` offsets them
(`0.27, 0, 0, 0, 0`) — and switching the step to 60ms re-spaces them without
touching the stylesheet.

What you *don't* get in exchange: this runs animations from JavaScript, so it is
Reanimated's shared values rather than Nativewind's own engine, and the class
resolution (cached per class string) happens at runtime rather than at build
time.

For a concrete accounting, [docs/nativewind-parity.md](./docs/nativewind-parity.md)
goes through the six tailwindcss-motion Tailwind Play examples and marks which of
their 58 animated elements Nativewind can reproduce on iOS/Android by itself (27)
and which need a spring, a `linear()` curve or an animated blur (31). It also
records what happens if you simply add `tailwindcss-motion` to a Nativewind
config: it compiles, and plays nothing. Both are measured by
`npm run probe:nativewind`.

---

## What's supported

| Classes | Support | Notes |
| --- | --- | --- |
| `motion-preset-*` enter presets<br>(`fade`, `slide-*`, `rebound-*`, `focus`, `blur-*`, `bounce`, `expand`, `shrink`, `pop`, `compress`, `shake`, `wiggle`) | ✅ | Including the `-sm` / `-md` / `-lg` sizes |
| `motion-preset-*` loop presets<br>(`spin`, `pulse`, `blink`, `float`, `wobble`, `seesaw`, `oscillate`, `stretch`) | ✅ | |
| `motion-{scale,translate-x,translate-y,rotate,opacity}-{in,out,loop}-*` | ✅ | Percentages are relative to the element, like CSS: it is measured, so this works on both architectures |
| `motion-{blur,grayscale}-{in,out,loop}-*` | ✅ | Uses React Native's `filter` (New Architecture); `configureMotion({ enableFilters: false })` to opt out |
| `motion-{bg,text}-{in,out,loop}-*` | ✅ | Animates to/from the element's own `bg-*` / `text-*` colour |
| `motion-duration-*`, `motion-delay-*`, `motion-ease-*`, `motion-loop-*` | ✅ | Global, per property (`/rotate`), and arbitrary (`motion-duration-[1.5s]`) |
| `motion-ease-[spring(0.3)]` | ➕ | Not in tailwindcss-motion: a spring with the damping ratio you pass, since native has springs and CSS doesn't |
| `motion-*-out` exit animations | ⚠️ | Resolved, but you trigger them: `useMotion().playExit()` or Moti's `<AnimatePresence>` |
| `motion-preset-confetti`, `motion-preset-typewriter`, `motion-preset-flomoji` | ❌ | Need pseudo-elements and text metrics; a warning tells you they were ignored |
| `motion-paused` / `motion-running` | ❌ | |
| Variants on motion classes (`dark:motion-preset-fade`) | ❌ | Variants are passed through to Nativewind, which won't know the class |

Springs are real springs: the plugin's `linear()` spring curves are mapped back to
Reanimated `withSpring` by recovering the damping ratio they were generated from,
so `motion-ease-spring-bouncy` bounces the way it does on the web.

Reduced motion is respected by default (movement is skipped, opacity and colour
still animate), matching tailwindcss-motion's `prefers-reduced-motion` behaviour.

## API

| Export | What it does |
| --- | --- |
| `Motion.View` / `.Text` / `.Image` / `.ScrollView` | Drop-in primitives that understand `motion-*` classes |
| `motion(Component)` | Turns any style+ref forwarding component into a motion primitive |
| `useMotion(className, options)` | `{ style, onLayout, className, spec, replay, playExit }` |
| `resolveMotiProps(className)` | Moti `from` / `animate` / `exit` / `transition` props |
| `resolveMotion(className)` | The raw animation data, no React Native needed (`tailwind-motion-native/core`) |
| `configureMotion(config)` | `enableFilters`, `translatePercentage`, `respectReducedMotion`, `warnOnUnsupported` |

Component props: `className`, `motionKey` (replay), `motionEnabled`,
`onMotionEnd`, plus everything the underlying component accepts.

## How it works

There is no build step, and no CSS.

1. The [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) plugin
   source is vendored (`src/core/plugin`) and executed against a mock Tailwind
   plugin API, so `motion-preset-pop` resolves to the exact custom properties and
   `animation` shorthand it would produce on the web.
2. A small CSS layer resolves `var()` chains (with fallbacks) and evaluates
   `calc()` — no PostCSS, no dependencies.
3. Each `animation` shorthand is parsed and mapped onto the properties React
   Native can animate, producing plain JSON: from, to, duration, delay, easing,
   iterations.
4. `useMotion` plays that data with Reanimated shared values, and hands the
   leftover classes to Nativewind.

Because steps 1–3 are pure data, they are covered by plain Node tests — including
a guard that every class the plugin can generate still resolves to a native
animation. Step 4 is covered by Jest tests that render the components on the
native code path and step Reanimated's clock.

## Compatibility

| | Version |
| --- | --- |
| Nativewind | 4.1+ (v5 preview supported) |
| React Native | 0.74+ (Expo SDK 51+) |
| Reanimated | 3.16+ and 4.x |
| Platforms | iOS, Android, web |

Zero runtime dependencies.

## Contributing

```bash
npm install         # installs and builds
npm test            # build + unit tests
npm run demo        # print what a class string resolves to
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release flow and for how to
re-vendor a new tailwindcss-motion version.

## Credits

- [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) by
  [Rombo](https://rombo.co) — the animation vocabulary and the vendored plugin
  source (MIT).
- [Nativewind](https://www.nativewind.dev) and
  [Reanimated](https://docs.swmansion.com/react-native-reanimated/), which do the
  actual heavy lifting.

## License

[MIT](./LICENSE)
