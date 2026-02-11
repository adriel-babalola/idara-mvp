import { useState, useEffect } from 'react';
import { getLectures } from '../services/storageService';
import NoteGenerator from './NoteGenerator';
import VideoAnimator from './VideoAnimator';
import { Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function LectureList() {
    const [lectures, setLectures] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    const loadLectures = async () => {
        const data = await getLectures();
        setLectures(data);
    };

    useEffect(() => {
        loadLectures();
        // Poll for updates or subscribe? 
        // For MVP, simple polling or manual refresh trigger from parent would be better.
        // We'll rely on parent re-rendering or just poll every few seconds for new recordings.
        const interval = setInterval(loadLectures, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (lectures.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                No lectures recorded yet.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Library</h2>

            {lectures.map(lecture => (
                <div key={lecture.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                        onClick={() => toggleExpand(lecture.id)}
                    >
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-gray-900">{lecture.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(lecture.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {lecture.isProcessed ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Processed
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    Pending Notes
                                </span>
                            )}
                            {expandedId === lecture.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>

                    {expandedId === lecture.id && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-2">Transcript Preview</h4>
                                <p className="text-gray-600 text-sm line-clamp-3 italic">
                                    {lecture.transcript || "No transcript available."}
                                </p>
                            </div>

                            <NoteGenerator lecture={lecture} onUpdate={loadLectures} />
                            <VideoAnimator lecture={lecture} onUpdate={loadLectures} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
