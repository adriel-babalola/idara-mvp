import { audioGraph } from './audioGraph';

export class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.onDataAvailable = null;
        this.isInitialized = false;
        this.stream = null; // Store original stream for live transcription
    }

    async initialize() {
        try {
            if (this.isInitialized) return;

            const { processedStream, originalStream } = await audioGraph.initialize();
            this.stream = originalStream; // Store for live transcription access

            this.mediaRecorder = new MediaRecorder(processedStream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                    if (this.onDataAvailable) {
                        this.onDataAvailable(event.data);
                    }
                }
            };

            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing audio recorder:', error);
            throw new Error('Microphone access denied or not available');
        }
    }

    getAnalyserData(dataArray) {
        return audioGraph.getAnalyserData(dataArray);
    }

    start(timeSlice = 1000) {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'recording') return;
        this.audioChunks = [];
        this.mediaRecorder.start(timeSlice);
    }

    pause() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
        }
    }

    resume() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
        }
    }

    stop() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, {
                    type: 'audio/webm;codecs=opus'
                });
                // We do NOT stop the tracks here anymore because the graph manages them.
                // We might want to keep the graph alive for visualization even when not recording.
                // However, for battery life optimizations, we should probably have a distinct cleanup method.
                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }

    cleanup() {
        audioGraph.cleanup();
        this.isInitialized = false;
        this.mediaRecorder = null;
    }
}

export const audioRecorder = new AudioRecorder();
