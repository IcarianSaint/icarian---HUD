# Mentra integration notes

This file records platform assumptions separately from the app logic.

## Confirmed in this repository

- The app has a Mentra-style manifest and TypeScript entry point.
- Dashboard and player rendering are plain TypeScript and can be tested without hardware.
- Voice commands are normalized into a small set of app actions.

## Must be verified against the installed SDK

- The exact generic types for `AppServer.onSession`.
- The supported session voice callback name and payload shape.
- Whether the target runtime supports `session.layouts.showTextWall` updates for this miniapp type.
- Whether Mentra exposes app-owned audio playback, phone media controls, or neither.
- The correct build and packaging command for the installed CLI.

Do not treat the browser player as proof that audio is routed through the glasses. The `src/audio-provider.ts` contract is the deliberate seam for adding a verified host implementation later.
