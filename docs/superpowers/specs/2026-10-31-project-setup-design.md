# Project Setup Design — Plazza Take-Home

Date: 2026-10-31
Scope: **initial project setup only**. No feature behaviour (permissions flow, search, cart, coupons, bill) is implemented here.

## 1. Goal

Prepare an Expo (SDK 58, TypeScript) Android app skeleton that follows Clean Architecture and SOLID so later feature work drops into well-defined slots:

- third-party libraries isolated in `src/core` behind ports + adapters
- features split into `domain` / `data` / `ui` layers
- one composition root wires concrete implementations
- one design system (NativeWind + shared tokens)
- architecture documented for humans (`NOTES.md`) and agents (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`)
- import boundaries enforced by ESLint

## 2. Baseline (existing)

- Expo `~58.0.21`, React Native `0.88.1`, React `19.3.0`, TypeScript `~6.0.3`, npm (`package-lock.json`).
- Installed: `expo-router`, `expo-location`, `expo-notifications`, `expo-linking`, `expo-constants`, `react-native-mmkv` (+ `react-native-nitro-modules`), `zustand`, `react-native-safe-area-context`, `react-native-screens`.
- `package.json` `main` points to missing `index.ts`. No `src/`, no lint, no commits.

## 3. Decisions

| Topic | Decision |
| --- | --- |
| Dependency wiring | Composition root in `src/di`; React Context + `useDependencies()`. No DI library. |
| State | Zustand wrapped by `src/core/state` (`createStore`, persist via `core/storage`). Features never import `zustand`. |
| Persistence | MMKV wrapped by `src/core/storage` `KeyValueStorage` port. |
| Styling | NativeWind v4 (stable, Tailwind v3). Tokens in `src/core/theme/tokens.ts`, consumed by `tailwind.config.js`. |
| Feature styles | Each feature has `ui/styles/<feature>.styles.ts` with named class strings. |
| Catalog | `catalog.json` generated from brief table into `src/features/catalog/data/sources/catalog.json`. |
| Tooling | ESLint via `npx expo lint` + import-boundary rules. Tests deferred to feature work (brief still requires them later). |
| Platform | Android 13+ target; iOS untouched. |

## 4. Folder Structure

```
src/
  app/                              # Expo Router routes only (thin)
    _layout.tsx                     # global.css, AppProviders, Stack
    (tabs)/_layout.tsx              # Home + Cart tabs
    (tabs)/index.tsx                # renders features/search screen
    (tabs)/cart.tsx                 # renders features/cart screen
  di/
    container.ts                    # builds adapters + repositories
    DependenciesProvider.tsx        # Context + useDependencies()
    AppProviders.tsx                # SafeArea + Dependencies (+ future toast)
  core/                             # ONLY layer that imports third-party libs
    storage/      KeyValueStorage.ts, mmkvStorage.ts, index.ts
    state/        createStore.ts, persistedStore.ts, index.ts
    permissions/  PermissionService.ts, expoPermissionService.ts, index.ts
    location/     LocationService.ts, expoLocationService.ts, index.ts
    notifications/NotificationService.ts, expoNotificationService.ts, index.ts
    linking/      SettingsLinker.ts, expoSettingsLinker.ts, index.ts
    toast/        ToastService.ts, index.ts (adapter chosen at feature time)
    theme/        tokens.ts, cn.ts, index.ts
  common/
    components/   Screen, AppText, Button, Badge, EmptyState, Loader, index.ts
    hooks/        index.ts
  utils/          money.ts, result.ts, index.ts   # pure, no libs
  features/
    catalog/
      domain/     entities/Medicine.ts, repositories/CatalogRepository.ts
      data/       sources/catalog.json, sources/LocalCatalogDataSource.ts,
                  dtos/MedicineDto.ts, mappers/medicineMapper.ts,
                  repositories/CatalogRepositoryImpl.ts
      index.ts
    search/       domain/ data/ ui/{screens,components,viewmodels,state,styles}/ index.ts
    cart/         domain/ data/ ui/{...}/ index.ts
    coupons/      domain/ data/ ui/{...}/ index.ts
    permissions/  domain/ data/ ui/{...}/ index.ts
global.css
tailwind.config.js
babel.config.js
metro.config.js
nativewind-env.d.ts
eslint.config.js
index.ts                            # expo-router/entry
```

Empty layer folders contain a `.gitkeep` only. Placeholder screens render a `Screen` + title, nothing else.

## 5. Layer Rules

- **domain**: pure TypeScript. Entities, repository interfaces, use cases, rules. Imports only own domain and `src/utils`. No React, no libs.
- **data**: data sources, DTOs, mappers, repository implementations. Imports own `domain`, `core` ports, `utils`.
- **ui**: screens, components, view-model hooks (`useXViewModel`), store hooks (`ui/state`), styles. Imports own `domain`, `common`, `core/theme`, `core/state`, `di` (`useDependencies`). Never imports `data` implementations.
- **core**: one folder per capability. `Port.ts` (interface) + `libAdapter.ts` (implementation) + `index.ts` exporting the port type and a factory. Only layer allowed to import third-party packages.
- **di**: only place `new XImpl()` / adapter factories are invoked.
- **app**: imports only feature `index.ts` exports.
- Cross-feature imports go through `features/<name>/index.ts` only.

ESLint `no-restricted-imports` blocks, inside `src/features/**`, `src/common/**`, `src/utils/**`, `src/app/**`: `zustand`, `react-native-mmkv`, `expo-location`, `expo-notifications`, `expo-linking`, and deep imports into other features. Inside `**/domain/**` additionally: `react`, `react-native`, `expo*`, `@/core/*`, `@/di`, `@/common/*`, and own `data`/`ui` layers.

Path alias: `@/*` → `src/*` (tsconfig `paths`).

## 6. Data Flow (target pattern)

```
Screen (ui/screens)
  -> useXViewModel (ui/viewmodels)       # presentation logic, returns view state + actions
       -> useXStore (ui/state)            # built with core/state createStore
       -> useDependencies().xRepository  # domain interface type
            -> XRepositoryImpl (data)
                 -> XDataSource (data/sources) -> catalog.json | core/storage
```

Setup implements only the catalog chain: `Medicine` entity, `CatalogRepository` interface (`getAll(): Promise<Medicine[]>`), `LocalCatalogDataSource` (imports `catalog.json`), DTO + mapper with validation, `CatalogRepositoryImpl`, wired in `container.ts`.

## 7. SOLID Mapping

- **S**: each file one reason to change (data source loads, mapper maps, repo composes).
- **O**: new coupon/bill rules or adapters added as new modules, not edits to existing consumers.
- **L**: any `KeyValueStorage` / `LocationService` implementation substitutable (MMKV, in-memory fake).
- **I**: narrow ports (`SettingsLinker` separate from `PermissionService`).
- **D**: features depend on interfaces; `di/container.ts` picks implementations.

## 8. Theme

- `tokens.ts` (CommonJS-compatible plain object so `tailwind.config.js` can `require` it): colors (`brand` `#FF2E8B`, `brandDark`, `ink` `#2A1060`, `surface`, `muted`, `text`, `success`, `danger`, `warning`), spacing, radius, fontSize.
- `tailwind.config.js` `theme.extend` built from tokens; `presets: [require('nativewind/preset')]`; content `./src/**/*.{ts,tsx}`.
- Common components use only token-backed classes. Hex literals outside `tokens.ts` disallowed by convention (documented in rules).
- Feature styles: `features/<f>/ui/styles/<f>.styles.ts` exporting `as const` class maps.

## 9. Docs & Agent Rules

- `AGENTS.md`: keep existing Expo section; add Architecture, Layer Rules, Adapter Rule, Theme Rule, New-Feature Checklist, New-Adapter Checklist, Commands (`npx expo lint`, `npx tsc --noEmit`).
- `CLAUDE.md`: `@AGENTS.md` import plus short Claude-specific notes.
- `.cursor/rules/`: `architecture.mdc` (alwaysApply), `core-adapters.mdc` (`src/core/**`), `feature-layers.mdc` (`src/features/**`), `ui-theme.mdc` (`**/*.tsx`), `routing.mdc` (`src/app/**`).
- `NOTES.md` sections: Assumptions; Project Architecture (folder pattern + why; why adapters, with MMKV to AsyncStorage swap example); Dependency Rule; Key Design Decisions & Trade-offs (state, persistence, where coupon and bill logic will live); Testing Strategy; What I'd Do Differently With More Time; How I Used AI.

## 10. Out of Scope

Permission flow, search, recent searches, cart, coupons, bill, toast implementation, tests, EAS/APK build config.

## 11. Verification

- `npx expo lint` passes (including boundary rules — verified by a temporary violating import that must fail, then removed).
- `npx tsc --noEmit` passes.
- `npx expo-doctor` clean or known warnings noted.
- `npx expo start` bundles; tabs render placeholder screens with NativeWind styling.
