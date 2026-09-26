/**
 * Icarian Media Service
 *
 * Handles audio playback state, queue management, and host integration.
 * The host SDK injects playback controls and audio stream management here.
 */

const mediaState = {
  isPlaying: false,
  currentTrack: 0,
  currentTime: 0,
  volume: 70,
  playlist: [
    { id: 'track-1', title: 'Infinite Descent', artist: 'Neon Static', album: 'Cyber Dreams', duration: 225, artwork: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23315348%22 width=%22400%22 height=%22400%22/%3E%3Ccircle cx=%22200%22 cy=%22200%22 r=%2280%22 fill=%22%231c293a%22/%3E%3C/svg%3E' },
    { id: 'track-2', title: 'Neon Dreams', artist: 'Synthwave Collective', album: 'Digital Nights', duration: 198, artwork: null },
    { id: 'track-3', title: 'Digital Horizon', artist: 'Chrome Wolves', album: 'Chromatic', duration: 210, artwork: null },
    { id: 'track-4', title: 'Phantom Protocol', artist: 'Echo Nexus', album: 'Frequency', duration: 240, artwork: null }
  ],
  queue: []
};

// Initialize queue with playlist
mediaState.queue = mediaState.playlist.map((track, idx) => ({ ...track, queueIndex: idx }));

/**
 * Media control commands to be invoked by the host or voice input
 */
const mediaControls = {
  play() {
    mediaState.isPlaying = true;
    return { status: 'playing', track: mediaState.playlist[mediaState.currentTrack] };
  },

  pause() {
    mediaState.isPlaying = false;
    return { status: 'paused', currentTime: mediaState.currentTime };
  },

  next() {
    mediaState.currentTrack = (mediaState.currentTrack + 1) % mediaState.playlist.length;
    mediaState.currentTime = 0;
    return { status: 'next', track: mediaState.playlist[mediaState.currentTrack], isPlaying: mediaState.isPlaying };
  },

  previous() {
    mediaState.currentTrack = (mediaState.currentTrack - 1 + mediaState.playlist.length) % mediaState.playlist.length;
    mediaState.currentTime = 0;
    return { status: 'previous', track: mediaState.playlist[mediaState.currentTrack], isPlaying: mediaState.isPlaying };
  },

  seek(time) {
    mediaState.currentTime = Math.max(0, Math.min(time, mediaState.playlist[mediaState.currentTrack].duration));
    return { status: 'seek', currentTime: mediaState.currentTime };
  },

  setVolume(level) {
    mediaState.volume = Math.max(0, Math.min(100, level));
    return { status: 'volume', volume: mediaState.volume };
  },

  addToQueue(trackId) {
    const track = mediaState.playlist.find(t => t.id === trackId);
    if (track) {
      mediaState.queue.push({ ...track, queueIndex: mediaState.queue.length });
      return { status: 'queued', track, queueLength: mediaState.queue.length };
    }
    return { status: 'error', message: 'Track not found' };
  },

  getState() {
    return {
      isPlaying: mediaState.isPlaying,
      currentTrack: mediaState.playlist[mediaState.currentTrack],
      currentTime: mediaState.currentTime,
      volume: mediaState.volume,
      queue: mediaState.queue.slice(mediaState.currentTrack, mediaState.currentTrack + 5)
    };
  },

  getQueue() {
    return { queue: mediaState.queue, currentIndex: mediaState.currentTrack };
  }
};

/**
 * Voice command dispatcher
 */
function handleMediaVoiceCommand(command) {
  const normalized = String(command || '').toLowerCase();
  if (normalized.includes('play')) return mediaControls.play();
  if (normalized.includes('pause') || normalized.includes('stop')) return mediaControls.pause();
  if (normalized.includes('next') || normalized.includes('skip')) return mediaControls.next();
  if (normalized.includes('previous') || normalized.includes('back')) return mediaControls.previous();
  if (normalized.includes('volume')) {
    if (normalized.includes('up')) return mediaControls.setVolume(mediaState.volume + 10);
    if (normalized.includes('down')) return mediaControls.setVolume(mediaState.volume - 10);
  }
  return { status: 'unknown', command };
}

if (typeof module !== 'undefined') {
  module.exports = { mediaControls, mediaState, handleMediaVoiceCommand };
}
if (typeof self !== 'undefined') {
  self.icarianMediaService = { mediaControls, mediaState, handleMediaVoiceCommand };
}
