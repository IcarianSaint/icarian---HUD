/* global self */

/**
 * Icarian HUD background entry point.
 *
 * The host injects its SDK at runtime. Keeping the integration behind this
 * small adapter makes the dashboard previewable in a normal browser without
 * pretending that device permissions are available there.
 */
const state = {
  startedAt: new Date().toISOString(),
  lastCommand: null,
  notifications: []
};

function handleCommand(command) {
  const normalized = String(command || '').trim();
  if (!normalized) return { ok: false, error: 'Empty command' };

  state.lastCommand = normalized;
  return { ok: true, command: normalized, receivedAt: new Date().toISOString() };
}

function getState() {
  return { ...state, notifications: [...state.notifications] };
}

// These exports are useful to the host adapter and harmless in the browser
// preview. Replace the integration points with the SDK's lifecycle callbacks.
if (typeof module !== 'undefined') {
  module.exports = { handleCommand, getState };
}

if (typeof self !== 'undefined') {
  self.icarianHud = { handleCommand, getState };
}
