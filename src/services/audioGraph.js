/**
 * Idara Audio Graph Service
 * Handles advanced audio processing including bandpass filtering and dynamic compression.
 */

export class AudioGraphService {
    constructor() {
        this.audioContext = null;
        this.mediaStream = null;
        this.sourceNode = null;
        this.bandpassFilter = null;
        this.compressor = null;
        this.analyser = null;
        this.destination = null;
    }

    async initialize() {
        try {
            // 1. Create Audio Context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext({
                sampleRate: 16000,
                latencyHint: 'interactive'
            });

            // 2. Get User Media with specific constraints
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 16000,
                    channelCount: 1
                }
            });

            // 3. Create Graph Nodes
            this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

            // Bandpass Filter (80Hz - 8kHz for human speech)
            this.bandpassFilter = this.audioContext.createBiquadFilter();
            this.bandpassFilter.type = 'bandpass';
            this.bandpassFilter.frequency.value = 1000;
            this.bandpassFilter.Q.value = 0.5;

            // Dynamics Compressor for lecture halls
            this.compressor = this.audioContext.createDynamicsCompressor();
            this.compressor.threshold.value = -50;
            this.compressor.knee.value = 40;
            this.compressor.ratio.value = 12;
            this.compressor.attack.value = 0.003;
            this.compressor.release.value = 0.25;

            // Analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;

            // Destination (MediaStream for Recorder)
            this.destination = this.audioContext.createMediaStreamDestination();

            // 4. Connect the Graph
            // Source -> Bandpass -> Compressor -> Analyser -> Destination
            this.sourceNode.connect(this.bandpassFilter);
            this.bandpassFilter.connect(this.compressor);
            this.compressor.connect(this.analyser);
            this.analyser.connect(this.destination);

            return {
                context: this.audioContext,
                processedStream: this.destination.stream,
                originalStream: this.mediaStream,
                analyser: this.analyser
            };
        } catch (error) {
            console.error("Failed to initialize Audio Graph:", error);
            throw error;
        }
    }

    getAnalyserData(dataArray) {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(dataArray);
            // Calculate average volume level (0-1)
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            return sum / dataArray.length / 255;
        }
        return 0;
    }

    cleanup() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.audioContext = null;
        this.mediaStream = null;
        this.sourceNode = null;
    }
}

export const audioGraph = new AudioGraphService();
