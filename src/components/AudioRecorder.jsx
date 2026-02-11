import { useEffect } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTranscription } from '../hooks/useTranscription';
import WaveformVisualizer from './WaveformVisualizer';
import { Mic, Square, Pause, Play, AlertCircle, Loader2 } from 'lucide-react';
import { saveLecture } from '../services/storageService';
import { useStore } from '../store/useStore';
import ReactMarkdown from 'react-markdown';

export default function AudioRecorder() {
    const {
        isRecording,
        isPaused,
        duration,
        formatDuration,
        startRecording,
        stopRecording,
        togglePause,
        permissionError
    } = useAudioRecorder();

    const {
        transcript,
        isReady: isTranscriberReady,
        status: transcriberStatus,
        startLiveTranscription,
        stopLiveTranscription
    } = useTranscription();

    const { currentLecture } = useStore();

    // Auto-start transcription when recording starts
    useEffect(() => {
        if (isRecording && !isPaused) {
            startLiveTranscription();
        } else {
            stopLiveTranscription();
        }
        return () => stopLiveTranscription();
    }, [isRecording, isPaused]);

    // Pass transcript updates to store or lecture?
    // ideally we save the final transcript with the lecture.
    // For now, we'll just display it.

    const handleStop = async () => {
        const audioBlob = await stopRecording();
        if (audioBlob && currentLecture) {
            await saveLecture({
                ...currentLecture,
                duration,
                audioBlob,
                transcript // Save the accumulated transcript
            });
            alert('Lecture saved successfully!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col items-center gap-8">

                    {/* Timer Display */}
                    <div className="text-6xl font-mono font-bold text-gray-800 tracking-wider">
                        {formatDuration(duration)}
                    </div>

                    {/* Visualizer */}
                    <div className="w-full">
                        <WaveformVisualizer isActive={isRecording && !isPaused} />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        {!isRecording ? (
                            <button
                                onClick={startRecording}
                                disabled={!isTranscriberReady}
                                className={`group relative flex items-center justify-center p-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 ${isTranscriberReady ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isTranscriberReady && <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20 group-hover:opacity-40" />}
                                <Mic size={32} className="text-white relative z-10" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={togglePause}
                                    className="p-4 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
                                >
                                    {isPaused ? <Play size={32} className="text-white" /> : <Pause size={32} className="text-white" />}
                                </button>
                                <button
                                    onClick={handleStop}
                                    className="p-4 rounded-full bg-gray-800 hover:bg-gray-900 transition-all shadow-md hover:shadow-lg hover:scale-105"
                                >
                                    <Square size={32} className="text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Status Message */}
                    <div className="text-sm text-gray-500 flex items-center gap-2 h-6">
                        {!isTranscriberReady ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" />
                                <span>{transcriberStatus}</span>
                            </>
                        ) : (
                            isRecording ? (isPaused ? 'Recording paused' : 'Recording & Transcribing...') : 'Ready to record'
                        )}
                    </div>

                    {permissionError && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                            <AlertCircle size={20} />
                            <span>Microphone access needed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Transcript View */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[200px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>Live Transcript</span>
                    {isRecording && !isPaused && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {transcript || (isRecording ? "Listening..." : "Start recording to see transcription...")}
                </div>
            </div>
        </div>
    );
}
