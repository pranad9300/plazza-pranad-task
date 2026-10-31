# Assignment Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the full Plazza take-home: permissions, search, cart+bill, Strategy-based coupons, tests, Android API 33, EAS debug APK — on the existing Clean Architecture skeleton.

**Architecture:** Feature modules (`permissions`, `search`, `cart`, `coupons`) with domain/data/ui. Coupon rules use Strategy + Registry. Cart owns bill assembly and consumes `CouponEffect`. Persistence is versioned JSON via `KeyValueStorage`. Toast uses Android `ToastAndroid` behind `ToastService`.

**Tech Stack:** Expo SDK 58, Expo Router, NativeWind 4, Zustand via `@/core/state`, MMKV via `@/core/storage`, jest-expo, EAS Build, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-10-31-assignment-features-design.md`

## Global Constraints

- Android only; `minSdkVersion` **33** (Android 13+)
- UI scope A: Plazza skin; no Rewards / categories / voice / doctor promo
- Coupon apply mode 1: ticket cards only (FLAT50, SAVE10, FREEDEL, FIRST100)
- Bonuses required: pluggable rules, versioned persistence, a11y
- No `any`; features never import `zustand` / `react-native-mmkv` / Expo device libs
- Domain imports only own domain + `@/utils`
- One feature-focused git commit per Task (Tasks 1–9); do not commit the WhatsApp images or the brief markdown unless user asks
- Prefer `npx expo install` for Expo-related packages
- Run `npx tsc --noEmit` and relevant tests before each commit
- Follow existing paths under `src/`; reuse `Screen`, `AppText`, `Button`, `Badge`, `EmptyState`, `Loader`, tokens

## File map (new / primary)

```
src/core/toast/androidToastService.ts
src/core/persistence/versionedStorage.ts          # optional helper in utils or core
src/utils/versionedJson.ts

src/features/permissions/...
src/features/search/...
src/features/cart/domain/{entities,rules,usecases}/
src/features/cart/ui/...
src/features/coupons/domain/rules/{CouponRule.ts,registry.ts,flat50.ts,...}
src/features/coupons/domain/{evaluateCoupon.ts,autoRemove.ts}
src/features/coupons/data/repositories/UsedCouponsRepositoryImpl.ts
src/features/coupons/ui/components/CouponTicketCard.tsx

src/di/container.ts                              # wire toast + usedCoupons

__tests__/domain/bill.test.ts
__tests__/domain/coupons.test.ts
__tests__/domain/cartQty.test.ts

eas.json
app.json                                         # minSdkVersion 33
NOTES.md                                         # decisions (Task 8)
```

---

### Task 1: Toast adapter + Jest harness

**Files:**
- Create: `src/core/toast/androidToastService.ts`
- Modify: `src/core/toast/index.ts`, `src/di/container.ts`
- Create: `jest.config.js`, `__tests__/smoke.test.ts` (or Expo-recommended layout)
- Modify: `package.json` scripts

**Interfaces:**
- Consumes: `ToastService` from `src/core/toast/ToastService.ts`
- Produces: `createAndroidToastService(): ToastService` with `show(message: string): void` using `ToastAndroid.show(message, ToastAndroid.SHORT)`; container uses it instead of noop

- [ ] **Step 1: Install Jest for Expo**

```bash
npx expo install jest-expo jest @types/jest -- --save-dev
```

Follow current Expo SDK 58 testing docs for `jest.config.js` (`preset: 'jest-expo'`). Add script `"test": "jest"`.

- [ ] **Step 2: Write Android toast adapter**

```ts
import { ToastAndroid, Platform } from 'react-native';
import type { ToastService } from './ToastService';

export function createAndroidToastService(): ToastService {
  return {
    show: (message: string) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    },
  };
}
```

Export from `index.ts`. In `createAppDependencies`, replace `createNoopToastService()` with `createAndroidToastService()`.

- [ ] **Step 3: Smoke test + typecheck**

```bash
npx tsc --noEmit
npm test -- --passWithNoTests
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/core/toast src/di/container.ts package.json package-lock.json jest.config.js
git commit -m "$(cat <<'EOF'
chore: add Android toast adapter and Jest harness

