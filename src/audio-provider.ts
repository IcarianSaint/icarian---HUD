import type { Track } from './player';

export interface AudioProvider {
  play(track: Track): Promise<void>;
  pause(): Promise<void>;
  next(): Promise<Track | undefined>;
  previous(): Promise<Track | undefined>;
  setVolume(level: number): Promise<void>;
  seek(seconds: number): Promise<void>;
}

export class NoopAudioProvider implements AudioProvider {
  async play(_track: Track): Promise<void> {}
  async pause(): Promise<void> {}
  async next(): Promise<Track | undefined> { return undefined; }
  async previous(): Promise<Track | undefined> { return undefined; }
  async setVolume(_level: number): Promise<void> {}
  async seek(_seconds: number): Promise<void> {}
}
