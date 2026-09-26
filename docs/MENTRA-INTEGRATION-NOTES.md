# Mentra runtime integration status

The repository now has a guarded `MentraAudioProvider` adapter in `src/mentra-audio-provider.ts`.

It intentionally accepts an unknown runtime audio manager and checks capabilities at runtime rather than claiming SDK methods that have not been verified from the installed package. Supported capability names are currently treated as optional:

- `playUrl(url)`
- `pause()`
- `resume()`
- `stop()`
- `setVolume(value)`

The adapter does not fabricate track URLs, seek behavior, or phone media-session integration. Add a real URL/provider mapping before calling `play()`. If the installed Mentra SDK uses different names or event payloads, update only this adapter after inspecting the package's `.d.ts` files.

## Verification steps

```bash
npm install
npm run build
```

Then inspect the installed SDK:

```bash
grep -R "class AudioManager\|playUrl\|showTextWall" node_modules/@mentra -n
```

Use the exact installed signatures when wiring the session in `src/index.ts`. The browser preview remains a simulation and cannot verify audio routing to the glasses.
