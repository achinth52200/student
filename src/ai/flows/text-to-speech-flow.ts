
'use server';
/**
 * @fileOverview Text-to-speech placeholder.
 * Claude does not support TTS, so this gracefully throws an error.
 * The caller (wellbeing support action) already handles TTS failures gracefully.
 */

export type TextToSpeechInput = {
  text: string;
};

export type TextToSpeechOutput = {
  audioDataUri: string;
};

export async function textToSpeech(_input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  // TTS is not available with Claude API.
  // The wellbeing support action wraps TTS in a try-catch, so this will be handled gracefully.
  throw new Error('Text-to-speech is not available with the current AI provider.');
}
