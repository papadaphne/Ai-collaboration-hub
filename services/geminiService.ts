import { GoogleGenAI } from "@google/genai";
import { API_KEYS } from "../aiConfig";

const ai = new GoogleGenAI({ apiKey: API_KEYS.GOOGLE });

/**
 * Generates content using the Gemini model.
 * @param prompt The prompt to send to the model.
 * @returns The generated text content.
 */
export const generateWithGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    const text = response.text;
    if (!text) {
        throw new Error("Received an empty response from Gemini.");
    }
    return text;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error(`Error calling Gemini:`, errorMessage, error);
    throw new Error(`Failed to get response from Gemini: ${errorMessage}`);
  }
};