import { pipeline, env } from '@huggingface/transformers';

// Configure environment
env.allowLocalModels = false; // Set to true if we download models locally
env.useBrowserCache = true;

class TranscriptionPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'onnx-community/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                progress_callback,
                dtype: 'q8',          // Explicitly use 8-bit quantization for mobile performance
                device: 'wasm',       // Explicit WASM backend
            });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { type, audio } = event.data;

    try {
        if (type === 'load') {
            await TranscriptionPipeline.getInstance((data) => {
                self.postMessage({
                    type: 'download',
                    data
                });
            });
            self.postMessage({ type: 'ready' });
        }
        else if (type === 'transcribe') {
            let transcriber = await TranscriptionPipeline.getInstance();

            const output = await transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
                return_timestamps: true, // Useful for UI syncing later
                language: 'en',
                task: 'transcribe',
                callback_function: (item) => {
                    self.postMessage({
                        type: 'partial',
                        data: item
                    });
                }
            });

            self.postMessage({
                type: 'complete',
                data: output
            });
        }
    } catch (error) {
        console.error('Whisper worker error:', error);
        self.postMessage({
            type: 'error',
            error: error.message || 'Unknown worker error'
        });
    }
});
