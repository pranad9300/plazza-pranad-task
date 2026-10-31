# Plazza Frontend Take-Home

Expo / React Native medicine search, persistent cart, and coupon engine for **Android 13+ (API 33)**.

Deep design notes, architecture rationale, trade-offs, and AI workflow live in **[NOTES.md](./NOTES.md)**.

## Try on a physical Android device (no build commands)

1. Download the installable APK from the latest [GitHub Release](https://github.com/pranad9300/plazza-pranad-task/releases) (asset: `plazza-release.apk`), or use the local copy at `dist/plazza-release.apk` after a release build.
2. On the phone: allow install from unknown sources / browser if prompted.
3. Open the APK and install. Launch **Plazza**.

Requires **Android 13+ (API 33)**. No Metro / `expo start` needed for this path.

## Prerequisites (for developers)

- Node.js 20+ (LTS recommended)
- Android device or emulator with **API 33+**
- For a native install from source: Android SDK / able to run `npx expo run:android`

`react-native-mmkv` needs a **development or release native build**. Expo Go will not work.

## Install

```bash
npm install
```

## Run (dev)

```bash
npx expo start
```

Then press `a` for Android, or:

```bash
npx expo run:android
```

## Quality checks

```bash
npx expo lint
npx tsc --noEmit
npm test
```

## Where is the APK?

| Location | Notes |
| --- | --- |
| **GitHub Releases** | Preferred for reviewers — download `plazza-release.apk` from the release page |
| **`dist/plazza-release.apk`** | Local path after `assembleRelease` (`dist/` is gitignored, not in git) |
| **Gradle output** | `android/app/build/outputs/apk/release/app-release.apk` |

Rebuild locally:

```bash
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../dist/plazza-release.apk
```

Optional EAS (needs `eas login` + project credentials):

```bash
npx eas-cli@latest build -p android --profile preview
```

## Project structure

```text
src/
  app/        Expo Router routes only (thin screens)
  di/         Composition root (adapters + repositories)
  core/       Third-party ports + adapters
  common/     Shared UI (e.g. QtyStepper)
  utils/      Pure helpers
  features/   catalog | permissions | search | cart | coupons
    domain/   Entities, rules, use cases
    data/     Repositories, DTOs, mappers
    ui/       Screens, components, viewmodels, styles
```

See **NOTES.md** for Clean Architecture rules, coupon Strategy/Registry, persistence, and testing notes.

## Features (brief)

- Location + notification permissions (re-request when denied; Open Settings when blocked)
- Medicine search with **1s debounce**, recent searches, cart qty steppers on Home
- Persistent cart (MMKV), maxQty, bill (delivery threshold + coupons)
- Coupons: strip of 2 on Cart + **View all** stack list; one active coupon
- Place order (marks FIRST100 used locally)

Design / plan docs:

- `docs/superpowers/specs/2026-10-31-ux-polish-design.md`
- `docs/superpowers/plans/2026-10-31-ux-polish.md`
