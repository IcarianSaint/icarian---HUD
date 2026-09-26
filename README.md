# Icarian HUD

Always-on tactical HUD for Even Realities G1 glasses with integrated live media player.

## Features

- **Dashboard HUD** — clock, weather, navigation, notifications, calendar
- **Live Audio Player** — track playback, waveform visualization, queue management
- **Voice Commands** — control playback and settings with voice input
- **Glass Integration** — designed for Even Realities G1 hardware requirements

## Run locally

Requires Node.js 18 or newer.

```bash
npm start
```

Open <http://localhost:4173> in a browser:
- **Dashboard**: default view with HUD cards and voice assistant
- **Player**: click any audio reference or append `?player` to URL for the live media player

## Miniapp entry points

- `miniapp.json` — miniapp manifest with hardware requirements and permissions
- `ui/index.html` — main dashboard interface
- `ui/player.html` — audio player interface
- `ui/app.js` — dashboard behavior and preview mode
- `ui/player.js` — audio player controls and visualization
- `background/index.js` — HUD background service entry point
- `background/media-service.js` — audio playback state and media controls
- `scripts/serve.js` — lightweight dev server

## Voice commands

### HUD Dashboard
- `weather` — show weather forecast
- `navigate home` — start navigation
- `notifications` — list recent alerts
- `calendar` / `events` — show upcoming events

### Audio Player
- `play` — resume playback
- `pause` / `stop` — pause playback
- `next` / `skip` — next track
- `previous` / `back` — previous track
- `volume up` / `volume down` — adjust volume

## Even Realities G1 Integration

### Required Permissions
- `MICROPHONE` — voice commands ("Icarian", then speak)
- `READ_NOTIFICATIONS` — mirror phone notifications
- `CALENDAR` — show next event on dashboard
- `LOCATION` — weather and turn-by-turn navigation

### Hardware Requirements
- **DISPLAY** (required) — text/graphics on glasses
- **MICROPHONE** (required) — voice input for commands

### Host SDK Integration Points

**Background Service** (`background/index.js`)
- Lifecycle hooks: app started, suspended, resumed, terminated
- Voice input capture and event dispatch
- Notification listener registration
- Calendar/location subscription

**Media Service** (`background/media-service.js`)
- Audio stream control and state management
- Queue management for host integration
- Volume and playback position synchronization

## Media Player Architecture

The live player is built to integrate with Even Realities' audio subsystem:

```
┌─────────────────────────────────────────┐
│         Icarian Player UI               │ (ui/player.html)
│  (Playback controls, visualization)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Media Service Layer                │ (background/media-service.js)
│  (State, queue, volume management)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Even Realities G1 Host SDK            │
│  (Audio streaming, hardware I/O)        │
└──────────────────────────────────���──────┘
```

## Development

Run syntax checks:

```bash
npm run check
```

Modify UI in `ui/` directory. Reload the browser to preview changes. The background services in `background/` are available as exportable modules for testing.

## Example: Adding a New Playlist

Edit `background/media-service.js` and add tracks to `mediaState.playlist`:

```javascript
{ id: 'my-track', title: 'My Song', artist: 'My Artist', album: 'My Album', duration: 180, artwork: null }
```

The player will auto-sync.

## Example: Voice Command Handler

In `background/media-service.js`, extend `handleMediaVoiceCommand`:

```javascript
if (normalized.includes('shuffle')) return { status: 'shuffled', queue: shuffleQueue() };
```

Then call it from the host's voice event listener.
