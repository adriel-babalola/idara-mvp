import { useRef, useEffect } from 'react';
import { audioRecorder } from '../services/audioRecorder';

export default function WaveformVisualizer({ isActive }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);

    useEffect(() => {
        if (isActive && audioRecorder.stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(audioRecorder.stream);
            const analyser = audioContext.createAnalyser();

            analyser.fftSize = 256;
            source.connect(analyser);

            analyserRef.current = analyser;
            dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

            draw();

            return () => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                if (audioContext.state !== 'closed') audioContext.close();
            };
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
    }, [isActive]);

    const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;

        animationRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, width, height);

        const barWidth = (width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] / 2;

            ctx.fillStyle = `rgb(59, 130, 246)`; // Blue-500
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={100}
            className="w-full h-24 bg-gray-50 rounded-lg"
        />
    );
}
