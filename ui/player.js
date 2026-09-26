/* global self */

const playBtn = document.querySelector('#btn-play-pause');
const prevBtn = document.querySelector('#btn-previous');
const nextBtn = document.querySelector('#btn-next');
const volumeSlider = document.querySelector('#volume-slider');
const volumeDisplay = document.querySelector('#volume-display');
const progressFill = document.querySelector('#progress-fill');
const currentTimeEl = document.querySelector('#current-time');
const durationEl = document.querySelector('#duration');
const voiceStatus = document.querySelector('#voice-status');
const waveformCanvas = document.querySelector('#waveform');
const canvasCtx = waveformCanvas ? waveformCanvas.getContext('2d') : null;
const navBack = document.querySelector('.nav-back');

const trackTitleEl = document.querySelector('#track-title');
const trackArtistEl = document.querySelector('#track-artist');
const trackAlbumEl = document.querySelector('#track-album');

let isPlaying = false;
let currentTrack = 0;
let currentTime = 0;
let duration = 225; // 3:45

const playlist = [
  { title: 'Infinite Descent', artist: 'Neon Static', album: 'Cyber Dreams', duration: 225 },
  { title: 'Neon Dreams', artist: 'Synthwave Collective', album: 'Digital Nights', duration: 198 },
  { title: 'Digital Horizon', artist: 'Chrome Wolves', album: 'Chromatic', duration: 210 },
  { title: 'Phantom Protocol', artist: 'Echo Nexus', album: 'Frequency', duration: 240 }
];

function updateTrackInfo() {
  const track = playlist[currentTrack];
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  trackAlbumEl.textContent = track.album;
  duration = track.duration;
  currentTime = 0;
  updateProgress();
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? '⏸' : '▶';
  playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  voiceStatus.textContent = isPlaying ? 'Now playing...' : 'Paused';
  if (isPlaying) startPlayback();
}

function playNext() {
  currentTrack = (currentTrack + 1) % playlist.length;
  updateTrackInfo();
  isPlaying = true;
  playBtn.textContent = '⏸';
  voiceStatus.textContent = `Playing: ${playlist[currentTrack].title}`;
}

function playPrevious() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  updateTrackInfo();
  isPlaying = true;
  playBtn.textContent = '⏸';
  voiceStatus.textContent = `Playing: ${playlist[currentTrack].title}`;
}

function updateVolume() {
  const vol = volumeSlider.value;
  volumeDisplay.textContent = vol + '%';
}

function updateProgress() {
  const percent = (currentTime / duration) * 100;
  progressFill.style.width = percent + '%';
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function drawWaveform() {
  if (!canvasCtx || !waveformCanvas) return;
  const w = waveformCanvas.width;
  const h = waveformCanvas.height;
  canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
  canvasCtx.fillRect(0, 0, w, h);
  canvasCtx.strokeStyle = 'rgba(101, 230, 176, 0.6)';
  canvasCtx.lineWidth = 2;
  canvasCtx.beginPath();
  for (let i = 0; i < w; i++) {
    const freq = Math.sin((i / w) * Math.PI * 2 + (currentTime * 2)) * 0.3 + 0.5;
    const amp = Math.sin((i / w) * Math.PI * 3) * (isPlaying ? 20 : 5);
    const y = h / 2 + amp * (freq - 0.5) * (isPlaying ? 1 : 0.3);
    if (i === 0) canvasCtx.moveTo(i, y);
    else canvasCtx.lineTo(i, y);
  }
  canvasCtx.stroke();
}

function startPlayback() {
  const interval = setInterval(() => {
    if (!isPlaying) { clearInterval(interval); return; }
    currentTime += 0.1;
    if (currentTime >= duration) {
      playNext();
      currentTime = 0;
    }
    updateProgress();
    drawWaveform();
  }, 100);
}

function handleVoiceCommand(command) {
  const cmd = String(command || '').toLowerCase().trim();
  if (cmd.includes('play')) { if (!isPlaying) togglePlayPause(); voiceStatus.textContent = 'Playing'; }
  else if (cmd.includes('pause') || cmd.includes('stop')) { if (isPlaying) togglePlayPause(); voiceStatus.textContent = 'Paused'; }
  else if (cmd.includes('next') || cmd.includes('skip')) playNext();
  else if (cmd.includes('previous') || cmd.includes('back')) playPrevious();
  else if (cmd.includes('volume up')) { volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10); updateVolume(); }
  else if (cmd.includes('volume down')) { volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10); updateVolume(); }
  else voiceStatus.textContent = `Command: "${command}"`;
}

playBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrevious);
volumeSlider.addEventListener('input', updateVolume);
navBack.addEventListener('click', () => { window.history.back(); });

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); togglePlayPause(); }
  else if (e.code === 'ArrowRight') playNext();
  else if (e.code === 'ArrowLeft') playPrevious();
});

if (typeof self !== 'undefined') { self.icarianPlayer = { handleVoiceCommand, playNext, playPrevious, togglePlayPause, updateVolume }; }
if (typeof module !== 'undefined') { module.exports = { handleVoiceCommand, playNext, playPrevious, togglePlayPause }; }

updateTrackInfo();
drawWaveform();
setInterval(drawWaveform, 100);
