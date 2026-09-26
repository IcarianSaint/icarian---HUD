/**
 * Icarian HUD Dashboard
 * 
 * Compact tactical overlay for Mentra glasses.
 * Displays: time, weather, navigation, notifications, calendar.
 */

export class HUDDashboard {
  private clock: string = this.getCurrentTime();
  private weather: { temp: number; condition: string } = { temp: 72, condition: 'Clear' };
  private navigation: { destination: string; distance: string } = { destination: 'Home', distance: '0.4 mi' };
  private notifications: number = 2;
  private nextEvent: { title: string; time: string } = { title: 'Design review', time: '19:00' };

  constructor() {}

  private getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Render dashboard optimized for Mentra glasses
   * Compact text layout with status indicators
   */
  render(): string {
    this.clock = this.getCurrentTime(); // Update time

    return `
┌─────────────────────────────────┐
│  🛡 ICARIAN  │  ${this.clock}  │  G1    │
├─────────────────────────────────┤
│
│  ● WEATHER
│  ${this.weather.temp}°F ${this.weather.condition}
│  Feels like 70° • Humidity 42%
│
│  ● NAVIGATION
│  Destination: ${this.navigation.destination}
│  Turn right in ${this.navigation.distance}
│  ETA: 18:42 (12 min)
│
│  ● NOTIFICATIONS
│  📬 ${this.notifications} new messages
│
│  ● NEXT EVENT
│  ${this.nextEvent.title}
│  Today at ${this.nextEvent.time}
│
├─────────────────────────────────┤
│  SAY: "play", "weather", "nav"  │
│  SAY: "notifications"           │
└─────────────────────────────────┘
    `;
  }
}
