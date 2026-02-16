export class WhisperService {
    constructor() {
        this.worker = null;
        this.isReady = false;
        this.onTranscriptionUpdate = null;
        this.onStatusUpdate = null;
    }

    initialize() {
        if (this.worker) return;

        this.worker = new Worker(new URL('../workers/whisper.worker.js', import.meta.url), {
            type: 'module'
        });

        this.worker.onmessage = (event) => {
            const { type, data, error } = event.data;

            switch (type) {
                case 'ready':
                    this.isReady = true;
                    if (this.onStatusUpdate) this.onStatusUpdate('ready');
                    console.log('Whisper worker ready');
                    break;

                case 'download':
                    // data contains { status, file, progress, loaded, total }
                    if (data.status === 'progress') {
                        if (this.onStatusUpdate) this.onStatusUpdate(`downloading: ${Math.round(data.progress || 0)}%`);
                    } else if (data.status === 'initiate') {
                        if (this.onStatusUpdate) this.onStatusUpdate(`loading: ${data.file || 'model'}...`);
                    } else if (data.status === 'done') {
                        if (this.onStatusUpdate) this.onStatusUpdate(`loaded: ${data.file || 'model'}`);
                    }
                    break;

                case 'partial':
                    // partial transcription update
                    console.log('Partial transcription received:', data);
                    const partialText = typeof data === 'string' ? data : (data.text || '');
                    if (this.onTranscriptionUpdate) this.onTranscriptionUpdate(partialText, false);
                    break;

                case 'complete':
                    // final transcription
                    console.log('Complete transcription received:', data);
                    const completeText = typeof data === 'string' ? data : (data.text || '');
                    if (this.onTranscriptionUpdate) this.onTranscriptionUpdate(completeText, true);
                    break;

                case 'error':
                    console.error('Worker error:', error);
                    if (this.onStatusUpdate) this.onStatusUpdate('error');
                    break;
            }
        };

        this.worker.onerror = (event) => {
            console.error('Whisper worker error:', event);
            if (this.onStatusUpdate) this.onStatusUpdate('error');
        };

        this.worker.postMessage({ type: 'load' });
    }

    async transcribe(audioBlob) {
        if (!this.worker || !this.isReady) {
            // Try to init if not ready
            if (!this.worker) this.initialize();
            // Return or wait? Ideally wait, but for MVP simple check
        }

        // Convert Blob to Float32Array
        // We need to decode the audio data.
        // Since we are in the main thread (Service), we can use AudioContext to decode.

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            let audioData = audioBuffer.getChannelData(0); // get the first channel

            this.worker.postMessage({
                type: 'transcribe',
                audio: audioData
            });

            // Close context to free resources
            await audioContext.close();

        } catch (err) {
            console.error('Error processing audio for transcription:', err);
        }
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.isReady = false;
        }
    }
}

export const whisperService = new WhisperService();
