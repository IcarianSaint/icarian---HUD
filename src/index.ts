import { AppServer } from '@mentra/sdk';
import { MediaPlayer } from './player';
import { HUDDashboard } from './dashboard';

/**
 * Icarian HUD: Tactical overlay for Mentra AI Glasses
 * 
 * Combines a smart dashboard with an integrated live media player.
 * - Background: voice command router and state management
 * - UI: context-aware layouts (dashboard or player)
 */
export class IcarianHUD extends AppServer {
  private mediaPlayer: MediaPlayer;
  private dashboard: HUDDashboard;
  private currentMode: 'dashboard' | 'player' = 'dashboard';

  constructor() {
    super();
    this.mediaPlayer = new MediaPlayer();
    this.dashboard = new HUDDashboard();
  }

  protected async onSession(session, sessionId, userId) {
    console.log(`[Icarian] Session started: ${sessionId}`);

    // Voice event listener
    session.events.onVoiceCommand = async (command: string) => {
      await this.handleVoiceCommand(session, command);
    };

    // Intent detection: "play music", "show dashboard", etc.
    session.events.onIntent = async (intent: string) => {
      if (intent.includes('music') || intent.includes('player')) {
        this.currentMode = 'player';
        await this.renderPlayer(session);
      } else if (intent.includes('dashboard') || intent.includes('home')) {
        this.currentMode = 'dashboard';
        await this.renderDashboard(session);
      }
    };

    // Initial render: show dashboard
    await this.renderDashboard(session);
  }

  private async handleVoiceCommand(session, command: string) {
    const normalized = command.toLowerCase();

    // Dashboard commands
    if (normalized.includes('weather')) {
      session.layouts.showTextWall('Clear skies, 72°F');
      return;
    }

    if (normalized.includes('navigate')) {
      session.layouts.showTextWall('Navigation: Turn right in 0.4 miles');
      return;
    }

    if (normalized.includes('notification')) {
      session.layouts.showTextWall('2 new notifications');
      return;
    }

    if (normalized.includes('calendar') || normalized.includes('event')) {
      session.layouts.showTextWall('Design review at 19:00');
      return;
    }

    // Player commands
    if (normalized.includes('play')) {
      this.currentMode = 'player';
      this.mediaPlayer.play();
      await this.renderPlayer(session);
      return;
    }

    if (normalized.includes('pause') || normalized.includes('stop')) {
      this.mediaPlayer.pause();
      session.layouts.showTextWall('Paused');
      return;
    }

    if (normalized.includes('next') || normalized.includes('skip')) {
      this.mediaPlayer.next();
      await this.renderPlayer(session);
      return;
    }

    if (normalized.includes('previous') || normalized.includes('back')) {
      this.mediaPlayer.previous();
      await this.renderPlayer(session);
      return;
    }

    if (normalized.includes('volume')) {
      if (normalized.includes('up')) {
        this.mediaPlayer.setVolume(Math.min(100, this.mediaPlayer.volume + 10));
      } else if (normalized.includes('down')) {
        this.mediaPlayer.setVolume(Math.max(0, this.mediaPlayer.volume - 10));
      }
      session.layouts.showTextWall(`Volume: ${this.mediaPlayer.volume}%`);
      return;
    }

    // Fallback
    session.layouts.showTextWall(`Command: "${command}"`);
  }

  private async renderDashboard(session) {
    const hudCards = this.dashboard.render();
    session.layouts.showTextWall(hudCards);
  }

  private async renderPlayer(session) {
    const playerUI = this.mediaPlayer.render();
    session.layouts.showTextWall(playerUI);
  }
}

// Export the app
export default IcarianHUD;
