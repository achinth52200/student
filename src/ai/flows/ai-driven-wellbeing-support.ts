
'use server';
/**
 * @fileOverview An AI-driven well-being support agent using Groq.
 */

import { client } from '@/ai/claude';

export type AiDrivenWellbeingSupportInput = {
  stressLevel: number;
  emotionalRegulation: string;
  physicalActivity: string;
  sleepQuality: string;
  studyHours: number;
};

export type AiDrivenWellbeingSupportOutput = {
  feedback: string;
};

export async function provideAiDrivenWellbeingSupport(input: AiDrivenWellbeingSupportInput): Promise<AiDrivenWellbeingSupportOutput> {
  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 256,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant designed to provide personalized feedback and support to students for maintaining their mental and physical well-being. Always respond with valid JSON in this format: {"feedback": "your feedback here"}',
      },
      {
        role: 'user',
        content: `Based on the following information, provide specific and actionable feedback. Keep it concise (2-3 sentences), tailored to the student, and encouraging.

Stress Level (1-10): ${input.stressLevel}
Emotional State: ${input.emotionalRegulation}
Physical Activity: ${input.physicalActivity}
Sleep Quality: ${input.sleepQuality}
Study Hours: ${input.studyHours}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('AI failed to generate feedback');
  }

  try {
    const parsed = JSON.parse(text);
    return { feedback: parsed.feedback };
  } catch {
    return { feedback: text };
  }
}
