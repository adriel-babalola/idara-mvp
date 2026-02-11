import { useState, useEffect } from 'react';
import { extractVisualConcepts, generateVideo } from '../services/veoService';
import { Loader2, Video, Play, Download } from 'lucide-react';
import { updateLecture } from '../services/storageService';

export default function VideoAnimator({ lecture, onUpdate }) {
    const [concepts, setConcepts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatingId, setGeneratingId] = useState(null);
    const [videos, setVideos] = useState(lecture.videos || {});

    useEffect(() => {
        // If we have notes but no concepts extracted yet, we could auto-extract.
        // But let's make it a user action "Analyze for Video Concepts"
        if (lecture.concepts) {
            setConcepts(lecture.concepts);
        }
        if (lecture.videos) {
            setVideos(lecture.videos);
        }
    }, [lecture]);

    const handleAnalyze = async () => {
        if (!lecture.notes?.raw) return;

        setIsLoading(true);
        try {
            const extracted = await extractVisualConcepts(lecture.notes.raw);
            setConcepts(extracted);

            // Save concepts
            await updateLecture(lecture.id, {
                concepts: extracted
            });
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateVideo = async (concept, index) => {
        setGeneratingId(index);
        try {
            const videoUrl = await generateVideo(concept);

            const newVideos = { ...videos, [index]: videoUrl };
            setVideos(newVideos);

            await updateLecture(lecture.id, {
                videos: newVideos
            });
            if (onUpdate) onUpdate();

        } catch (err) {
            console.error(err);
            alert("Failed to generate video");
        } finally {
            setGeneratingId(null);
        }
    };

    if (!lecture.notes?.raw) return null;

    return (
        <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
                <Video className="text-pink-500" size={24} />
                Video Explanations
            </h3>

            {concepts.length === 0 ? (
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 transition-all"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <Video size={32} />
                            <span className="font-medium">Analyze Notes for Visual Concepts</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {concepts.map((concept, idx) => (
                        <div key={idx} className="bg-white border boundary-gray-200 rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-900 mb-2">{concept.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">{concept.description}</p>

                            {videos[idx] ? (
                                <div className="space-y-2">
                                    <video
                                        src={videos[idx]}
                                        controls
                                        className="w-full rounded-lg bg-black aspect-video"
                                    />
                                    <a
                                        href={videos[idx]}
                                        download={`idara-video-${idx}.mp4`}
                                        className="text-xs flex items-center gap-1 text-blue-600 hover:underline justify-center mt-2"
                                    >
                                        <Download size={14} /> Download Video
                                    </a>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleGenerateVideo(concept, idx)}
                                    disabled={generatingId !== null}
                                    className="w-full py-2 bg-gray-100 peer-hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                >
                                    {generatingId === idx ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            <span>Generating video... (this may take 1-3 min)</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play size={16} />
                                            <span>Generate Video</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
