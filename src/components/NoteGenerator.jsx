import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateNotes, initializeGemini } from '../services/geminiService';
import { generateNotesPrompt } from '../utils/promptTemplates';
import { updateLecture } from '../services/storageService';
import { Loader2, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function NoteGenerator({ lecture, onUpdate }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!lecture.transcript) {
            setError("No transcript available to generate notes from.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            initializeGemini();
            const prompt = generateNotesPrompt(lecture.transcript, {
                lectureTitle: lecture.title,
                duration: lecture.duration
            });

            const notes = await generateNotes(prompt);

            // Save to DB
            await updateLecture(lecture.id, {
                notes: {
                    raw: notes,
                    generatedAt: Date.now()
                },
                isProcessed: true
            });

            if (onUpdate) onUpdate();

        } catch (err) {
            console.error(err);
            setError("Failed to generate notes. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (lecture.notes?.raw) {
        return (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle className="text-green-500" size={24} />
                        Study Notes
                    </h3>
                    <span className="text-sm text-gray-500">
                        Generated {new Date(lecture.notes.generatedAt).toLocaleString()}
                    </span>
                </div>
                <div className="prose prose-blue max-w-none">
                    <ReactMarkdown>{lecture.notes.raw}</ReactMarkdown>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating Study Materials...
                    </>
                ) : (
                    <>
                        <FileText size={20} />
                        Generate AI Study Notes
                    </>
                )}
            </button>
        </div>
    );
}
