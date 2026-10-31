# UX Polish Design

Approved 2026-10-31. Approach: surgical (shared QtyStepper, no new packages).

## 1. Home qty + search debounce

- Medicine row: qty `0` → **Add**; qty `> 0` → shared `QtyStepper` (− / count / +). Decrement to 0 removes the line (existing cart `decrement` behavior).
- Home wires cart store `addItem` / `increment` / `decrement` with toast on failure (e.g. maxQty).
- Search input updates immediately; catalog search runs **1 second after last keystroke** (`setTimeout` + cleanup). Empty query → idle + clear results.
- Recent selection and keyboard submit run search **immediately** (cancel pending debounce).
- Recents persistence only on executed search, not every keystroke.

## 2. Cart coupons + bill (Blinkit-style)

Cart scroll order when non-empty:

1. Line items with QtyStepper
2. **Coupon strip** — horizontal scroll of first **2** tickets + **View all**
3. **Bill** breakdown
4. Place order

**View all** → Expo Router stack screen `/coupons` (option A): vertical list of all coupon tickets; same apply/remove store. Back returns to Cart with updated bill.

Location permissions: no change. Ask OS first; **Open Settings** only when blocked. Matches brief.

## 3. Docs + release

- `README.md` — install, run, APK path; deep architecture → `NOTES.md`
- `NOTES.md` — How I Used AI lists Cursor skills (brainstorming, writing-plans, ponytail-senior-dev, caveman, etc.)
- Local release APK → `dist/plazza-release.apk` (dist is gitignored)
- Commits pushed to `main`

## Out of scope

Rewards, categories, Expo Go for MMKV, EAS cloud login, free-text coupon field.
