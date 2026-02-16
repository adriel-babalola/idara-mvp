<p align="center">
  <img src="https://img.shields.io/badge/Idara-AI%20Lecture%20Companion-4f46e5?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Idara" />
</p>

<h1 align="center">🎓 Idara — AI Lecture Companion</h1>

<p align="center">
  <strong>Record. Transcribe. Study Smarter.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Whisper-Offline%20STT-FF6F00?logo=huggingface&logoColor=white" />
  <img src="https://img.shields.io/badge/Veo%202-Video%20Gen-EA4335?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?logo=pwa&logoColor=white" />
</p>

---

Idara is an AI-powered Progressive Web App (PWA) that transforms how students capture and study from lectures. It records audio, transcribes in real-time using on-device AI, generates comprehensive study notes with Google Gemini, and creates short educational video explanations using Google Veo 2 — all from a single recording session.

**"Idara"** means *"management / administration"* in Yoruba — helping students manage their learning more effectively.

---

## 🚀 The Problem

University students face a daily struggle:

- **Missed information** — Lectures move fast and manual note-taking means missing key points
- **Poor study materials** — Handwritten or hastily typed notes are often incomplete and disorganized
- **No visual aids** — Complex concepts are hard to grasp from text alone
- **Accessibility gaps** — Students with disabilities, language barriers, or different learning styles are left behind
- **Expensive tools** — Existing solutions require costly subscriptions

## ✅ The Solution

Idara solves this with a **one-click workflow**:

1. **🎤 Record** — Hit record during a lecture
2. **📝 Transcribe** — Real-time speech-to-text runs entirely on-device (offline-capable via Whisper)
3. **📚 Generate Notes** — Google Gemini analyzes the transcript and produces structured study materials with summaries, key concepts, definitions, formulas, practice questions, and study tips
4. **🎬 Generate Videos** — Google Veo 2 creates short animated video explanations of the most visual concepts from the notes

---

## 🎥 Demo

