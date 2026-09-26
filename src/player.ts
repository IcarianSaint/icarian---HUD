export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork?: string;
}

export class MediaPlayer {
  private currentTrackIndex = 0;
  public volume = 70;
  private isPlaying = false;

  private tracks: Track[] = [
    { id: '1', title: 'Infinite Descent', artist: 'Neon Static', album: 'Cyber Dreams', duration: 225 },
    { id: '2', title: 'Neon Dreams', artist: 'Synthwave Collective', album: 'Digital Nights', duration: 198 },
    { id: '3', title: 'Digital Horizon', artist: 'Chrome Wolves', album: 'Chromatic', duration: 210 }
  ];

  play() { this.isPlaying = true; }
  pause() { this.isPlaying = false; }
  next() { this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length; }
  previous() { this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length; }
  setVolume(level: number) { this.volume = Math.max(0, Math.min(100, level)); }

  render(): string {
    const track = this.tracks[this.currentTrackIndex];
    const state = this.isPlaying ? 'PLAYING' : 'PAUSED';
    return [
      '🎵 Icarian Player',
      `${state} • ${track.title}`,
      `${track.artist} • ${track.album}`,
      `Volume ${this.volume}%`,
      'Next: ' + this.tracks[(this.currentTrackIndex + 1) % this.tracks.length].title
    ].join('\n');
  }
}
