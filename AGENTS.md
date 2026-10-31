This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Architecture

```
src/
  app/           # Expo Router routes only (thin screens)
  di/            # composition root: container + providers
  core/          # third-party adapters (ports + implementations)
  common/        # shared UI components and hooks
  utils/         # pure helpers (no libraries)
  features/
    <name>/
      domain/    # entities, repository interfaces, use cases, rules
      data/      # data sources, DTOs, mappers, repository implementations
      ui/        # screens, components, viewmodels, state, styles
```

## Layer Rules

- **domain**: pure TypeScript. Imports only its own domain and `src/utils`. No React, no Expo, no `core`.
- **data**: data sources, DTOs, mappers, repository implementations. Imports own `domain`, `core` ports, `utils`.
- **ui**: screens, components, view-model hooks (`useXViewModel`), store hooks, styles. Imports own `domain`, `common`, `core/theme`, `core/state`, and `useDependencies()`. Never imports `data` implementations.
- **core**: one folder per capability. Port interface + library adapter + `index.ts` exporting the port type and a factory. Only layer allowed to import third-party packages.
- **di**: only place that constructs adapters and repository implementations (`createAppDependencies`).
- **app**: imports only feature `index.ts` exports.
- Cross-feature imports go through `features/<name>/index.ts` only.

## Adapter Rule

A third-party library is imported only inside its `src/core/<capability>` adapter. Features depend on the port interface, never the library.

Swapping MMKV for another store means a new adapter file plus a one-line change in `createAppDependencies`. Feature files stay. Same for Zustand (`core/state`), Expo Location (`core/location`), Expo Notifications (`core/notifications`), and Expo Linking (`core/linking`).

## Theme Rule

- Colors, spacing, radius, and font sizes live in `src/core/theme/tokens.ts`.
- `tailwind.config.js` reads that file. Components use NativeWind classes backed by those tokens (`bg-brand`, `text-ink`, `px-md`, `rounded-md`, `min-h-touch`).
- Feature screens use `src/features/<feature>/ui/styles/<feature>.styles.ts` for named class strings.
- No hex literals outside `tokens.ts`. Native props that need a color (for example `ActivityIndicator`) take `colors.*` from `@/core/theme`.

## New-Feature Checklist

1. Create `domain/`, `data/`, and `ui/{screens,components,viewmodels,state,styles}/`.
2. Export the screen (and public types) from `features/<name>/index.ts`.
3. Add a thin route under `src/app` that renders the feature screen.
4. Register any new repositories in `AppDependencies` and `createAppDependencies`.

## New-Adapter Checklist

1. Add `Port.ts`, `libAdapter.ts`, and `index.ts` under `src/core/<capability>`.
2. Construct the adapter only in `src/di/container.ts`.
3. Add the package name to the ESLint `no-restricted-imports` bans for features/app/common/utils.

## Project Commands

```bash
npx expo lint
npx tsc --noEmit
npx expo start
```
