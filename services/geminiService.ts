
import { GoogleGenAI } from "@google/genai";

 const API_KEY =null;
//  process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

// const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateText = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "AI is not configured. Please provide an API key.";
  }
  
  try {
    // const response = await ai.models.generateContent({
    //     model: 'gemini-2.5-flash',
    //     contents: `Generate a short, engaging piece of text for an email based on the following prompt. Keep it concise and professional. Prompt: "${prompt}"`,
    // });
    // return response.text ?? "";
    return ""
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    return "Error generating text. Please try again.";
  }
};