> 📹 **Demo Video**: [Watch on YouTube / Loom](#) *(insert link)*
>
> 🌐 **Live Demo**: [https://idara-mvp.vercel.app](#) *(insert link)*

---

## ⚙️ Technical Details

### Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                    Frontend (React + Vite)        │
│  ┌────────────┐ ┌─────────────┐ ┌──────────────┐ │
│  │   Audio     │ │  Note       │ │   Video      │ │
│  │  Recorder   │ │ Generator   │ │  Animator    │ │
│  └──────┬──────┘ └──────┬──────┘ └──────┬───────┘ │
│         │               │               │         │
│  ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼───────┐ │
│  │  Whisper    │ │  Gemini     │ │   Veo 2      │ │
│  │  (On-Device)│ │  (Cloud)    │ │  (Cloud)     │ │
│  └──────┬──────┘ └─────────────┘ └──────────────┘ │
│         │                                          │
│  ┌──────▼──────────────────────────────────────┐   │
│  │          IndexedDB (Dexie.js)               │   │
│  │   Lectures · Transcripts · Notes · Videos   │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### How We Built It

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS | Fast, modern UI with responsive design |
| **State Management** | Zustand (persisted) | Lightweight global state with localStorage persistence |
| **Speech-to-Text** | Hugging Face Transformers.js + Whisper Tiny (ONNX, quantized) | **On-device** real-time transcription via Web Worker — works offline |
| **AI Notes** | Google Gemini 2.5 Flash | Generates structured study materials from transcripts |
| **AI Video** | Google Veo 2 | Generates short animated educational videos from key concepts |
| **Storage** | Dexie.js (IndexedDB) | Client-side persistent storage for lectures, audio, transcripts, and notes |
| **Audio** | Web Audio API + MediaRecorder | High-quality audio capture with waveform visualization |
| **PWA** | Web App Manifest + Service Worker | Installable, offline-ready progressive web app |

### How Google Gemini Is Used

Gemini 2.5 Flash powers the **intelligent note generation** pipeline:

1. **Input**: Raw lecture transcript + metadata (title, duration, subject)
2. **Processing**: A carefully engineered prompt instructs Gemini to produce:
   - 📋 Executive Summary
   - 🎯 Key Concepts (with explanations, examples, and connections)
   - 📐 Formulas & Equations (when applicable)
   - 📖 Definitions & Terminology
   - ❓ 10 Practice Questions (Basic → Intermediate → Advanced)
   - ⚡ Quick Review Points for exam prep
   - 💡 Personalized Study Tips
3. **Output**: Beautifully rendered Markdown study notes saved alongside the lecture

Gemini is also used to **analyze notes and extract visual concepts** that benefit from animated explanations, which are then sent to Veo 2 for video generation.

### How Google Veo 2 Is Used

Veo 2 generates **short (5-second) educational animations** for the top visual concepts identified by Gemini:

1. Gemini extracts the 3 most "visual" concepts from the study notes
2. Each concept is turned into a descriptive prompt for Veo 2
3. Veo 2 generates a 16:9 animated video explaining the concept
4. Videos are displayed inline and downloadable for offline study

### Key Technical Highlights

- **🔒 Privacy-First**: Audio never leaves the device — Whisper runs entirely in-browser via WebAssembly
- **⚡ Real-Time**: Live transcription streams as you speak using Web Workers + ScriptProcessor
- **📱 PWA**: Installable on any device, works offline for recording and reviewing saved content
- **🧠 On-Device AI**: Whisper Tiny (quantized ONNX) runs in a dedicated Web Worker for non-blocking performance
- **🎨 Waveform Visualization**: Real-time audio frequency visualization using Canvas + Web Audio API

---

## 📁 Project Structure

```
idara-mvp/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # App icons (192x192, 512x512)
│   └── models/                # (reserved for local model cache)
├── src/
│   ├── App.jsx                # Main app layout
│   ├── components/
│   │   ├── AudioRecorder.jsx  # Recording UI + controls
│   │   ├── WaveformVisualizer.jsx  # Real-time audio waveform
│   │   ├── LectureList.jsx    # Saved lectures library
│   │   ├── NoteGenerator.jsx  # Gemini-powered note generation
│   │   └── VideoAnimator.jsx  # Veo 2 video generation
│   ├── hooks/
│   │   ├── useAudioRecorder.js   # Recording state & logic
│   │   └── useTranscription.js   # Live transcription stream
│   ├── services/
│   │   ├── audioRecorder.js   # MediaRecorder wrapper
│   │   ├── whisperService.js  # Whisper Web Worker bridge
│   │   ├── geminiService.js   # Google Gemini API client
│   │   ├── veoService.js      # Google Veo 2 API client
│   │   └── storageService.js  # Dexie/IndexedDB CRUD
│   ├── store/
│   │   └── useStore.js        # Zustand global state
│   ├── utils/
│   │   └── promptTemplates.js # Gemini prompt engineering
│   └── workers/
│       └── whisper.worker.js  # Whisper ONNX inference worker
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one free](https://aistudio.google.com/apikey))
- (Optional) A Google Veo API key for video generation

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/idara-mvp.git
cd idara-mvp

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_VEO_API_KEY=your_veo_api_key_here  # Optional, falls back to Gemini key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Built With

- [React 19](https://react.dev/) — UI framework
- [Vite 7](https://vite.dev/) — Build tool
- [Tailwind CSS 3](https://tailwindcss.com/) — Utility-first styling
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [Dexie.js](https://dexie.org/) — IndexedDB wrapper
- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) — On-device ML inference
- [Whisper Tiny (ONNX)](https://huggingface.co/onnx-community/whisper-tiny.en) — Speech recognition model
- [Google Gemini 2.5 Flash](https://ai.google.dev/) — AI note generation
- [Google Veo 2](https://deepmind.google/technologies/veo/) — AI video generation
- [Lucide React](https://lucide.dev/) — Icon library
- [React Markdown](https://remarkjs.github.io/react-markdown/) — Markdown rendering

---

## 👥 Team Information

**Team Name**: Idara

| Name | Role |
|---|---|
| **Adriel Babalola** | Team Lead / Full-Stack Developer |
| **Ayomide Olajide** | Frontend Developer / UI Design |
| **Caleb Feranmi Oladele** | AI/ML Integration / Backend |

---

## 🏆 Hackathon Submission

This project was built for the **Google Cloud Hackathon** and demonstrates innovative use of:

- **Google Gemini 2.5 Flash** — AI-powered study note generation and concept extraction
- **Google Veo 2** — Automated educational video generation from lecture concepts
- **Offline-first architecture** — Solving real connectivity challenges for students in Africa and beyond

### Prize
🎉 **Winner — Google Cloud Swag Kit** (HandBag, Cup, and Books)

---

## 🗺️ Roadmap

- [ ] Multi-language transcription support (Yoruba, Hausa, French, etc.)
- [ ] Collaborative note sharing between students
- [ ] Flashcard generation from study notes
- [ ] Quiz mode with spaced repetition
- [ ] Cloud sync (optional) for cross-device access
- [ ] Lecture summarization timeline with timestamps
- [ ] Export notes as PDF/DOCX

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Google AI Studio](https://aistudio.google.com/) for Gemini & Veo API access
- [Hugging Face](https://huggingface.co/) for the Whisper ONNX models
- [Xenova/transformers.js](https://github.com/xenova/transformers.js) for in-browser ML inference
- The open-source community for React, Vite, Tailwind, Dexie, Zustand, and Lucide

---

<p align="center">
  Built with ❤️ during a hackathon by <strong>Team Idara</strong><br/>
  <em>Because every lecture deserves to be remembered.</em>
</p>
|