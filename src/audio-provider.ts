export type AudioProviderMethod = 'playUrl' | 'pause' | 'resume' | 'stop' | 'setVolume';

export interface AudioProvider {
  playUrl?: (url: string) => Promise<unknown>;
  pause?: () => Promise<unknown>;
  resume?: () => Promise<unknown>;
  stop?: () => Promise<unknown>;
  setVolume?: (value: number) => Promise<unknown>;
}

export class NoopAudioProvider implements AudioProvider {}
