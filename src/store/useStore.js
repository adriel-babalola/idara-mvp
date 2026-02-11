import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            isRecording: false,
            isPaused: false,
            currentLecture: null,
            isOnline: navigator.onLine,
            settings: {
                autoSave: true,
                transcriptionQuality: 'standard'
            },

            startRecording: (data) => set({
                isRecording: true,
                isPaused: false,
                currentLecture: data
            }),

            pauseRecording: () => set({ isPaused: true }),
            resumeRecording: () => set({ isPaused: false }),
            stopRecording: () => set({ isRecording: false, isPaused: false }),

            setOnlineStatus: (status) => set({ isOnline: status }),

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            }))
        }),
        { name: 'idara-storage' }
    )
);
