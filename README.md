# ✦ Nova Calc — One Calculator. Every Screen.

A premium React calculator by **Md. Amzad Hossain Roni** (**CodeWithRoni**).

**Web app:** https://codewithroni.github.io/calculator-react/

## Platforms and outputs

| Platform | Technology | Output | How to build |
| --- | --- | --- | --- |
| Web | React + Vite | Live GitHub Pages site | Push to main |
| Windows | Electron + electron-builder | Installer and portable EXE | Run desktop workflow / version tag |
| macOS Apple Silicon and Intel | Electron + electron-builder | DMG | Run desktop workflow / version tag |
| Linux | Electron + electron-builder | DEB | Run desktop workflow / version tag |
| Android | Capacitor 8 | Debug APK; optionally signed release APK | Run Android workflow / version tag |
| iOS | Capacitor 8 + Xcode | Signed IPA once Apple credentials are supplied | Run iOS workflow / version tag |

**Important:** A debug Android APK is intended for testing, not Google Play. macOS and Windows installers are unsigned until code-signing is configured, so the operating system may warn on install. An installable iOS IPA **cannot** be produced without valid Apple distribution signing credentials and a matching provisioning profile.

## Calculator features

- Responsive premium dark / light UI and calculation history
- Keyboard shortcuts, one-tap result copy
- Addition, subtraction, multiplication, division, percentages, reciprocal, square, square root and sign toggle
- No JavaScript `eval()`; controlled calculator logic
- Local browser storage for history and theme
- Shared React source reused in browser, Electron and Capacitor

## Quick start

Node.js 22.12+ is required.

```bash
npm ci
npm run dev
npm run lint
npm test
npm run build
```

### Web: automatic preview of every main-branch update

Commit code or design changes to `main`. The **Deploy Nova Calc web app (GitHub Pages)** workflow builds with `npm run build:web` and deploys the latest files to:

https://codewithroni.github.io/calculator-react/

**One-time setup**: Repository → **Settings → Pages → Build and deployment → Source → GitHub Actions**. This setting must be enabled once by the repository owner if not already configured.

### Windows, macOS and Linux

```bash
npm run desktop:dev
npm run desktop:win     # on Windows
npm run desktop:mac     # on macOS
npm run desktop:linux   # on Linux
```

Electron's entry point is `electron/main.cjs`. It loads `dist/index.html` from the packaged app with Node integration disabled and Chromium sandbox enabled. Packaging is configured in `electron-builder.yml`.

### Android

```bash
npm ci
npm run build
npm run android:add   # first time only
npm run android:sync  # after web code changes
cd android
./gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS (Mac + Xcode 26+)

```bash
npm ci
npm run build
npm run ios:add       # first time only
npm run ios:sync      # after web code changes
npx cap open ios
```

To create a device-installable IPA, set up Apple Distribution and provisioning in the GitHub Secrets. See **[Cross-platform release guide](docs/RELEASING.md)**.

## Automated releases

Each release workflow is accessible from the **Actions** tab. Use **Run workflow** to create downloadable build artifacts. Push a version tag such as `v1.0.0` to build all supported targets and attach generated packages to **GitHub Releases**.

- [Desktop builders](.github/workflows/build-desktop.yml)
- [Android builder](.github/workflows/build-android.yml)
- [iOS builder](.github/workflows/build-ios.yml)
- [Web auto-deploy](.github/workflows/deploy-pages.yml)

See **[Release guide](docs/RELEASING.md)** for signing requirements, troubleshooting and versioning.

## Contact

- GitHub: https://github.com/CodeWithRoni
- Portfolio: https://codewithroni.github.io/
- LinkedIn: https://www.linkedin.com/in/md-amzad-hossain-roni-02b56037b

© Md. Amzad Hossain Roni.
