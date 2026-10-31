# NOTES

## Assumptions

- Target platform is Android 13+ (API 33). iOS is not required for this take-home.
- `catalog.json` was generated from the brief table and wrapped as `{ "medicines": [...] }` because the original attachment was not in the repo. If the official file is provided later, drop it at `src/features/catalog/data/sources/catalog.json`.
- Location coordinates exist only to support a later "Delivering to: lat,lng" label. This setup does not read them yet.
- One coupon at a time, delivery fee, and bill rules are not implemented yet. Their intended home is documented below.
- `createNoopToastService` is a stand-in. A real toast adapter will replace it when coupon auto-removal needs user feedback.
- `react-native-mmkv` 4 uses Nitro modules, so the app needs a development build. Expo Go is not enough for MMKV.

## Project Architecture

### Why the folders look like this

- `src/app` stays thin so navigation is easy to scan and routes never own business rules.
- Each feature owns `domain`, `data`, and `ui` so search, cart, coupons, and permissions can grow without sharing internals.
- `src/common` holds shared UI primitives. `src/utils` holds pure helpers with no library imports.
- `src/core` owns every third-party boundary. `src/di` is the composition root that wires ports to implementations.

### Why adapters

Feature code depends on ports such as `KeyValueStorage`, not on MMKV. That keeps third-party libraries replaceable.

Example: replace MMKV with AsyncStorage.

1. Add `src/core/storage/asyncStorage.ts` that implements `KeyValueStorage`.
2. Change the `storage:` line in `createAppDependencies` to use the new factory.
3. Leave search, cart, coupon, and persistence consumers untouched.

The same replacement story applies to Zustand via `createStore` / `createPersistedStore`, and to location, notifications, and settings via their `core` ports.

## Dependency Rule

- Domain imports only own domain and `utils`.
- Data imports own domain and core ports.
- UI imports own domain, common, theme/state facades, and `useDependencies()`.
- App imports feature public APIs only.
- Core imports third-party libraries.
- DI constructs implementations.

ESLint `no-restricted-imports` enforces the third-party bans for `src/features`, `src/app`, `src/common`, and `src/utils`, and applies a stricter set for `**/domain/**`.

## Key Design Decisions and Trade-offs

- **Composition root instead of a DI library.** `createAppDependencies` plus React Context is enough for this app size and stays easy to fake in tests later.
- **Zustand behind `core/state`.** Features never import Zustand. Persistence plugs into `KeyValueStorage`, so storage and state adapters stay independent.
- **Coupon and bill logic will live in domain modules.** Planned homes: `src/features/coupons/domain` for coupon rules, `src/features/cart/domain` for bill/delivery fee math. They will be pure functions so tests need no React. Not implemented in this setup.

## Testing Strategy

Jest was deferred during project setup. When features land, automated tests must cover:

- delivery-fee threshold (₹40 under ₹499, free otherwise)
- each coupon rule (FLAT50, SAVE10, FREEDEL, FIRST100)
- SAVE10 maximum discount of ₹100
- FIRST100 one-time use
- coupon auto-removal when cart no longer qualifies
- `maxQty` cap

Domain tests should not need React. Repository and mapper tests can use in-memory fakes of core ports.

## What I'd Do Differently With More Time

- Replace the noop toast with a real adapter and UI surface.
- Add persisted-store version migration helpers for corrupt or outdated saved state.
- Add an EAS development-client build profile for Android APK delivery.
- Add Jest and the bill/coupon test suite early, before UI work.

## How I Used AI

Setup was directed from the approved design spec and implementation plan. Library APIs were checked against the installed Expo SDK 58 and package type definitions instead of training memory. Feature behaviour (permissions flow, search, cart, coupons) was refused during setup so the skeleton stayed within scope.