EOF
)"
```

---

### Task 2: Permissions feature

**Files:**
- Create: `src/features/permissions/domain/entities/PermissionSnapshot.ts`
- Create: `src/features/permissions/ui/viewmodels/usePermissionsViewModel.ts`
- Create: `src/features/permissions/ui/components/PermissionDebugBanner.tsx`
- Create: `src/features/permissions/ui/components/PermissionRationale.tsx` (blocked/denied CTA)
- Modify: `src/features/permissions/index.ts`
- Modify: `src/features/search/ui/screens/SearchScreen.tsx` (or Home shell) to host banner + request-on-mount
- Use: `AppState` from `react-native` in viewmodel only (not Expo Linking — settings via DI)

**Interfaces:**
- Consumes: `useDependencies().permissions`, `.location`, `.notifications`, `.settingsLinker`, `.toast`
- Produces:
  - `usePermissionsViewModel()` → `{ locationState, notificationState, coords, requestAll, openSettings, refresh }`
  - On mount: `requestAll()` once (track with storage flag `permissions.asked.v1` or in-memory + always refresh on focus — prefer: request on first mount if undetermined; always `refresh` on `AppState` → `active`)
  - Banner text includes both states
  - Blocked → button calls `settingsLinker.openAppSettings()`
  - When location granted → `location.getCurrentCoordinates()` for “Delivering to: {lat},{lng}” (4 decimal places)

- [ ] **Step 1: Implement viewmodel + banner components**

Handle states: `granted` | `denied` | `blocked` | `undetermined` from existing `PermissionState`.

- [ ] **Step 2: Wire into Home screen header area**

Show delivery line + debug banner. Rationale UI when blocked.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: handle location and notification permission lifecycle

EOF
)"
```

---

### Task 3: Search + recent searches

**Files:**
- Create: `src/features/search/domain/usecases/searchMedicines.ts` — pure filter on `Medicine[]` by name/salt case-insensitive substring
- Create: `src/features/search/data/repositories/RecentSearchesRepositoryImpl.ts` — versioned list max 5, newest first, dedupe
- Create: `src/features/search/ui/state/searchStore.ts` — query string only if needed; or keep in viewmodel
- Create: `src/features/search/ui/viewmodels/useSearchViewModel.ts`
- Create: `src/features/search/ui/components/MedicineResultRow.tsx`, `RecentSearchList.tsx`
- Modify: `SearchScreen.tsx`, `src/features/search/index.ts`, `src/di/container.ts` (register recent repo)
- Create: `src/utils/versionedJson.ts`

**Interfaces:**
- Consumes: `catalogRepository.getAll()`, later cart `addItem` (for Task 3 use a temporary callback or export cart store stub — **prefer:** Task 3 Add button calls a cart API only if cart store exists; if not yet, add `src/features/cart` store skeleton with `addItem` in this task minimal form OR defer Add wiring to Task 4 and disable Add until then)

**Decision (locked):** Implement `searchMedicines` + UI + recents in Task 3; **Add to cart** wires in Task 4 when cart store exists. Task 3 Add button can call an injected `onAdd` from a thin cart module started here:

Minimal cart surface for Task 3/4 handoff:

```ts
// features/cart/index.ts (expand in Task 4)
export { useCartStore } from './ui/state/cartStore';
// cartStore.addItem(medicine: Medicine): { ok: true } | { ok: false; reason: string }
```

If cart store not ready, create empty cart store file in Task 3 with `addItem` no-op that Task 4 replaces — **better:** start Task 3 after creating cart store shell in same commit only for `addItem` persistence deferred to Task 4.

**Practical sequence inside Task 3:** create `cartStore` with in-memory lines + `addItem` respecting maxQty (persist in Task 4). Avoids dead Add button.

`versionedJson.ts`:

```ts
export function readVersioned<T>(raw: string | undefined, version: number, fallback: T): T;
export function writeVersioned<T>(version: number, data: T): string;
```

Corrupt JSON → fallback.

- [ ] **Step 1: Pure `searchMedicines` + unit test**

```ts
export function searchMedicines(items: Medicine[], query: string): Medicine[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter(
    (m) => m.name.toLowerCase().includes(q) || m.salt.toLowerCase().includes(q),
  );
}
```

Empty query → empty results (show idle empty state, not “no results”).

- [ ] **Step 2: Recent searches repo + search UI states**

States: `idle` (no query), `loading` (brief async: `await catalog.getAll()` then filter — use microtask/Promise so loading can flash), `results`, `noResults`.

- [ ] **Step 3: Typecheck + tests**

```bash
npx tsc --noEmit
npm test
```

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add medicine search and persisted recent searches

