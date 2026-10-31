# NOTES

## Assumptions

- Target platform is **Android 13+ (API 33)** only. Enforced via `expo-build-properties` (`android.minSdkVersion: 33`). Confirmed in Gradle as `minSdk: 33`. iOS is not required.
- `catalog.json` was generated from the brief table as `{ "medicines": [...] }` because the original attachment was not in the repo.
- Location is only for a generic `Delivering to: lat,lng` string. No reverse geocoding.
- UI scope is brief-first with a Plazza skin (pink/purple). Marketing chrome from screenshots (Rewards, category chips, voice mic, doctor promo, fake street address) is **out of scope**.
- Coupons apply via **ticket cards only** (FLAT50, SAVE10, FREEDEL, FIRST100). No free-text code field.
- One coupon at a time. Auto-remove with toast when cart no longer qualifies.
- SAVE10 is 10% of **item total**, capped at ₹100. Discount never exceeds item total (clamped in bill).
- FREEDEL stays eligible on a non-empty cart even when delivery is already free (item total ≥ ₹499); bill fee remains ₹0.
- FIRST100 is marked used only on **Place order**, mocked locally.
- `react-native-mmkv` 4 needs a **development / native build**, not Expo Go.
- React is pinned to `19.3.1` (`expo.install.exclude`) for `react-dom` peer resolution.

## Project Architecture

### Why the folders look like this

```
src/app          → Expo Router only (thin)
src/di           → composition root (only place `new` adapters/repos)
src/core         → third-party ports + adapters
src/common       → shared UI
src/utils        → pure helpers
src/features/*
  domain / data / ui
```

- `app` stays thin so navigation never owns business rules.
- `common` / `utils` stay outside features to avoid cross-feature UI/logic dragnets.
- `core` + adapters: features depend on ports (`KeyValueStorage`, `ToastService`), not MMKV / ToastAndroid / Expo APIs. Swap a library by adding an adapter and changing one line in `createAppDependencies`.

### Why features are separate (especially `coupons`)

| Feature | Responsibility | Why not merged |
| --- | --- | --- |
| `catalog` | Load medicines | Data source changes without touching search UI |
| `permissions` | OS permission lifecycle | Device concern; unrelated to bill math |
| `search` | Query, recents, results | Can change UX without coupon rules |
| `cart` | Lines, maxQty, **bill assembly**, place-order orchestration | Order totals stay one place |
| `coupons` | **Strategy rules**, registry, ticket UI, used-codes | Bonus + live extension: new coupon type = new rule file + registry line; **cart/bill files untouched** |

This is a **modular monolith**: separate feature folders, one app. Cross-feature use goes through each feature’s `index.ts` public API only.

**Coding patterns:**

- **Clean Architecture** per feature (domain ← data ← ui; dependencies point inward).
- **Strategy** for each coupon (`CouponRule.isEligible` / `evaluate`).
- **Registry / Factory** (`getCouponRule`, `listCouponRules`) so UI/cart never `switch` on codes.
- **Composition root** DI (`useDependencies`) instead of a DI framework.

### SOLID (practical)

- **S**ingle responsibility: bill calculator ≠ FLAT50 eligibility; permission banner ≠ search filter.
- **O**pen/closed: add `NEWCOUPON` by adding a rule module; do not edit `calculateBill`.
- **L**iskov: any `CouponRule` is interchangeable behind the interface.
- **I**nterface segregation: narrow ports (`SettingsLinker` ≠ full Linking API).
- **D**ependency inversion: viewmodels depend on `CatalogRepository` / `ToastService`, not concrete libs.

### Scalability / use cases encoded in domain

- Apply coupon → eligibility gate → set `activeCode` or toast reason.
- Cart mutate → re-validate active coupon → auto-remove + toast.
- Replace coupon → new code wins if eligible.
- Place order → mark FIRST100 used if active → clear cart + coupon.
- Ticket badges call the **same** `isEligible` as apply/auto-remove (one source of truth).

## Dependency Rule

- Domain: own domain + `utils` only.
- Data: domain + core ports.
- UI: domain, common, `core/theme`, `core/state`, `useDependencies()` — never data impls.
- App: feature `index.ts` only.
- Core: third-party libraries only here.
- DI: constructs implementations.

ESLint `no-restricted-imports` enforces library bans for features/app/common/utils and stricter bans for `**/domain/**`.

## Key Design Decisions and Trade-offs

- **Strategy + Registry for coupons (not a switch).** Impresses the “add a coupon type” live exercise; satisfies pluggable-rules bonus.
- **Cart owns bill; coupons own effects.** Coupons return `CouponEffect` (`flat` | `percent` | `freeDelivery`). Cart applies effects and clamps discount ≤ item total. Coupons never import cart UI/state.
- **Versioned persistence** (`{ version, data }`) for cart, recents, used coupons. Corrupt/missing → safe defaults (bonus).
- **ToastAndroid behind `ToastService`.** Android-only is fine for this brief; no extra toast library.
- **UI scope A over screenshot fidelity.** Brief flows first; ticket cards still match screenshot spirit for coupons.
- **Jest domain tests first.** Mandatory matrix: delivery threshold, each coupon, SAVE10 cap, FIRST100 used, auto-remove, maxQty — pure TS, no renderer required.
- Composition root over a DI library (simpler for this size).

## Testing Strategy

Automated tests (jest-expo) cover at minimum:

- Delivery fee: ₹40 when item total &lt; ₹499; free when ≥ ₹499
- FLAT50 / SAVE10 / FREEDEL / FIRST100 eligibility + effects
- SAVE10 max discount ₹100
- FIRST100 blocked after use
- Auto-removal when cart no longer qualifies
- maxQty cap
- Discount never exceeds item total

## What I'd Do Differently With More Time

- Richer toast UI (in-app banner) instead of system toast only
- Persistence migrations between versions beyond “reset on mismatch”
- Visual regression for ticket cards
- Full E2E on a device farm for permission blocked → Settings → return

## Accessibility

- Interactive controls use `accessibilityRole` / `accessibilityLabel` (search field, recent chips, qty steppers, coupon cards, permission CTAs).
- Touch targets use `min-h-touch` (44) from theme tokens.

## How I Used AI

- Project setup and feature design were driven from an explicit brainstorm → approved spec → implementation plan (not blind generate-and-pray).
- Library APIs checked against installed Expo SDK 58 types.
- Coupon edge cases (empty cart SAVE10, FREEDEL when fee already 0, discount clamp, FIRST100 timing) were decided in the design doc before coding.
- Features landed as separate commits (permissions, search, cart/bill, coupon rules, coupon UI).
- Rejected approaches: coupon `switch` inside cart bill, deep cross-feature imports, Expo Go for MMKV.

## Build / run

```bash
npx expo lint
npx tsc --noEmit
npm test
npx eas-cli@latest build -p android --profile preview
```

Needs an EAS project (`eas init`) and Android credentials the first time. Profile `preview` outputs an installable APK. MMKV requires a native build (preview or development client), not Expo Go.

Design references:

- `docs/superpowers/specs/2026-10-31-assignment-features-design.md`
- `docs/superpowers/plans/2026-10-31-assignment-features.md`
