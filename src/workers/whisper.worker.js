import { pipeline, env } from '@huggingface/transformers';

// Skip local model checks, download from HF Hub
env.allowLocalModels = false;

class TranscriptionPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'onnx-community/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                progress_callback,
                dtype: 'q8',          // quantized for faster download & inference
                device: 'wasm',       // explicit WASM backend
            });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { type, audio } = event.data;

    if (type === 'load') {
        try {
            await TranscriptionPipeline.getInstance((data) => {
                self.postMessage({
                    type: 'download',
                    data
                });
            });
            self.postMessage({ type: 'ready' });
        } catch (error) {
            console.error(error);
            self.postMessage({ type: 'error', error: error.message });
        }
    } else if (type === 'transcribe') {
        let transcriber = await TranscriptionPipeline.getInstance();

        try {
            const output = await transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
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
        } catch (error) {
            console.error(error);
            self.postMessage({ type: 'error', error: error.message });
        }
    }
});
