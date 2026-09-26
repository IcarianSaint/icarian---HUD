import type { Track } from './player';

/**
 * The smallest contract the glass UI needs from an audio provider.
 *
 * Keep this independent from a particular streaming service or Mentra host
 * version. A host adapter can implement it when the runtime's media API is
 * confirmed.
 */
export interface AudioProvider {
  play(track: Track): Promise<void>;
  pause(): Promise<void>;
  next(): Promise<Track | undefined>;
  previous(): Promise<Track | undefined>;
  setVolume(level: number): Promise<void>;
  seek(seconds: number): Promise<void>;
}

/**
 * Safe development fallback. It updates no hardware and is useful until the
 * target Mentra host exposes a supported media-control API.
 */
export class NoopAudioProvider implements AudioProvider {
  async play(_track: Track): Promise<void> {}
  async pause(): Promise<void> {}
  async next(): Promise<Track | undefined> { return undefined; }
  async previous(): Promise<Track | undefined> { return undefined; }
  async setVolume(_level: number): Promise<void> {}
  async seek(_seconds: number): Promise<void> {}
}
