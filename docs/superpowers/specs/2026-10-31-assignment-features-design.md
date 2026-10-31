# Assignment Features Design — Plazza Take-Home

Date: 2026-10-31  
Status: approved in brainstorming (UI scope A, coupon apply mode 1, bonuses A, Strategy+Registry)

## 1. Goal

Implement every **mandatory** brief requirement plus **all bonuses**, on the existing Clean Architecture Expo skeleton, with Plazza-inspired UI (not pixel-clone of marketing chrome).

Deliverables: working Android 13+ (API 33) app, automated domain tests for bill/coupon/maxQty, updated `NOTES.md`, debug APK via EAS.

## 2. Scope

### In

- Permissions: Location (foreground) + Notifications; granted / denied / blocked; Settings deep-link; AppState recheck; Home debug banner; “Delivering to: lat,lng”
- Search: name+salt; empty / loading / no-results; Add to cart; Recent Searches max 5, persisted
- Cart: add / inc / dec / remove; maxQty cap; Rx badge; persist; Bill (Item Total, Discount, Delivery, Grand); Place order
- Coupons: one active; ticket-card UI (screenshot style); FLAT50, SAVE10, FREEDEL, FIRST100; auto-remove + toast; pluggable Strategy rules
- Bonuses: pluggable rules, versioned robust persistence, a11y labels + min 44pt touch targets
- TypeScript, no `any`
- Android `minSdkVersion: 33`

### Out (explicit)

- Rewards, category chips, voice search, doctor promo, fake street address (UI scope A)
- Free-text coupon code field (apply mode 1 = cards only)
- Prescription upload, reverse geocoding, backend, iOS polish

## 3. Feature boundaries (why separate folders)

| Feature | Owns | Why separate |
| --- | --- | --- |
| `catalog` | Medicine entity, `getAll()` | Data source already isolated; search/cart consume types only |
| `permissions` | OS permission lifecycle + settings CTA | Device concern; not cart/search logic |
| `search` | Query, recents, result list UI | Changes independently of bill/coupons |
| `cart` | Lines, qty rules, bill assembly, place-order orchestration | Order math stays one place |
| `coupons` | Rule Strategy, registry, eligibility UI cards, used-codes persist | Bonus: new coupon type never edits cart bill file |

**Pattern:** Modular monolith + Clean Architecture per feature + **Strategy** (coupon rules) + **Registry/Factory** (`getCouponRule`) + **composition root** DI.

**SOLID mapping:**

- **S:** one rule file per coupon; bill calculator ≠ eligibility
- **O:** add `NEWCOUPON` rule + registry entry; cart unchanged
- **L:** any `CouponRule` interchangeable via same interface
- **I:** narrow ports (`ToastService`, `SettingsLinker`, `CatalogRepository`)
- **D:** UI/viewmodels depend on domain interfaces + DI, not MMKV/Zustand/Expo

## 4. Domain model

### Cart

```ts
type CartLine = { medicineId: string; name: string; salt: string; price: number; maxQty: number; rx: boolean; qty: number };

// mutations return Result; refuse qty > maxQty
```

### Coupon

```ts
type CouponContext = {
  itemTotal: number;
  lineCount: number;
  usedCodes: ReadonlySet<string>;
};

type CouponEffect =
  | { kind: 'flat'; amount: number }
  | { kind: 'percent'; rate: number; max: number }
  | { kind: 'freeDelivery' };

type Eligibility = { ok: true } | { ok: false; reason: string };

interface CouponRule {
  readonly code: string;
  readonly title: string;       // card header copy
  readonly subtitle: string;    // card body
  isEligible(ctx: CouponContext): Eligibility;
  evaluate(ctx: CouponContext): CouponEffect;
}
```

### Bill (cart domain)

```ts
type Bill = {
  itemTotal: number;
  deliveryFee: number;   // before free-delivery effect
  discount: number;
  grandTotal: number;
  deliveryWaived: boolean;
};

// deliveryFeeBase = itemTotal < 499 ? 40 : 0
// apply effect → discount / waive delivery
// discount = min(computed, itemTotal)
// grandTotal = itemTotal - discount + (waived ? 0 : deliveryFeeBase)
```

### Coupon rules (exact)

| Code | Eligible | Effect | Notes |
| --- | --- | --- | --- |
| FLAT50 | itemTotal ≥ 300 | flat 50 | |
| SAVE10 | lineCount ≥ 1 | 10% of itemTotal, max 100 | empty cart not eligible |
| FREEDEL | lineCount ≥ 1 | freeDelivery | still eligible when fee already 0 |
| FIRST100 | itemTotal ≥ 200 AND code not used | flat 100 | used on Place order only |

### User action paths

1. **Apply card** → `isEligible`? set `activeCode` : toast reason  
2. **Cart mutate** → if active and not eligible → clear active + toast reason  
3. **Apply other** → replace active (no toast unless new fails)  
4. **Place order** → if FIRST100 active → mark used; clear cart + active coupon; toast success  
5. **Ticket UI badges** → derive from same `isEligible` (Eligible / reason short form)

### Persistence (versioned)

Shape: `{ version: number; data: T }`. Read: missing/corrupt/wrong version → default. Keys via storage adapter.

| Key | Feature | version |
| --- | --- | --- |
| `cart.v1` | cart lines + activeCode | 1 |
| `search.recents.v1` | string[] max 5 | 1 |
| `coupons.used.v1` | string[] used codes | 1 |

## 5. Data flow

```
Screen → useXViewModel → store (core/state) + useDependencies()
                              ↓
                    repository / CouponRegistry / calculateBill
```

- Search Add → cart store `addLine(medicine)`
- Cart bill viewmodel builds `CouponContext` from lines + usedCodes repo → rule → `calculateBill`
- Auto-remove lives in cart viewmodel/store after every mutation (calls coupons domain, not duplicated UI checks)

## 6. UI

**Home:** Plazza pink/ink header, delivery coords, search input, results + Rx + Add, empty/loading/no-results, recent chips, permission debug banner.

**Cart:** lines with ±/remove, bill block, ticket coupon cards (colored header, dashed divider, Apply/Applied), Place order.

**a11y:** `accessibilityLabel` / `accessibilityRole` on every interactive control; `min-h-touch` (44).

## 7. Core updates

- Replace noop toast with `createAndroidToastService` using `ToastAndroid` (Android-only OK).
- Wire `usedCouponsRepository` in `createAppDependencies`.
- `app.json`: `android.minSdkVersion: 33`.

## 8. Testing

jest-expo (+ ts-jest or babel-jest as Expo docs for SDK 58). Domain tests only for mandatory matrix:

- delivery fee &lt;499 / ≥499
- each coupon eligible + effect
- SAVE10 cap 100
- FIRST100 blocked when used
- auto-remove helper when itemTotal drops
- maxQty refuse
- discount never exceeds itemTotal

## 9. Commit order (one feature per commit)

1. Toast adapter + Jest harness  
2. Permissions feature  
3. Search + recents  
4. Cart mechanics + bill (no coupon apply yet)  
5. Coupons domain Strategy + registry + tests  
6. Coupons UI + cart wiring + auto-remove  
7. Place order + FIRST100 used persist  
8. a11y + minSdk 33 + NOTES polish  
9. EAS debug APK profile  

## 10. NOTES.md obligations

Document in designated sections: assumptions; why feature folders (especially coupons); Strategy/Registry; SOLID; eligibility edge cases; persistence; AI use; more time.
