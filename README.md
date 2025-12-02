# 🎤 Voice Assistant (Node.js)

A simple and customizable **Voice Assistant built using Node.js**.  
It listens to user voice commands, converts them into text, processes the command, and responds using text-to-speech.

---

## 🚀 Features
- 🎙 **Speech-to-Text** (recognize your voice commands)
- 🔊 **Text-to-Speech** (assistant speaks responses)
- 🌐 **Open websites** (e.g., YouTube, Google)
- 📁 **Execute basic system commands**
- 🤖 **Custom commands support**
- 🛠 Easy to modify and expand

---

## 📂 Project Structure
voice-assistant/
│
├── index.js # Main entry file
├── package.json # Dependencies and scripts
├── commands/ # Custom command handlers (optional)
├── utils/ # Helper functions
├── .gitignore
└── README.md


---

## 🛑 Requirements
Before you start, make sure you have installed:

- **Node.js (v16 or above)**
- **npm** or **yarn**

---

## 📦 Install Dependencies

Run this command inside your project folder:

bash
npm install

To start the assistant:
node index.js

If you want to run using nodemon (for auto-reload):
npm install -g nodemon
nodemon index.js 

## How It Works

The assistant records your voice

Converts it to text using a Speech-to-Text engine
(Google STT, Whisper, Azure, etc. based on what you use)

Matches the command

Performs the action (open site / speak / respond)

Uses a TTS engine to speak the answer

Customizing Commands

## Add more commands in your logic:
if (text.includes("youtube")) {
    open("https://youtube.com");
}

## Environment Variables (Optional)

If your project uses API keys, create a .env file:
API_KEY=yourkey

## 📜 License

This project is open-source.
You can modify and use it freely.

## 👤 Author

Charul
Feel free to contribute or open issues!
---

# ✅ **Also Add This: .gitignore (Copy-Paste)**

Create a `.gitignore` file and paste:

```gitignore
node_modules/
.env
*.log
dist/
build/
