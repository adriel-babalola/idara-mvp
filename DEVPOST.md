# Devpost Submission — Idara: AI Lecture Companion

> Copy-paste the sections below into your Devpost submission form.

---

## 1️⃣ Project Title & Description

### Title

**Idara — AI-Powered Lecture Companion**

### Tagline

Record. Transcribe. Study Smarter. — An offline-first AI app that turns lectures into study superpowers.

### What problem are you solving?

University students — especially across Africa and the developing world — lose valuable lecture content every day. Lectures move fast, handwritten notes are incomplete, and most existing tools require stable internet and expensive subscriptions. Students with disabilities, language barriers, or different learning styles are further disadvantaged. There is no single, affordable, offline-capable tool that records, transcribes, generates study notes, AND creates visual explanations.

### What does your project do?

Idara is a Progressive Web App (PWA) that provides a complete lecture-to-study-material pipeline:

1. **Records lectures** with one tap and shows a real-time audio waveform
2. **Transcribes speech to text in real-time** using Whisper AI running entirely in the browser (offline-capable, no server needed)
3. **Generates comprehensive AI study notes** using Google Gemini 2.5 Flash — including summaries, key concepts, formulas, definitions, 10 practice questions, exam review points, and personalized study tips
4. **Creates short animated educational videos** using Google Veo 2 for the most visual concepts, making complex ideas easier to understand
5. **Stores everything locally** in IndexedDB — no account required, privacy-first, works offline

### Why it matters

- **Offline-first**: Core recording & transcription work without internet — critical for students with unreliable connectivity
- **Free**: No subscription or paywall for core features
- **Privacy-preserving**: Audio never leaves the device; transcription runs 100% in-browser
- **All-in-one**: Replaces 4+ separate tools (recorder, transcriber, note-taker, video searcher)
- **Inclusive**: Benefits students with hearing impairments, language barriers, and visual learning preferences
- **Actionable output**: Doesn't just record — produces exam-ready study materials automatically

---

## 2️⃣ Demo 🎥

