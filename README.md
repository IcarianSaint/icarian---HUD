# Icarian HUD

Always-on tactical HUD for Even Realities G1 glasses.

## Run locally

Requires Node.js 18 or newer. No dependencies are required for the local preview:

```bash
npm start
```

Open <http://localhost:4173> in a browser. The browser preview includes a simulated clock, weather card, notifications, navigation status, and a voice-command simulation. Hardware permissions are only available when the miniapp is launched by the Even Realities host.

Run the basic syntax checks with:

```bash
npm run check
```

## Miniapp entry points

- `miniapp.json` — miniapp manifest.
- `ui/index.html` — dashboard UI.
- `ui/app.js` — preview-safe dashboard behavior.
- `background/index.js` — background service boundary and host event hooks.
- `scripts/serve.js` — dependency-free static server for local development.

## Voice commands

The preview accepts commands such as `weather`, `navigate home`, `notifications`, and `calendar`. Press **Listen** to use the browser speech-recognition API when supported, or type a command into the command box.

## Device integration

The host SDK should be wired into `background/index.js` at the marked integration points. The local server deliberately does not request microphone, location, calendar, or notification permissions.
