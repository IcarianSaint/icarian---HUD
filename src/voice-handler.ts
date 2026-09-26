/**
 * Voice Command Handler for Icarian HUD
 * 
 * Routes voice input to appropriate handlers.
 * Supports natural language intent detection.
 */

export interface VoiceCommand {
  command: string;
  intent: 'dashboard' | 'player' | 'settings' | 'unknown';
  action: string;
}

export class VoiceHandler {
  /**
   * Parse voice input and extract intent
   */
  static parse(input: string): VoiceCommand {
    const normalized = input.toLowerCase();

    // Player intents
    if (
      normalized.includes('play') ||
      normalized.includes('music') ||
      normalized.includes('song') ||
      normalized.includes('audio')
    ) {
      return {
        command: input,
        intent: 'player',
        action: 'play'
      };
    }

    if (
      normalized.includes('pause') ||
      normalized.includes('stop')
    ) {
      return {
        command: input,
        intent: 'player',
        action: 'pause'
      };
    }

    if (normalized.includes('next') || normalized.includes('skip')) {
      return {
        command: input,
        intent: 'player',
        action: 'next'
      };
    }

    if (normalized.includes('previous') || normalized.includes('back')) {
      return {
        command: input,
        intent: 'player',
        action: 'previous'
      };
    }

    if (normalized.includes('volume')) {
      if (normalized.includes('up')) {
        return {
          command: input,
          intent: 'player',
          action: 'volume_up'
        };
      }
      if (normalized.includes('down')) {
        return {
          command: input,
          intent: 'player',
          action: 'volume_down'
        };
      }
    }

    // Dashboard intents
    if (normalized.includes('weather')) {
      return {
        command: input,
        intent: 'dashboard',
        action: 'weather'
      };
    }

    if (normalized.includes('navigate') || normalized.includes('direction')) {
      return {
        command: input,
        intent: 'dashboard',
        action: 'navigation'
      };
    }

    if (normalized.includes('notification')) {
      return {
        command: input,
        intent: 'dashboard',
        action: 'notifications'
      };
    }

    if (normalized.includes('calendar') || normalized.includes('event')) {
      return {
        command: input,
        intent: 'dashboard',
        action: 'calendar'
      };
    }

    if (normalized.includes('dashboard') || normalized.includes('home')) {
      return {
        command: input,
        intent: 'dashboard',
        action: 'show'
      };
    }

    return {
      command: input,
      intent: 'unknown',
      action: 'unknown'
    };
  }
}
