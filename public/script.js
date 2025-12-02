// public/script.js
const statusEl = document.getElementById('status');
const heardEl = document.getElementById('heard');
const replyEl = document.getElementById('reply');
const btn = document.getElementById('start');

// Web Speech API
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec, recordingTimeout, countdownInterval;
let isRecording = false;

if (SR) {
  rec = new SR();
  rec.lang = 'en-US';
  rec.continuous = true;     // keep listening until manually stopped
  rec.interimResults = false;
} else {
  alert('Speech Recognition not supported in this browser. Try Chrome.');
}

// Max recording time in milliseconds
const MAX_RECORD_TIME = 15000; // 15 seconds

btn.addEventListener('click', () => {
  if (!rec) return;

  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
});

function startRecording() {
  isRecording = true;
  heardEl.textContent = '—';
  replyEl.textContent = '—';
  statusEl.textContent = 'Listening…';
  rec.start();

  // Countdown timer
  let remaining = Math.ceil(MAX_RECORD_TIME / 1000);
  btn.textContent = `⏹ Stop (${remaining}s)`;
  btn.classList.add('recording');
  countdownInterval = setInterval(() => {
    remaining--;
    if (remaining > 0) btn.textContent = `⏹ Stop (${remaining}s)`;
  }, 1000);

  // Auto-stop after MAX_RECORD_TIME
  recordingTimeout = setTimeout(() => stopRecording(), MAX_RECORD_TIME);
}

function stopRecording() {
  isRecording = false;
  btn.textContent = '🎤 Talk';
  btn.classList.remove('recording');
  clearTimeout(recordingTimeout);
  clearInterval(countdownInterval);
  rec.stop();
  statusEl.textContent = 'Ready';
}

rec && (rec.onresult = async (evt) => {
  const text = Array.from(evt.results)
    .map(r => r[0].transcript)
    .join(' ');

  heardEl.textContent = text;
  statusEl.textContent = 'Thinking…';

  const answer = await think(text);
  replyEl.textContent = answer;

  statusEl.textContent = 'Talking…';
  try {
    // Use speechSynthesis for in-browser speech
    const utter = new SpeechSynthesisUtterance(answer);
    utter.onend = () => { statusEl.textContent = 'Ready'; };
    speechSynthesis.speak(utter);
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error: ' + err.message;
  }
});

rec && (rec.onerror = (e) => {
  statusEl.textContent = 'Mic error: ' + e.error;
  stopRecording();
});

rec && (rec.onend = () => {
  if (isRecording) stopRecording();
});

// Tiny "brain" with multiple responses and simple math
async function think(text) {
  const t = (text || '').toLowerCase();
  const now = new Date();

  if (!t.trim()) return "I didn't hear anything. Want to try again?";

  // Greetings
  if (/(^|\b)(hi|hello|hey)\b/.test(t)) {
    const greetings = [
      "Hello! I'm here.",
      "Hi there! How can I help?",
      "Hey! Ready to chat?",
      "Hi! Hope you're having a good day!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Name
  if (t.includes('your name')) {
    const names = [
      "I'm your local voice assistant.",
      "They call me Tint Talking Friend!",
      "You can call me your voice assistant."
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  // Time
  if (t.includes('time')) {
    const times = [
      `It's ${now.toLocaleTimeString()}.`,
      `Current time is ${now.toLocaleTimeString()}.`,
      `Right now, the time is ${now.toLocaleTimeString()}.`
    ];
    return times[Math.floor(Math.random() * times.length)];
  }

  // Day
  if (t.includes('day')) {
    const days = [
      `Today is ${now.toLocaleDateString(undefined, { weekday: 'long' })}.`,
      `It's ${now.toLocaleDateString(undefined, { weekday: 'long' })} today.`,
      `The day today is ${now.toLocaleDateString(undefined, { weekday: 'long' })}.`
    ];
    return days[Math.floor(Math.random() * days.length)];
  }

  // Thanks
  if (t.includes('thank')) {
    const thanks = [
      "You're welcome!",
      "No problem!",
      "Anytime!",
      "Glad to help!"
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }

  // Jokes
  if (t.includes('joke')) {
    const jokes = [
      "Why did the computer sneeze? It caught a byte!",
      "Why was the computer cold? It left its Windows open!",
      "Why did the laptop marry the Wi-Fi? They had a strong connection!",
      "Why did the programmer go broke? Because he used up all his cache!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Motivational quotes
  if (t.includes('motivate') || t.includes('quote')) {
    const quotes = [
      "Believe you can and you're halfway there.",
      "Every day is a second chance.",
      "Dream big, work hard, stay focused.",
      "Don't watch the clock; do what it does. Keep going."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Simple math (addition, subtraction, multiplication, division)
  const mathMatch = t.match(/(\d+)\s*(plus|\+|add|minus|\-|subtract|times|\*|multiply|divided by|\/)\s*(\d+)/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const num2 = parseFloat(mathMatch[3]);
    const op = mathMatch[2];

    if (op.includes('plus') || op == '+') return `The answer is ${num1 + num2}.`;
    if (op.includes('minus') || op == '-') return `The answer is ${num1 - num2}.`;
    if (op.includes('times') || op == '*' || op.includes('multiply')) return `The answer is ${num1 * num2}.`;
    if (op.includes('divided') || op == '/') return `The answer is ${num1 / num2}.`;
  }

  // Weather (dummy responses)
  const weatherMatch = t.match(/weather in (\w+)/);
  if (weatherMatch) {
    const city = weatherMatch[1];
    const weatherResponses = [
      `Currently in ${city}, it's sunny with 25°C.`,
      `It's partly cloudy in ${city} with a temperature of 25°C.`,
      `Right now, ${city} has clear skies and 25°C.`
    ];
    return weatherResponses[Math.floor(Math.random() * weatherResponses.length)];
  }

  // Fallback / echo
  const fallback = [
    `I heard: "${text}". How can I help next?`,
    `You said: "${text}". What should we do now?`,
    `Got it: "${text}". What's next?`
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}
