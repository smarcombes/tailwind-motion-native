# Vendored `tailwindcss-motion` source

`defaults.ts`, `keyframes.ts`, `baseAnimations.ts`, `modifiers.ts` and `presets.ts`
are copied verbatim from [`tailwindcss-motion`](https://github.com/romboHQ/tailwindcss-motion)
v1.1.1 (MIT, © Rombo — see `LICENSE`), with a single edit each: the
`tailwindcss` type/util imports are re-pointed at `./api.ts` and
`../tailwindTheme.ts`.

Keeping the upstream files untouched means a version bump is a copy + re-patch,
and it keeps the class list identical to what `tailwindcss-motion` users already
know. The plugin is executed in plain JavaScript by `../engine.ts`, so
`tailwindcss` is never bundled into an app.

To re-vendor a newer release:

```bash
npm run vendor:upstream -- 1.2.0
```

Then run `npm test` — the class-coverage test will tell you which new utilities
or presets still need a native mapping in `../../native` / `../keyframes.ts`.
