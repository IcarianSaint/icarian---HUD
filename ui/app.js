const clock = document.querySelector('#clock');
const status = document.querySelector('#assistant-status');
const commandInput = document.querySelector('#command');
const form = document.querySelector('#command-form');
const listenButton = document.querySelector('#listen');

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date());
}

function respondTo(command) {
  const value = command.toLowerCase();
  if (value.includes('weather')) status.textContent = 'Weather is clear, 72 degrees.';
  else if (value.includes('navigate') || value.includes('direction')) status.textContent = 'Navigation active. Turn right in 0.4 miles.';
  else if (value.includes('notification')) status.textContent = 'You have two new notifications.';
  else if (value.includes('calendar') || value.includes('event')) status.textContent = 'Design review at 19:00 in Studio.';
  else status.textContent = `Command received: “${command}”`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const command = commandInput.value.trim();
  if (!command) return;
  respondTo(command);
  commandInput.value = '';
});

listenButton.addEventListener('click', () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    status.textContent = 'Speech input unavailable — type a preview command below.';
    commandInput.focus();
    return;
  }
  const recognition = new Recognition();
  recognition.lang = 'en-US';
  recognition.onstart = () => { status.textContent = 'Listening…'; };
  recognition.onresult = (event) => respondTo(event.results[0][0].transcript);
  recognition.onerror = () => { status.textContent = 'Could not hear that. Try again.'; };
  recognition.start();
});

updateClock();
setInterval(updateClock, 1000);
