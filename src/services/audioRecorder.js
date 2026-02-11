export class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.onDataAvailable = null;
    }

    async initialize() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000
                }
            });

            this.mediaRecorder = new MediaRecorder(this.stream, {
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
        } catch (error) {
            console.error('Error initializing audio recorder:', error);
            throw new Error('Microphone access denied or not available');
        }
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
                this.stream.getTracks().forEach(track => track.stop());
                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }
}

export const audioRecorder = new AudioRecorder();
