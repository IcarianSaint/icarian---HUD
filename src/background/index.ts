import { registerMiniapp } from "@mentra/miniapp/background";
import { Icarian } from "./icarian";

const icarian = new Icarian();

registerMiniapp({
  onStart: () => {
    console.log("[Icarian] Background service started");
    icarian.start();
  },
  onSuspend: () => {
    console.log("[Icarian] Background service suspended");
    icarian.suspend();
  },
  onResume: () => {
    console.log("[Icarian] Background service resumed");
    icarian.resume();
  },
  onTerminate: () => {
    console.log("[Icarian] Background service terminated");
    icarian.terminate();
  },
});
