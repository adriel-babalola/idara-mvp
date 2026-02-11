import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Note: In a real app, you might want to proxy this or use a more secure way if possible, 
// but for MVP client-side with key is acceptable as per instructions.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

export const initializeGemini = () => {
    if (!API_KEY) {
        console.error("VITE_GEMINI_API_KEY is not set");
        throw new Error("API Key missing");
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const generateNotes = async (prompt) => {
    if (!model) initializeGemini();

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
