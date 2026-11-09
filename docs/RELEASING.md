# Nova Calc — Cross-Platform Release Guide

This repository contains **one React UI** and multiple packaging targets.

## 1. GitHub Pages: see new code/design online automatically

1. Open **Repository → Settings → Pages**.
2. Set **Source** to **GitHub Actions** (one-time requirement).
3. Each push to the **main** branch triggers `.github/workflows/deploy-pages.yml`.
4. That workflow runs `npm run build:web` (Vite's base becomes `/calculator-react/`), uploads `dist`, and publishes the latest app.
5. View it at https://codewithroni.github.io/calculator-react/.

Desktop/mobile builds run plain `npm run build`, with relative asset URLs suitable for local app files. Do **not** change Vite's conditional base to a fixed absolute Pages path.

## 2. Desktop — EXE / DMG / DEB

Open **Actions → Build Windows EXE, macOS DMG and Linux DEB → Run workflow** to receive downloadable artifacts, or create a `v*` tag for GitHub Release attachments.

Runners:
- **windows-latest / x64** → NSIS installer + portable `.exe`
- **macos-26 / arm64** → Apple Silicon `.dmg`
- **macos-26-intel / x64** → Intel Mac `.dmg`
- **ubuntu-latest / x64** → Debian `.deb`

Local commands:
```bash
npm ci
npm run desktop:dev
npm run desktop:win    # Windows
npm run desktop:mac    # macOS
npm run desktop:linux  # Linux
```

Outputs go to `release-output/`. Builds are **unsigned** by default. End users may see Microsoft SmartScreen / macOS Gatekeeper warnings. Professional software distribution should use trusted publisher certificates, macOS Developer ID, notarization and automated sign workflows.

## 3. Android — APK

Open **Actions → Build Android APK → Run workflow**.

The pipeline runs Capacitor 8, generates an Android project using the same React `dist`, and calls `./gradlew assembleDebug`.

Download: **Actions → workflow run → Artifacts → nova-calc-android-apk**.

Without secrets it includes `Nova-Calc-Android-debug.apk` (installable for personal testing, debugging enabled). For a **signed release APK**, add these four Actions secrets:

| Secret | Required value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Base64 text of private Android .jks keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Store password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

Do not commit any certificate, password or keystore. Configure under **Settings → Secrets and variables → Actions**.

With all secrets set, the workflow also generates `Nova-Calc-Android-signed-release.apk`. For Google Play Store, an AAB and Play App Signing are usually preferable; this pipeline targets APK distribution.

## 4. iOS — IPA

Run **Actions → Validate iOS app and optionally export signed IPA**.

Without signing secrets, the pipeline attempts a **simulator build only**; this confirms native compilation but does **not** produce an installable `.ipa`. Apple requires code signing to install an IPA on devices or distribute it through TestFlight / App Store.

To enable signed IPA export, obtain an Apple Developer Program team, certificate and a compatible provisioning profile for **`com.codewithroni.novacalc`**. Add Actions secrets:

| Secret | Required value |
| --- | --- |
| `IOS_CERTIFICATE_BASE64` | Base64 of Apple Distribution P12 |
| `IOS_CERTIFICATE_PASSWORD` | P12 import password |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64 of a matching .mobileprovision |
| `APPLE_TEAM_ID` | Your Apple Developer Team ID |

Optional repository **Actions variable** `IOS_EXPORT_METHOD`: default `ad-hoc`, change as necessary to match your Apple profile and distribution method. For an Ad Hoc install, the target iPhone's UDID must be registered in the provisioning profile.

The pipeline uses macOS 26 and Xcode 26, signs the archive, then runs `xcodebuild -exportArchive`. Artifact: `nova-calc-ios-signed-ipa`.

**Do not share Apple account passwords, keys, certificates or OTPs in a chat.** Use GitHub encrypted secrets.

## 5. Make versioned GitHub Releases

When your changes are merged into `main`:
```bash
npm version 1.0.1
git push origin main
git push origin v1.0.1
```

The package's version and tag should match. A pushed `v*` tag triggers the desktop, Android and iOS workflows. Generated installers and APKs are attached to the matching GitHub Release; the IPA is attached only when Apple signing is configured and succeeds.

The workflows can also be started manually without tagging; their packages appear as downloadable workflow artifacts.

## 6. After changing the design

Edit React components / CSS → commit / push to `main` → web preview automatically rebuilds. The **native installers do not update on user devices by themselves**; run a new release workflow and redistribute them when you want desktop/mobile users to get the new UI.

## 7. Common troubleshooting

- **Pages returns 404**: enable GitHub Actions as Pages source and check the deploy workflow. Use `/calculator-react/`, not the root site URL.
- **Assets missing on desktop**: build using `npm run build` (relative Vite base), not `npm run build:web`.
- **Android build**: requires Node.js 22+, JDK 21 and Android SDK. Capacitor 8 targets Android API 36.
- **iOS build**: requires Xcode 26+; install CocoaPods if your native template needs it.
- **iOS signing fails**: certificate must match the provisioning profile, Apple team, export method and app ID.
- **Windows/macOS warnings**: unsigned package warnings are expected; configure publishing identity and notarization before wide distribution.
- **Unable to add native platform twice**: `cap add` is a one-time action per checkout; use `cap sync` for later UI changes.
- **Do not commit `android/` or `ios/` generated outputs** in this starter pipeline unless you decide to maintain native modifications; those directories are intentionally ignored and regenerated by CI.

Official references: https://vite.dev/guide/static-deploy · https://www.electron.build/v26/docs/ · https://capacitorjs.com/docs/getting-started
