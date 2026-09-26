import type { AudioProvider } from './audio-provider';
import type { Track } from './player';

/**
 * Narrow runtime capability shape so this project does not invent or hard-code
 * an SDK type that may differ between Mentra host versions.
 *
 * Pass the session's audio manager (when the installed SDK exposes one) to the
 * constructor. The adapter fails clearly when a capability is unavailable.
 */
export interface MentraAudioCapabilities {
  playUrl?: (url: string) => Promise<unknown>;
  pause?: () => Promise<unknown>;
  resume?: () => Promise<unknown>;
  stop?: () => Promise<unknown>;
  setVolume?: (volume: number) => Promise<unknown>;
}

export class MentraAudioProvider implements AudioProvider {
  private readonly audio: MentraAudioCapabilities;
  private currentTrack?: Track;

  constructor(audioManager: unknown) {
    this.audio = audioManager as MentraAudioCapabilities;
  }

  async play(track: Track): Promise<void> {
    if (!track.artwork || !this.audio.playUrl) {
      throw new Error('Mentra audio playback requires a track URL and playUrl capability');
    }
    this.currentTrack = track;
    await this.audio.playUrl(track.artwork);
  }

  async pause(): Promise<void> {
    if (!this.audio.pause) throw new Error('Mentra audio pause is unavailable');
    await this.audio.pause();
  }

  async next(): Promise<Track | undefined> {
    // Queue selection remains in MediaPlayer; the host adapter only controls audio.
    return this.currentTrack;
  }

  async previous(): Promise<Track | undefined> {
    return this.currentTrack;
  }

  async setVolume(level: number): Promise<void> {
    if (!this.audio.setVolume) throw new Error('Mentra audio volume control is unavailable');
    // Host APIs commonly use 0..1; keep this conversion isolated here.
    await this.audio.setVolume(Math.max(0, Math.min(1, level / 100)));
  }

  async seek(_seconds: number): Promise<void> {
    throw new Error('Mentra audio seeking is not exposed by the verified capability boundary');
  }

  async stop(): Promise<void> {
    if (!this.audio.stop) throw new Error('Mentra audio stop is unavailable');
    await this.audio.stop();
  }
}
