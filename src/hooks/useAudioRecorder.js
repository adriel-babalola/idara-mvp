import { useState, useEffect, useRef } from 'react';
import { audioRecorder } from '../services/audioRecorder';
import { useStore } from '../store/useStore';

export function useAudioRecorder() {
    const {
        isRecording,
        isPaused,
        startRecording: startStoreRecording,
        stopRecording: stopStoreRecording,
        pauseRecording: pauseStoreRecording,
        resumeRecording: resumeStoreRecording
    } = useStore();

    const [duration, setDuration] = useState(0);
    const [permissionError, setPermissionError] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // Request permission on mount (optional, or wait for user action)
        // For now we just check if we can initialize
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, []);

    const startRecording = async () => {
        try {
            if (!audioRecorder.stream) {
                await audioRecorder.initialize();
            }

            audioRecorder.start();
            startStoreRecording({
                id: crypto.randomUUID(),
                title: `Lecture ${new Date().toLocaleString()}`,
                startTime: Date.now()
            });

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            setPermissionError(false);
        } catch (error) {
            console.error(error);
            setPermissionError(true);
        }
    };

    const stopRecording = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;

        const blob = await audioRecorder.stop();
        stopStoreRecording();
        setDuration(0);
        return blob;
    };

    const togglePause = () => {
        if (isPaused) {
            audioRecorder.resume();
            resumeStoreRecording();
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            audioRecorder.pause();
            pauseStoreRecording();
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getAnalyserData = (dataArray) => {
        return audioRecorder.getAnalyserData(dataArray);
    };

    return {
        isRecording,
        isPaused,
        duration,
        formatDuration,
        startRecording,
        stopRecording,
        togglePause,
        permissionError,
        getAnalyserData
    };
}
