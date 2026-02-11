import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_VEO_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

// Proxy path works with both Vite dev proxy and Vercel rewrites
const PROXY_BASE = "/api/google/v1beta";

let genAI = null;
let flashModel = null;

const initialize = () => {
    if (genAI) return;
    if (!API_KEY) throw new Error("API Key missing");

    genAI = new GoogleGenerativeAI(API_KEY);
    flashModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const extractVisualConcepts = async (notesRaw) => {
    initialize();

    const prompt = `
    Analyze these study notes and identify the top 3 concepts that would benefit most from a visual animation.
    Return ONLY a JSON array of objects with 'title' and 'description' keys.
    
    NOTES:
    ${notesRaw.substring(0, 10000)}...
    `;

    try {
        const result = await flashModel.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Concept extraction failed", error);
        return [];
    }
};

/**
 * Generate a video using the Veo REST API via Vite proxy (to avoid CORS).
 * Uses the generateVideos endpoint with veo-2 model.
 */
export const generateVideo = async (concept) => {
    if (!API_KEY) throw new Error("API Key missing");

    const prompt = `Create a short educational animation explaining: ${concept.title}. ${concept.description}. Use clear visuals, smooth transitions, and an educational tone suitable for students.`;

    console.log("Generating video for:", concept.title);

    // Call the Veo generateVideos endpoint through our Vite proxy
    const url = `${PROXY_BASE}/models/veo-2:generateVideos?key=${API_KEY}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "models/veo-2",
            generateVideoConfig: {
                aspectRatio: "16:9",
                numberOfVideos: 1,
                durationSeconds: 5,
                personGeneration: "dont_allow",
            },
            prompt: { text: prompt },
        })
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error("Veo API error:", res.status, errText);
        throw new Error(`Veo API error ${res.status}: ${errText}`);
    }

    const operationData = await res.json();
    console.log("Veo operation started:", operationData);

    // The response is a long-running operation — poll until done
    return await pollOperation(operationData);
};

/**
 * Poll a long-running operation until it completes, then extract the video.
 */
async function pollOperation(operationData) {
    // If we already have video data directly, extract it
    if (operationData.done) {
        return extractVideoUrl(operationData);
    }
    if (operationData.generatedVideos || operationData.response?.generatedVideos) {
        return extractVideoUrl(operationData);
    }

    const operationName = operationData.name;
    if (!operationName) {
        console.error("Unexpected response format:", operationData);
        throw new Error("No operation name returned from Veo API");
    }

    // Poll every 10 seconds, max 36 attempts (6 minutes)
    const MAX_POLLS = 36;
    const POLL_INTERVAL = 10000;

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise(r => setTimeout(r, POLL_INTERVAL));

        console.log(`Polling video generation (${i + 1}/${MAX_POLLS})...`);

        // Poll through proxy
        const pollUrl = `${PROXY_BASE}/${operationName}?key=${API_KEY}`;
        const pollRes = await fetch(pollUrl);

        if (!pollRes.ok) {
            console.warn(`Poll attempt ${i + 1} failed:`, pollRes.status);
            continue;
        }

        const pollData = await pollRes.json();

        if (pollData.done) {
            console.log("Video generation complete!");
            return extractVideoUrl(pollData);
        }

        if (pollData.metadata) {
            console.log(`Progress:`, pollData.metadata);
        }
    }

    throw new Error("Video generation timed out after 6 minutes");
}

/**
 * Extract a playable video URL from the Veo API response.
 */
function extractVideoUrl(data) {
    const generatedVideos =
        data?.response?.generatedVideos ||
        data?.generatedVideos ||
        data?.result?.generatedVideos;

    if (generatedVideos && generatedVideos.length > 0) {
        const video = generatedVideos[0];

        // Video as a downloadable URI
        if (video.video?.uri) {
            return video.video.uri;
        }
        // Video as base64 bytes
        if (video.video?.videoBytes || video.video?.bytesBase64Encoded) {
            const b64 = video.video.videoBytes || video.video.bytesBase64Encoded;
            const binary = atob(b64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "video/mp4" });
            return URL.createObjectURL(blob);
        }
    }

    if (data?.response?.video?.uri) return data.response.video.uri;

    console.error("Could not extract video from response:", data);
    throw new Error("No video found in Veo response");
}
