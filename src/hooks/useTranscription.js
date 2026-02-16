import { useState, useEffect, useRef } from 'react';
import { whisperService } from '../services/whisperService';
import { audioRecorder } from '../services/audioRecorder';

export function useTranscription() {
    const [transcript, setTranscript] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState('loading model...');
    const audioContextRef = useRef(null);
    const processorRef = useRef(null);
    const sourceRef = useRef(null);
    const audioBufferRef = useRef([]);

    useEffect(() => {
        // Initialize service
        whisperService.onStatusUpdate = (msg) => setStatus(msg);
        whisperService.onTranscriptionUpdate = (text, isFinal) => {
            console.log('Transcription update:', { text, isFinal });
            if (text && text.trim()) {
                setTranscript(prev => {
                    // For partials: replace the current line, for final: append
                    if (isFinal) {
                        return prev ? prev + ' ' + text.trim() : text.trim();
                    } else {
                        // Show live partial text
                        return prev ? prev.split('\n')[0] + ' ' + text.trim() : text.trim();
                    }
                });
            }
        };

        const init = async () => {
            // We trigger download if needed
            whisperService.initialize();
            // Wait for ready check in a loop/interval or event
            const checkReady = setInterval(() => {
                if (whisperService.isReady) {
                    setIsReady(true);
                    setStatus('ready');
                    clearInterval(checkReady);
                }
            }, 500);
            return () => clearInterval(checkReady);
        };
        init();

        return () => {
            whisperService.terminate();
        };
    }, []);

    const startLiveTranscription = async () => {
        if (!audioRecorder.stream || !isReady) {
            console.warn('Transcription not ready - stream:', !!audioRecorder.stream, 'ready:', isReady);
            return;
        }

        // Create AudioContext to capture raw audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });

        const stream = audioRecorder.stream;
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

        // Use ScriptProcessor for legacy broad support (simple for MVP)
        // Buffer size 4096 ~ 0.25s at 16k
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        sourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination); // needed for chrome?

        let samples = new Float32Array(0);
        const CHUNK_LENGTH = 16000 * 5; // 5 seconds

        processorRef.current.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);

            // Append to buffer
            const newSamples = new Float32Array(samples.length + inputData.length);
            newSamples.set(samples);
            newSamples.set(inputData, samples.length);
            samples = newSamples;

            // processing chunk
            if (samples.length >= CHUNK_LENGTH) {
                // Send to worker
                // We clone it to avoid race conditions if we were truly async without copy
                const chunk = samples.slice();

                // clear buffer (or keep overlap?)
                // For simple "append" transcription, we clear. 
                // Xenova might handle context? sticking to simple clear.
                samples = new Float32Array(0);

                if (whisperService.worker && whisperService.isReady) {
                    whisperService.worker.postMessage({
                        type: 'transcribe',
                        audio: chunk
                    });
                }
            }
        };
    };

    const stopLiveTranscription = () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        audioBufferRef.current = [];
    };

    return {
        transcript,
        isReady,
        status,
        startLiveTranscription,
        stopLiveTranscription
    };
}