EOF
)"
```

---

### Task 4: Cart mechanics + bill (no coupon apply UI yet)

**Files:**
- Create: `src/features/cart/domain/entities/CartLine.ts`
- Create: `src/features/cart/domain/rules/qty.ts` — `clampQty`, `canIncrement`
- Create: `src/features/cart/domain/rules/bill.ts` — `calculateBill(itemTotal, effect?: CouponEffect | null)`
- Create: `src/features/cart/ui/state/cartStore.ts` — persisted versioned lines; `activeCode: string | null` field reserved
- Create: `src/features/cart/ui/viewmodels/useCartViewModel.ts`
- Create: `src/features/cart/ui/screens/CartScreen.tsx`, components for line + bill
- Modify: `src/features/cart/index.ts`
- Test: `__tests__/domain/bill.test.ts`, `__tests__/domain/cartQty.test.ts`

**Interfaces:**
- Produces:

```ts
function itemTotal(lines: CartLine[]): number;
function calculateBill(
  itemTotal: number,
  effect: CouponEffect | null,
): Bill;

// deliveryFeeBase = itemTotal > 0 && itemTotal < 499 ? 40 : 0
// empty cart → all zeros
```

- `addItem` / `increment` / `decrement` / `remove` — decrement to 0 removes line
- maxQty: increment/`addItem` returns `{ ok: false, reason: 'Maximum quantity is N' }` → toast

- [ ] **Step 1: Write failing bill + qty tests**

Cases: itemTotal 498 → fee 40; 499 → 0; 0 → 0; flat discount clamp; freeDelivery zeroes fee; discount ≤ itemTotal; qty cap.

- [ ] **Step 2: Implement bill + cart store + Cart UI**

Still show coupon section as empty placeholder or hide until Task 6.

- [ ] **Step 3: Run tests**

```bash
npm test
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add cart quantity rules and bill breakdown

EOF
)"
```

---

### Task 5: Coupons domain — Strategy + Registry + tests

**Files:**
- Create: `src/features/coupons/domain/CouponContext.ts`
- Create: `src/features/coupons/domain/CouponEffect.ts`
- Create: `src/features/coupons/domain/rules/CouponRule.ts`
- Create: `src/features/coupons/domain/rules/flat50Rule.ts`
- Create: `src/features/coupons/domain/rules/save10Rule.ts`
- Create: `src/features/coupons/domain/rules/freedelRule.ts`
- Create: `src/features/coupons/domain/rules/first100Rule.ts`
- Create: `src/features/coupons/domain/rules/registry.ts` — `listCouponRules()`, `getCouponRule(code: string): CouponRule | undefined`
- Create: `src/features/coupons/domain/evaluateCoupon.ts`
- Create: `src/features/coupons/domain/autoRemove.ts` — `shouldAutoRemove(code, ctx): Eligibility`
- Create: `src/features/coupons/data/repositories/UsedCouponsRepository.ts` (interface in domain) + Impl
- Modify: `src/features/coupons/index.ts` — export public types + `listCouponRules`, `getCouponRule`, `evaluateCoupon`, used-repo type
- Modify: `src/di/container.ts`
- Test: `__tests__/domain/coupons.test.ts`

**Interfaces:**

```ts
export function evaluateCoupon(
  code: string,
  ctx: CouponContext,
): { ok: true; effect: CouponEffect } | { ok: false; reason: string } {
  const rule = getCouponRule(code);
  if (!rule) return { ok: false, reason: 'Unknown coupon' };
  const eligibility = rule.isEligible(ctx);
  if (!eligibility.ok) return eligibility;
  return { ok: true, effect: rule.evaluate(ctx) };
}
```

**Rule eligibility copy (exact reasons for toasts):**

- FLAT50 fail: `Add items worth ₹300 to use FLAT50`
- SAVE10 / FREEDEL empty: `Add items to use this coupon`
- FIRST100 min: `Add items worth ₹200 to use FIRST100`
- FIRST100 used: `FIRST100 has already been used`

- [ ] **Step 1: Write failing coupon tests** (all four rules, SAVE10 cap, FIRST100 used, unknown code)

- [ ] **Step 2: Implement rules + registry — no UI**

- [ ] **Step 3: `npm test` + `tsc`**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add pluggable coupon Strategy rules and registry

EOF
)"
```

---

### Task 6: Coupon ticket UI + cart wiring + auto-remove

**Files:**
- Create: `src/features/coupons/ui/components/CouponTicketCard.tsx`
- Create: `src/features/coupons/ui/components/CouponList.tsx`
- Create: `src/features/coupons/ui/styles/coupons.styles.ts`
- Modify: `useCartViewModel.ts` — after every mutation, if `activeCode`, call `evaluateCoupon`; on fail clear + `toast.show(reason)`
- Modify: `CartScreen.tsx` — render tickets + bill with effect
- Modify: cart store `setActiveCode` / `clearCoupon`

