# XCloud Launcher

Desktop launcher for Xbox Cloud Gaming (xbox.com/play), built with Electron and React.
It runs on Electron's bundled Chromium, so you don't need to install Chrome or Edge.

## Run
    npm install
    npm run dev        # dev mode with hot reload
    npm run dist       # build an installer (.exe / .dmg / AppImage) into dist/

## Notes
- Your login is saved in the `persist:xcloud` session, so you sign in once.
- F11 toggles fullscreen and F5 reloads.
- Controllers work through the Gamepad API. Connect one before the stream starts.
- The app reports an Edge user agent so xbox.com doesn't block it as an unsupported browser.

## Releases (GitHub Actions)
`.github/workflows/build.yml` builds Windows, macOS and Linux versions on GitHub.
- **Publish a release:** `git tag v1.0.0 && git push origin v1.0.0`. The installers get attached to a GitHub Release automatically.
- **Test build without releasing:** Actions tab → Build & Release → Run workflow. Download the installers from that run's artifacts.

Builds are unsigned. On Windows, SmartScreen will warn you: click "More info", then "Run anyway". On macOS, right-click the app and choose Open the first time.
