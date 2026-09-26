import { AppServer } from '@mentra/sdk';

export class IcarianHUD extends AppServer {
  protected async onSession(session: any, sessionId: string, userId: string) {
    await session.layouts.showTextWall(`Icarian HUD\nSession: ${sessionId}`);

    const voiceHandler = async (text: string) => {
      const command = String(text || '').toLowerCase();

      if (command.includes('weather')) {
        await session.layouts.showTextWall('Weather: 72°F, clear');
      } else if (command.includes('play')) {
        await session.layouts.showTextWall('Player: playing Infinite Descent');
      } else if (command.includes('pause')) {
        await session.layouts.showTextWall('Player: paused');
      } else if (command.includes('next')) {
        await session.layouts.showTextWall('Player: next track');
      } else if (command.includes('volume')) {
        await session.layouts.showTextWall('Volume: 70%');
      } else {
        await session.layouts.showTextWall('Icarian HUD ready');
      }
    };

    if (typeof session.events?.onVoiceCommand === 'function') {
      session.events.onVoiceCommand = voiceHandler;
    }

    if (typeof session.events?.onIntent === 'function') {
      session.events.onIntent = async (intent: string) => {
        await voiceHandler(intent || 'dashboard');
      };
    }
  }
}

export default IcarianHUD;