**Interfaces:**
- Card props: `{ code, title, subtitle, status: 'eligible' | 'applied' | 'blocked', reason?: string, onPress }`
- Visual: colored top strip, dashed mid line, Apply / Applied label (screenshot-inspired)
- Header colors rotate by code (tokens only — add `couponFlat`, `couponPercent`, `couponShip`, `couponFirst` to `tokens.ts` if needed)

- [ ] **Step 1: Wire evaluate into bill viewmodel**

```ts
const used = await usedCouponsRepository.getUsed();
const ctx = { itemTotal, lineCount, usedCodes: new Set(used) };
const applied = activeCode ? evaluateCoupon(activeCode, ctx) : null;
const effect = applied?.ok ? applied.effect : null;
const bill = calculateBill(itemTotal, effect);
```

- [ ] **Step 2: Auto-remove on mutate**

Shared helper in cart viewmodel: `revalidateCoupon()`.

- [ ] **Step 3: Manual reason check via unit test for auto-remove helper**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: wire coupon tickets into cart with auto-removal

EOF
)"
```

---

### Task 7: Place order + FIRST100 used persistence

**Files:**
- Modify: `useCartViewModel.ts` — `placeOrder()`
- Modify: `UsedCouponsRepositoryImpl`
- Modify: CartScreen Place order button

**Interfaces:**

```ts
async function placeOrder(): Promise<void> {
  if (lines.length === 0) {
    toast.show('Cart is empty');
    return;
  }
  if (activeCode === 'FIRST100') {
    await usedCouponsRepository.markUsed('FIRST100');
  }
  clearCart(); // lines + activeCode
  toast.show('Order placed');
}
```

- [ ] **Step 1: Test markUsed blocks FIRST100 on next evaluate**

- [ ] **Step 2: Implement place order**

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: place order and mark one-time coupons used

EOF
)"
```

---

### Task 8: a11y + minSdk 33 + NOTES

**Files:**
- Modify: interactive components — labels/roles
- Modify: `app.json` → `"android": { "minSdkVersion": 33, ... }`
- Modify: `NOTES.md` — fill Assumptions, Architecture (feature separation + Strategy), Decisions, Testing, AI, More time

**NOTES must include:**

- Why `coupons` is a separate feature (OCP / live extension / single responsibility)
- Strategy + Registry pattern
- Bill vs coupon ownership
- Eligibility edge cases (SAVE10 empty, FREEDEL when fee already 0, FIRST100 used, discount clamp)
- Versioned persistence
- UI scope A trade-off
- Android 13+ / API 33
- How AI was directed/reviewed

- [ ] **Step 1: a11y pass + minSdk**

- [ ] **Step 2: Update NOTES.md**

- [ ] **Step 3: `tsc` + `npm test` + `expo lint`**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: document feature design decisions and raise minSdk to 33

EOF
)"
```

---

### Task 9: EAS debug APK profile

**Files:**
- Create: `eas.json` with `development` / `preview` profile producing Android APK (`buildType: apk` or `developmentClient` as appropriate)
- Modify: `app.json` if EAS project id required (user must `eas init` if missing)

- [ ] **Step 1: Add eas.json**

```json
{
  "cli": { "version": ">= 16.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

- [ ] **Step 2: Document build command in NOTES**

`npx eas-cli@latest build -p android --profile preview`

Do not require a successful cloud build in-agent if credentials missing — config + NOTES instructions count; attempt build if user logged in.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore: add EAS Android APK build profiles

EOF
)"
```

---

## Spec coverage checklist

| Spec item | Task |
| --- | --- |
| Permissions lifecycle + banner + coords | 2 |
| Search states + recents | 3 |
| Cart qty + persist + bill | 4 |
| Strategy coupons + tests | 5 |
| Ticket UI + auto-remove + toast | 6 |
| Place order + FIRST100 used | 7 |
| a11y + API 33 + NOTES | 8 |
| Debug APK / EAS | 9 |
| Jest harness | 1 |
| Pluggable bonus | 5–6 |
| Versioned persistence | 3–4, 7 |
| Discount ≤ itemTotal | 4–5 |

## Self-review notes

- No TBD left in rule table or commit order
- Cart depends on coupons public API; coupons do not import cart
- SAVE10 base = item total; FREEDEL eligible on non-empty cart even if fee already 0
- Plan uses existing DI/toast/catalog; does not re-scaffold app
