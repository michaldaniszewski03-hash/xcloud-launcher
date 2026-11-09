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
