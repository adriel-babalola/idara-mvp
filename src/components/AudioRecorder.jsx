import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTranscription } from '../hooks/useTranscription';
import { saveLecture } from '../services/storageService';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Pause, Play, AlertCircle, Loader2, Save } from 'lucide-react';

export default function AudioRecorder() {
    const {
        isRecording,
        isPaused,
        duration,
        formatDuration,
        startRecording,
        stopRecording,
        togglePause,
        permissionError,
        getAnalyserData
    } = useAudioRecorder();

    const {
        transcript,
        isReady: isTranscriberReady,
        status: transcriberStatus,
        startLiveTranscription,
        stopLiveTranscription
    } = useTranscription();

    const { currentLecture } = useStore();
    const [audioLevel, setAudioLevel] = useState(0);
    const animationFrameRef = useRef(null);
    const analyserDataRef = useRef(new Uint8Array(256));
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    // Audio Visualizer Loop
    useEffect(() => {
        if (isRecording && !isPaused) {
            const updateVisuals = () => {
                const level = getAnalyserData(analyserDataRef.current);
                setAudioLevel(level); // Normalized 0-1
                animationFrameRef.current = requestAnimationFrame(updateVisuals);
            };
            updateVisuals();
        } else {
            setAudioLevel(0);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRecording, isPaused]);

    // Transcription Lifecycle
    useEffect(() => {
        if (isRecording && !isPaused) {
            startLiveTranscription();
        } else {
            stopLiveTranscription();
        }
        return () => stopLiveTranscription();
    }, [isRecording, isPaused]);

    // Haptic Feedback Helper
    const vibrate = (pattern = [10]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    const handleRecordToggle = async () => {
        vibrate([20]);
        if (!isRecording) {
            await startRecording();
        } else {
            // If already recording, we might want to pause or stop?
            // The UI design shows a separate stop button, so this main button might be pause/resume or just status.
            // But usually the big button is "Stop" if recording.
            // Let's follow the typical pattern: Tap to Record -> Tap to Stop (or separate controls)
            // The visual design in prompt implies: 
            // {isRecording ? <Square /> : <Mic />}
            // So big button toggles Recording/Stop.
            if (isPaused) {
                togglePause();
            } else {
                // If recording, we show Pause/Stop options usually, but prompt code shows:
                // onClick={handleRecordToggle} -> isRecording ? Square : Mic
                // So let's implement STOP on the big button for simplicity consistent with prompt
                handleStop();
            }
        }
    };

    const handlePauseToggle = () => {
        vibrate([10]);
        togglePause();
    };

    const handleStop = async () => {
        vibrate([50]);
        const audioBlob = await stopRecording();
        if (audioBlob && currentLecture) {
            await saveLecture({
                ...currentLecture,
                duration,
                audioBlob,
                transcript
            });
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        }
    };

    return (
        <div className="relative h-[80vh] w-full flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl overflow-hidden shadow-2xl border border-white/50">

            {/* Background Visualizer */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                animate={{
                    background: `radial-gradient(circle at center, rgba(59, 130, 246, ${Math.max(0.1, audioLevel * 0.8)}) 0%, transparent 70%)`
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            />

            {/* Left Side: Header + Transcript */}
            <div className="relative z-10 flex-1 flex flex-col w-full lg:w-1/2">
                {/* Header / Status */}
                <div className="flex items-center justify-between p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-white/30">
                    <div className="flex items-center gap-3">
                        {isRecording && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-red-500 shadow-sm"
                            >
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm font-bold tracking-wide">REC</span>
                                <span className="font-mono text-gray-700 w-16 text-right">{formatDuration(duration)}</span>
                            </motion.div>
                        )}
                    </div>

                    <div className="text-xs lg:text-sm font-medium text-gray-500 bg-white/50 px-2 lg:px-3 py-1 rounded-full backdrop-blur-sm">
                        {transcriberStatus}
                    </div>
                </div>

                {/* Live Transcript Area */}
                <div className="relative flex-1 px-4 lg:px-6 py-4 overflow-y-auto mask-gradient-b">
                    {transcript ? (
                        <div className="space-y-4">
                            <p className="text-lg lg:text-xl font-medium leading-relaxed text-gray-800 tracking-wide">
                                {transcript}
                                {isRecording && !isPaused && (
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="inline-block w-2 h-5 bg-blue-500 ml-1 align-middle"
                                    />
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <Mic size={48} className="opacity-20" />
                            <p className="text-lg">Tap the microphone to start your lecture</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Controls */}
            <div className="relative z-20 w-full lg:w-1/2 p-6 lg:p-8 flex flex-col items-center justify-center">

                <div className="flex items-center gap-8">
                    {/* Pause Button (Only when recording) */}
                    <AnimatePresence>
                        {isRecording && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                onClick={handlePauseToggle}
                                className="p-4 rounded-full bg-yellow-400 text-yellow-900 shadow-lg hover:bg-yellow-500 transition-colors"
                            >
                                {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Main Record/Stop Button */}
                    <motion.button
                        layout
                        whileTap={{ scale: 0.9 }}
                        /* When recording, Button is RED SQUARE (Stop). When idle, Button is BLUE MIC (Record) */
                        onClick={isRecording ? handleStop : handleRecordToggle}
                        disabled={!isTranscriberReady && !isRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${isRecording
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-200'
                                : isTranscriberReady
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {isRecording ? (
                                <motion.div
                                    key="stop"
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: -180 }}
                                >
                                    <Square size={32} fill="white" className="text-white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="record"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Mic size={40} className="text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {permissionError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg"
                    >
                        <AlertCircle size={20} />
                        <span>Microphone access needed</span>
                    </motion.div>
                )}

                <AnimatePresence>
                    {showSaveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
                        >
                            <Save size={16} />
                            <span className="font-medium text-sm">Lecture saved!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
