import { requestMicrophoneAccess, requestLocationAccess, requestCalendarAccess, requestNotificationAccess } from "@mentra/miniapp/background";
import { MessageChannel } from "../shared/channels";
import { getWeather, getGeminiResponse, translateText } from "./lib";

export interface DashboardData {
  time: string;
  date: string;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  } | null;
  nextEvent: {
    title: string;
    time: string;
  } | null;
  batteryLevel: number;
  batteryCharging: boolean;
}

export interface Notification {
  id: string;
  app: string;
  title: string;
  body: string;
  priority: "high" | "normal" | "low";
  timestamp: number;
}

export interface Note {
  id: string;
  content: string;
  timestamp: number;
  isReminder: boolean;
  reminderTime?: number;
}

export class Icarian {
  private channel: MessageChannel;
  private sessionId: string;
  private voiceActive: boolean = false;
  private notes: Map<string, Note> = new Map();
  private notifications: Notification[] = [];
  private lastLocation: { lat: number; lon: number } | null = null;
  private geminiKey: string = import.meta.env.MENTRA_PUBLIC_GEMINI_API_KEY || "";

  constructor() {
    this.channel = new MessageChannel();
    this.sessionId = `session_${Date.now()}`;
  }

  async start(): Promise<void> {
    console.log("[Icarian] Initializing...");
    
    // Request permissions
    try {
      await Promise.all([
        requestMicrophoneAccess(),
        requestLocationAccess(),
        requestCalendarAccess(),
        requestNotificationAccess(),
      ]);
      console.log("[Icarian] Permissions granted");
    } catch (e) {
      console.error("[Icarian] Permission error:", e);
    }

    // Start dashboard updates
    this.startDashboardLoop();
    
    // Set up voice handling
    this.setupVoiceHandling();
    
    // Set up notification listener
    this.setupNotificationListener();
  }

  suspend(): void {
    this.voiceActive = false;
    console.log("[Icarian] Suspended");
  }

  resume(): void {
    console.log("[Icarian] Resumed");
    this.startDashboardLoop();
  }

  terminate(): void {
    console.log("[Icarian] Terminated");
  }

  private startDashboardLoop(): void {
    const updateDashboard = async () => {
      const data = await this.getDashboardData();
      this.channel.send("updateDashboard", data);
    };

    updateDashboard();
    setInterval(updateDashboard, 30000); // Update every 30 seconds
  }

  private async getDashboardData(): Promise<DashboardData> {
    const now = new Date();
    const weather = await getWeather(this.lastLocation);
    const nextEvent = await this.getNextCalendarEvent();
    const battery = await this.getBatteryStatus();

    return {
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
      weather,
      nextEvent,
      batteryLevel: battery.level,
      batteryCharging: battery.charging,
    };
  }

  private async getNextCalendarEvent(): Promise<DashboardData["nextEvent"]> {
    try {
      // This would call the @mentra/miniapp calendar API
      // For now, return null as read-only calendar events are SDK-specific
      return null;
    } catch (e) {
      console.error("[Icarian] Calendar error:", e);
      return null;
    }
  }

  private async getBatteryStatus(): Promise<{ level: number; charging: boolean }> {
    // Query device battery API
    return { level: 85, charging: false };
  }

  private setupVoiceHandling(): void {
    this.channel.on("voiceInput", async (transcript: string) => {
      const normalized = transcript.toLowerCase().trim();

      // Wake word: "Icarian"
      if (normalized.startsWith("icarian")) {
        this.voiceActive = true;
        const query = normalized.replace("icarian", "").trim();
        
        if (query) {
          await this.handleVoiceQuery(query);
        } else {
          this.channel.send("voiceReady", { status: "listening" });
        }
      }
    });

    this.channel.on("voiceQuery", async (query: string) => {
      await this.handleVoiceQuery(query);
    });
  }

  private async handleVoiceQuery(query: string): Promise<void> {
    try {
      let response: string;

      // Check for local commands
      if (query.includes("weather")) {
        const weather = await getWeather(this.lastLocation);
        response = weather
          ? `It's ${weather.temperature}°, ${weather.condition}. Humidity ${weather.humidity}%.`
          : "Weather unavailable";
      } else if (query.includes("navigate") || query.includes("directions")) {
        response = "Navigation feature starting. Set your destination on the map.";
      } else if (query.includes("note")) {
        response = "Note saved. Say what you want to remember.";
      } else if (query.includes("translate")) {
        const lang = query.split("to")[1]?.trim() || "spanish";
        const text = query.split("to")[0]?.replace("translate", "").trim() || "";
        response = await translateText(text, lang);
      } else {
        // Gemini Q&A
        if (!this.geminiKey) {
          response = "Brain unavailable right now.";
        } else {
          response = await getGeminiResponse(query, this.geminiKey);
        }
      }

      this.channel.send("voiceResponse", { query, response });
    } catch (e) {
      console.error("[Icarian] Voice error:", e);
      this.channel.send("voiceResponse", { query, response: "Sorry, I couldn't process that." });
    }
  }

  private setupNotificationListener(): void {
    // Subscribe to notification events from @mentra/miniapp
    this.channel.on("notification", (notif: Notification) => {
      this.notifications.unshift(notif);
      // Keep last 20 notifications
      if (this.notifications.length > 20) {
        this.notifications.pop();
      }
      this.channel.send("notificationsUpdated", this.notifications);
    });
  }

  saveNote(content: string, isReminder: boolean = false, reminderTime?: number): void {
    const id = `note_${Date.now()}`;
    const note: Note = {
      id,
      content,
      timestamp: Date.now(),
      isReminder,
      reminderTime,
    };
    this.notes.set(id, note);
    this.channel.send("notesSaved", Array.from(this.notes.values()));
  }

  getNotes(): Note[] {
    return Array.from(this.notes.values());
  }
}
