import { GoogleGenAI } from "@google/genai";

export const apiKey = process.env.API_KEY || '';

// Initialize the Google GenAI Client
export const ai = new GoogleGenAI({ apiKey });
