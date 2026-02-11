# Devpost Submission — Idara: AI Lecture Companion

> Copy-paste the sections below into your Devpost submission form.

---

## 1️⃣ Project Title & Description

### Title

**Idara — AI Lecture Companion**

### Tagline

Record lectures, get AI-powered study notes and video explanations — all from one click.

### Description

**What problem are we solving?**

University students lose critical information during fast-paced lectures. Manual note-taking is incomplete, disorganized, and fails students with accessibility needs. Existing tools are either cloud-only (privacy concerns), expensive, or don't go beyond basic transcription.

**What does Idara do?**

Idara is a Progressive Web App that turns any lecture into a complete study toolkit:

1. **Records** lecture audio with a beautiful, one-click interface
2. **Transcribes in real-time** using Whisper AI running entirely on-device (no data leaves the browser)
3. **Generates structured study notes** powered by Google Gemini 2.5 Flash — including summaries, key concepts, formulas, definitions, 10 practice questions, and study tips
4. **Creates short animated video explanations** using Google Veo 2 for the most visual concepts

**Why does it matter?**

- **Privacy-first**: Whisper runs in-browser via WebAssembly — audio never leaves the device
- **Accessible**: Works on any device with a browser; installable as a PWA; offline-capable
- **Complete**: Goes beyond transcription to produce exam-ready study materials and visual aids
- **Free & open-source**: No subscriptions, no lock-in

Idara democratizes high-quality study materials for every student, regardless of budget or ability.

---

## 2️⃣ Demo

> **Live Demo**: [https://idara-mvp.vercel.app](#) *(insert your deployed URL)*
>
> **Demo Video** (1–3 min): [https://youtu.be/your-video-id](#) *(insert your video link)*

### Demo Walkthrough

1. Open Idara → Whisper model auto-downloads (~40MB, one-time)
2. Click the red mic button to start recording
3. Speak or play a lecture — watch the live transcript appear in real-time
4. Stop recording → lecture is saved to your local library
5. Expand a saved lecture → click **"Generate AI Study Notes"**
6. Gemini produces rich, structured Markdown notes with practice questions
7. Click **"Analyze Notes for Visual Concepts"** → Gemini identifies top concepts
8. Click **"Generate Video"** → Veo 2 creates a 5-second animated explanation
9. Download videos for offline study

---

## 3️⃣ Technical Details

### How We Built It

- **Frontend**: React 19 + Vite 7 + Tailwind CSS — fast, responsive, modern UI
- **On-Device AI**: Hugging Face Transformers.js running Whisper Tiny (quantized ONNX) in a Web Worker for real-time, offline speech-to-text
- **Google Gemini 2.5 Flash**: Powers the intelligent note generation pipeline with carefully engineered prompts that produce structured study materials (summaries, concepts, formulas, practice questions, study tips)
- **Google Veo 2**: Generates short educational animation videos from concepts extracted by Gemini
- **Storage**: Dexie.js (IndexedDB) for fully client-side persistent storage of lectures, transcripts, notes, and videos
- **State Management**: Zustand with persistence middleware
- **PWA**: Web App Manifest for installability; offline recording and review capability
- **Audio Pipeline**: Web Audio API + MediaRecorder API with real-time waveform visualization via Canvas

### How Google Gemini Was Used

Gemini 2.5 Flash is the brains behind two core features:

1. **Study Note Generation**: Given a lecture transcript, Gemini produces structured Markdown notes with 7 sections — Executive Summary, Key Concepts, Formulas, Definitions, Practice Questions (10, graded by difficulty), Quick Review Points, and Study Tips

2. **Visual Concept Extraction**: Gemini analyzes the generated notes and identifies the top 3 concepts that would benefit most from animated video explanations, outputting structured JSON that feeds directly into Veo 2

### Tools, Frameworks & APIs

| Tool | Usage |
|---|---|
| React 19 | UI components |
| Vite 7 | Dev server & build |
| Tailwind CSS 3 | Styling |
| Zustand | State management |
| Dexie.js | IndexedDB storage |
| Hugging Face Transformers.js | On-device Whisper inference |
| Google Gemini 2.5 Flash API | Note generation + concept extraction |
| Google Veo 2 API | Educational video generation |
| Web Audio API | Audio capture + waveform visualization |
| Lucide React | Icons |
| React Markdown | Rendering AI-generated notes |

---

## 4️⃣ Source Code

**GitHub Repository**: [https://github.com/your-username/idara-mvp](https://github.com/your-username/idara-mvp) *(insert your repo URL)*

The repository includes:
- Full source code (React/Vite)
- README with setup instructions
- Architecture documentation
- Environment variable templates

---

## 5️⃣ Team Information

**Team Name**: Idara

| Member | Role |
|---|---|
| **Adriel Babalola** | Team Lead / Full-Stack Developer |
| **Ayomide Olajide** | Frontend Developer / UI Design |
| **Caleb Feranmi Oladele** | AI/ML Integration / Backend |

---

## Additional Tags for Devpost

- **Built with**: React, Vite, Tailwind CSS, Google Gemini, Google Veo 2, Hugging Face Transformers.js, IndexedDB, Web Audio API
- **Categories**: AI, Education, Web, Accessibility, PWA
- **Platforms**: Web (any modern browser)

---

## Prize Won

🏆 **Google Cloud Swag Kit** — HandBag, Cup, and Books
