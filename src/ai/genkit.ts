
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || 'AIzaSyBrZulfd7h7dUu2nzXBM0QsCsVbGqnMUU4'
    })
  ],
});
