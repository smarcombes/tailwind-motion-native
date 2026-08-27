# Which tailwindcss-motion examples work with Nativewind alone?

The six [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion)
Tailwind Play examples all work on the web, because they are CSS. This is a
per-example answer for **iOS and Android**: what Nativewind's own animation
classes can reproduce, and what needs this package.

Two things were measured rather than assumed:

- `npm run probe:nativewind` renders animations through Nativewind's native
  pipeline (React Native's iOS jest preset) — see
  [`test/nativewind-parity.probe.tsx`](../test/nativewind-parity.probe.tsx).
  Versions: Nativewind 4.2.6, Reanimated 4.3.1, React Native 0.85.
- Every class string from the six examples was run through this package's
  resolver, so "needs this library" means the classes actually resolve here.

## First: the plugin itself doesn't come along

Adding `plugins: [require('tailwindcss-motion')]` to a Nativewind
`tailwind.config.js` compiles, but plays nothing on native. The probe shows what
reaches the component for `motion-preset-fade`:

```js
{ animation: ["motion-opacity-in", "both"] }   // no duration, no easing, no delay
```

The plugin's `animation` value is `var(--motion-all-enter-animations)`, a list of
seven `calc()`-driven shorthands, and its defaults live in `@property` rules; the
animation name survives that, the timing doesn't, and the keyframes reference
custom properties that never resolve. So a Nativewind port means hand-writing
keyframes in `tailwind.config.js` — the vocabulary is gone either way.

## What Nativewind's classes can do on native

| Capability | Native | Notes |
| --- | --- | --- |
| Multi-step keyframes, `both` fill, delays | ✅ | Delay baked into the animation shorthand |
| Arbitrary shorthand `animate-[name_700ms_ease_200ms_both]` | ✅ | Only as a literal string — see below |
| `opacity`, `rotate`, `scaleX`/`scaleY`, `translateX`/`translateY` | ✅ | |
| Percentage translates in keyframes | ✅ | Passed through as `"37%"`, so New Architecture only |
| `backgroundColor` / `color` | ✅ | Interpolates |
| `infinite`, `alternate`, several animations on one element with their own durations | ✅ | |
| `transform: scale(...)` shorthand | ❌ | Silently dropped; write `scaleX`/`scaleY` |
| `filter` / `blur` | ❌ | Never reaches the style |
| `linear()` easing with stops | ❌ | The animation doesn't run at all |
| Springs | ❌ | The engine only ever calls `withTiming`; Reanimated's CSS easings are cubic-bezier, `linear()` and steps |
| Values computed at runtime | ❌ | Tailwind compiles ahead of time |

The last two are what most of these examples turn on: tailwindcss-motion's
`motion-ease-spring-*` and `motion-ease-bounce` are `linear()` curves with up to
40 stops, and `motion-preset-focus` / `motion-blur-*` animate a blur.

## Example by example

### 1. [Landing page](https://play.tailwindcss.com/uAuVF8F1vC) — 4 of 13 elements

| | |
| --- | --- |
| **Works with Nativewind** | `motion-preset-slide-down` on the logo, `motion-preset-fade` on the heading, `motion-preset-fade-lg` on the two paragraphs. The literal delays (`motion-delay-[700ms]`, `[4s]`) become one animation variant each. |
| **Needs this library** | The three nav links (`motion-preset-rebound-down`) and three cards (`motion-preset-slide-left motion-ease-spring-bouncier`) are springs — ζ≈0.5 with a 16% overshoot. The three `MOTION WITHOUT COMMOTION` words (`motion-preset-blur-left`) animate a blur, so on Nativewind they would slide and fade with no defocus. |

### 2. [Chat dialog](https://play.tailwindcss.com/gjGqEKswjQ) — 5 of 8 elements

| | |
| --- | --- |
| **Works with Nativewind** | The card (`motion-scale-in-0 motion-opacity-in-0`, written as a `scaleX`/`scaleY` keyframe), the heading slide, both buttons and the reload button, delays included. |
| **Needs this library** | The three avatars, which pop in on `motion-ease-spring-bouncier` 100ms apart. A hand-drawn overshoot can imitate one of them; it can't be tuned or reused as a spring. |

### 3. [Low Battery Dynamic Island](https://play.tailwindcss.com/tvYFbHtNNQ) — 1 of 4 elements

| | |
| --- | --- |
| **Works with Nativewind** | The reload button's fade. The pill's non-uniform `motion-scale-x-in-[30%] motion-scale-y-in-90` shape is expressible as a `scaleX`/`scaleY` keyframe. |
| **Needs this library** | Both of the things that make it read as iOS: the pill expands on `motion-ease-spring-bouncy` (ζ≈0.7), and the label and icon use `motion-preset-focus`, which is a blur. Nativewind would give you a linear-ish stretch and a plain fade. |

### 4. [Apple Color Swatches](https://play.tailwindcss.com/cvQ3Nk3v8j) — 1 of 5 elements

| | |
| --- | --- |
| **Works with Nativewind** | The reload button. The geometry of the rest — `motion-scale-in-[20%]`, `motion-translate-y-in-150`, per-swatch delays — is all keyframe-able. |
| **Needs this library** | Every animated element carries `motion-ease-spring-bouncier`; the overshoot *is* the effect. Note `motion-duration-750` isn't a real class upstream either (there is no `750` in the duration scale), so it is inert on the web too — this package reports it as ignored. |

### 5. [Rombo Loop](https://play.tailwindcss.com/MLdegkb9Wq) — 4 of 7 elements

| | |
| --- | --- |
| **Works with Nativewind** | Both gears (`motion-rotate-loop-[360deg]/reset` with a linear easing, one negated — this is `animate-spin`), the blinking bulb (`motion-opacity-loop-50`) and the pulsing bomb (`motion-preset-pulse-sm`). This is the most Nativewind-friendly of the six. |
| **Needs this library** | The floating UFO (`motion-preset-float`, a spring loop) and the hammer (`motion-ease-bounce`, a `linear()` curve — used literally, the animation wouldn't run at all). `hover:motion-text-loop-[#f8ff8c]` is a hover state, which isn't meaningful on touch either way. |

### 6. [Emoji Animations](https://play.tailwindcss.com/86s55I4wmC) — 12 of 21 elements

| | |
| --- | --- |
| **Works with Nativewind** | The linear spins, the opacity loops, `motion-preset-pulse-sm`, the translate loops on cubic-bezier easings (`motion-ease-in-cubic`, `in-quart`, `in-out`), and the combinations with per-property durations (`motion-duration-1000/rotate motion-duration-700/translate`) — several animations per element with their own durations do work. |
| **Needs this library** | Nine emoji: `motion-preset-float`, `motion-preset-stretch-lg`, `motion-preset-seesaw-lg`, `motion-scale-loop-150 motion-ease-spring-bounciest`, the two `motion-ease-bounce` loops, the surfer's `motion-ease-spring-bouncier/rotate`, the spinning-head `motion-rotate-loop-[360deg]/reset motion-ease-spring-bouncier`, and `motion-scale-loop-50 motion-blur-loop-sm` (the eyes lose their blur). |

## Summary

27 of the 58 animated elements across the six examples can be reproduced with
Nativewind alone on iOS/Android — by hand-writing the keyframes, one animation
variant per delay, using `scaleX`/`scaleY` instead of `scale()`, and staying on
the New Architecture for percentage translates.

The other 31 need a spring, the `linear()` bounce curve, or an animated blur.
Those are the three things a CSS animation class can't carry, which is what this
package exists for — plus the classes themselves, which stay the same as the web.
