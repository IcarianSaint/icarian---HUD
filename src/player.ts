/**
 * Icarian Media Player
 * 
 * Handles audio playback state, queue management, and voice control.
 * Designed for Mentra AI Glasses display constraints.
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  artwork?: string;
}

export class MediaPlayer {
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  public volume: number = 70;
  private currentTime: number = 0;

  private playlist: Track[] = [
    {
      id: 'track-1',
      title: 'Infinite Descent',
      artist: 'Neon Static',
      album: 'Cyber Dreams',
      duration: 225
    },
    {
      id: 'track-2',
      title: 'Neon Dreams',
      artist: 'Synthwave Collective',
      album: 'Digital Nights',
      duration: 198
    },
    {
      id: 'track-3',
      title: 'Digital Horizon',
      artist: 'Chrome Wolves',
      album: 'Chromatic',
      duration: 210
    },
    {
      id: 'track-4',
      title: 'Phantom Protocol',
      artist: 'Echo Nexus',
      album: 'Frequency',
      duration: 240
    }
  ];

  constructor() {}

  play(): void {
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
  }

  next(): void {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.currentTime = 0;
  }

  previous(): void {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.currentTime = 0;
  }

  setVolume(level: number): void {
    this.volume = Math.max(0, Math.min(100, level));
  }

  seek(time: number): void {
    const track = this.playlist[this.currentTrackIndex];
    this.currentTime = Math.max(0, Math.min(time, track.duration));
  }

  getCurrentTrack(): Track {
    return this.playlist[this.currentTrackIndex];
  }

  getQueue(): Track[] {
    return this.playlist.slice(this.currentTrackIndex, this.currentTrackIndex + 5);
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.getCurrentTrack(),
      currentTime: this.currentTime,
      volume: this.volume,
      queue: this.getQueue()
    };
  }

  /**
   * Render player UI optimized for Mentra glasses display
   * Compact format: title, artist, playback controls, volume
   */
  render(): string {
    const track = this.getCurrentTrack();
    const progress = Math.round((this.currentTime / track.duration) * 20); // 20-char bar
    const progressBar = '█'.repeat(progress) + '░'.repeat(20 - progress);
    const playIcon = this.isPlaying ? '▶' : '⏸';
    const nextTrack = this.playlist[(this.currentTrackIndex + 1) % this.playlist.length];

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎵 NOW PLAYING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${track.title}
${track.artist}

${progressBar}
${this.formatTime(this.currentTime)} / ${this.formatTime(track.duration)}

[ ${playIcon} ]  [⏮]  [⏭]
Volume: ${this.volume}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UP NEXT: ${nextTrack.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
