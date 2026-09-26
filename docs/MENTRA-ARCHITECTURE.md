# Mentra SmartBapp Architecture

## Goal

Icarian HUD is designed as a Mentra miniapp with two glass-first modes:

1. **Dashboard** — time, weather, navigation, notifications, and the next calendar event.
2. **Player** — current track, play state, next/previous, volume, and a short queue.

The browser preview is a visual prototype. The Mentra runtime is the production boundary for device events and display output.

## Runtime flow

```text
Mentra host session
        │
        ├── voice event ──> VoiceHandler.parse()
        │                         │
        │                         ├── dashboard action ──> HUDDashboard.render()
        │                         └── player action ────> MediaPlayer + render()
        │
        ├── lifecycle ────> IcarianHUD session setup/cleanup
        └── display API ──> session.layouts.showTextWall(...)
```

## File responsibilities

- `miniapp.json`: Mentra miniapp metadata, hardware requirements, and permissions.
- `src/index.ts`: app server, session lifecycle, voice routing, and mode switching.
- `src/dashboard.ts`: compact dashboard renderer.
- `src/player.ts`: playback state, queue operations, and compact player renderer.
- `src/voice-handler.ts`: deterministic voice-command parsing.
- `background/media-service.js`: browser/Node-compatible media state prototype.
- `ui/`: browser preview for rapid layout testing.

## Voice intent map

| Spoken command | Intent | Action |
|---|---|---|
| `show dashboard`, `home` | dashboard | show |
| `weather` | dashboard | weather |
| `navigate home` | dashboard | navigation |
| `notifications` | dashboard | notifications |
| `calendar`, `next event` | dashboard | calendar |
| `play music`, `resume` | player | play |
| `pause`, `stop` | player | pause |
| `next`, `skip` | player | next |
| `previous`, `go back` | player | previous |
| `volume up`, `volume down` | player | volume adjustment |

The command parser intentionally uses plain text first. Once the host supplies structured intents, `src/index.ts` can map those intents into the same actions without changing the UI renderers.

## Audio integration boundary

The current `MediaPlayer` is a state machine: it tracks the selected track, queue, position, volume, and play state. It does **not** claim to stream audio by itself.

A production audio adapter must be connected to whichever Mentra/phone media API is available:

```text
MediaPlayer state  <──>  Mentra host media adapter  <──>  phone/audio session
```

Keep this boundary explicit. If the runtime only exposes media controls, the app can control an existing phone player. If it exposes an app audio session or stream API, the adapter can own playback. Do not place provider-specific code in the glass renderer.

## Display constraints

- Prefer one compact text wall over dense panels.
- Keep the primary action in the first few lines.
- Use symbols sparingly; provide readable text fallbacks.
- Re-render after every state-changing command.
- Treat the glasses display as a glance surface, not a phone-sized music app.

## Permissions and privacy

The manifest requests microphone, notifications, calendar, and location. Request only what the final feature uses, and explain each permission in the store listing. Audio-provider credentials should remain on the phone/server side and must not be embedded in the miniapp bundle.

## Device validation checklist

- [ ] Confirm the installed Mentra SDK version and generated entry-point shape.
- [ ] Confirm the exact voice-event callback/API in the target host version.
- [ ] Confirm whether `showTextWall` supports updates while a session is active.
- [ ] Confirm whether audio is app-owned or controlled through phone media sessions.
- [ ] Test session start, suspend, resume, and termination.
- [ ] Test microphone denial and loss of phone connectivity.
- [ ] Verify every display string on the target glasses.
- [ ] Add rate limiting/debouncing for repeated voice events.

## Local development

```bash
npm install
npm run check
npm start
```

Open `http://localhost:4173` for the dashboard preview or `http://localhost:4173?player` for the player preview. The browser cannot emulate the Mentra hardware permissions or guarantee audio routing to the glasses.

## Release path

1. Validate the SDK entry-point and callback names against the Mentra SDK installed locally.
2. Replace demo weather/navigation/calendar values with host-backed providers.
3. Implement the audio adapter supported by the target Mentra host.
4. Test on the emulator, then on a paired device.
5. Package and submit the miniapp using the Mentra developer tooling.