- **Live Demo**: *(insert deployed URL, e.g., https://idara-mvp.vercel.app)*
- **Demo Video**: *(insert YouTube/Loom link, 1-3 minutes showing the full workflow: record → transcribe → generate notes → generate video)*

### Suggested Demo Script (1-3 min)

1. Open the app and show the clean interface (5s)
2. Click Record — show the waveform visualizer and live transcript appearing in real-time (30s)
3. Stop recording — show the lecture saved in the library (10s)
4. Expand the lecture — click "Generate AI Study Notes" and show the loading → complete notes with all sections (30s)
5. Click "Analyze Notes for Visual Concepts" — show concept cards appear (15s)
6. Click "Generate Video" on one concept — show the Veo 2 generation process and final video (30s)
7. Highlight: all transcription was offline, notes are structured and exam-ready, videos explain visually (10s)

---

## 3️⃣ Technical Details ⚙️

### How we built it

Idara is built as a modern React 19 single-page application with Vite 7, styled with Tailwind CSS 3.4, and designed as an offline-first PWA.

**Frontend Architecture:**
- React 19 + Vite 7 for the UI with hot module replacement
- Zustand 5 for lightweight persisted global state management
- Tailwind CSS 3.4 for responsive, utility-first styling
- Lucide React for consistent iconography
- React Markdown for rendering AI-generated notes

**Speech-to-Text (Offline):**
- Whisper Tiny (ONNX quantized q8) from Hugging Face runs entirely in a dedicated Web Worker
- @huggingface/transformers.js provides the inference pipeline in WebAssembly
- Audio is captured via MediaRecorder API and processed through Web Audio API's ScriptProcessor
- 5-second audio chunks are streamed to the worker for real-time partial transcription
- Zero server calls — works completely offline after initial model download

**AI Note Generation (Google Gemini):**
- Google Gemini 2.5 Flash via @google/generative-ai SDK
- Carefully engineered prompts produce structured notes with 7 sections: Executive Summary, Key Concepts, Formulas, Definitions, Practice Questions, Quick Review, and Study Tips
- Gemini also extracts the top 3 "most visual" concepts as structured JSON for video generation

**AI Video Generation (Google Veo 2):**
- Veo 2 REST API called through a Vite dev proxy (to bypass CORS)
- Generates 5-second, 16:9 educational animations from concept descriptions
- Long-running operations are polled every 10 seconds (up to 6 minutes)
- Videos are displayed inline with download capability

**Storage (Offline-First):**
- Dexie.js 4 wraps IndexedDB for structured local storage
- Stores lectures, audio blobs, transcripts, notes, concepts, and generated videos
- No user accounts or cloud sync required

**PWA:**
- Web App Manifest for install-to-homescreen
- Service Worker for offline launching

### Tools, Frameworks & APIs Used

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| Vite | 7.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling |
| Zustand | 5.0 | State management |
| Dexie.js | 4.3 | IndexedDB storage |
| @huggingface/transformers | 3.8 | In-browser ML inference |
| Whisper Tiny (ONNX) | q8 quantized | Speech-to-text model |
| Google Gemini 2.5 Flash | Latest | AI note generation + concept extraction |
| Google Veo 2 | Latest | AI video generation |
| @google/generative-ai | 0.24 | Gemini SDK |
| Lucide React | 0.563 | Icons |
| React Markdown | 10.1 | Markdown rendering |
| React Router DOM | 7.13 | Routing |
| Web Audio API | Browser native | Audio capture & visualization |
| MediaRecorder API | Browser native | Audio recording |

### How Google Gemini was used

Google Gemini 2.5 Flash is the **core intelligence engine** of Idara, used in two critical ways:

1. **Study Note Generation**: After a lecture is transcribed, the full transcript is sent to Gemini with a meticulously crafted prompt. Gemini produces a comprehensive study guide with: Executive Summary, Key Concepts (with examples and connections), Formulas/Equations, Definitions/Terminology, 10 Practice Questions (3 basic, 4 intermediate, 3 advanced), Quick Review Points, and Study Tips. The prompt includes metadata like lecture title and duration for contextual output.

2. **Visual Concept Extraction**: Gemini analyzes the generated study notes and identifies the top 3 concepts that would benefit most from visual animation. It returns structured JSON with title and description fields, which are then used as prompts for Google Veo 2 video generation.

This two-stage Gemini pipeline transforms raw spoken words into structured, actionable, multi-format study materials — making Gemini the "brain" behind Idara's learning experience.

---

## 4️⃣ Source Code 💻

- **GitHub Repository**: *(insert your GitHub repo URL, e.g., https://github.com/your-username/idara-mvp)*

The repository contains the complete source code with:
- Full React application source in `/src`
- Whisper Web Worker for offline transcription
- Gemini and Veo service integrations
- Dexie.js storage layer
- Prompt engineering templates
- PWA manifest and configuration

---

## 5️⃣ Team Information 👥

**Team Name:** Idara

| Name | Role |
|---|---|
| **Adriel Babalola** | Team Lead / Full-Stack Developer |
| **Ayomide Olajide** | Frontend Developer / UI Design |
| **Caleb Feranmi Oladele** | AI/ML Integration / Backend |

---

## 🔑 Important Notes

- ✅ Project was built entirely during the hackathon
- ✅ Uses open-source libraries (React, Vite, Tailwind, Dexie, Zustand, Hugging Face Transformers.js)
- ✅ Team of 3 members
- ✅ Project type: Web / AI
- ✅ Google Gemini 2.5 Flash is used extensively for note generation and concept extraction
- ✅ Google Veo 2 is used for educational video generation

---

## 🏆 Prize

**Google Cloud Swag Kit** — HandBag, Cup, and Books
