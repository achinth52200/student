
'use server';
/**
 * @fileOverview AI-powered study schedule optimizer using Groq.
 */

import { client } from '@/ai/claude';

export type OptimizeStudyScheduleInput = {
  courseDeadlines: string;
  priorities: string;
  mainTopic: string;
  coreTopics: string;
  duration: string;
};

export type ScheduleItem = {
  course: string;
  task: string;
  mainTopic: string;
  coreTopics: string;
  duration: string;
  suggestedTime: string;
};

export type OptimizeStudyScheduleOutput = {
  optimizedSchedule: ScheduleItem[];
};

export async function optimizeStudySchedule(input: OptimizeStudyScheduleInput): Promise<OptimizeStudyScheduleOutput> {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are an AI study schedule optimizer. Always respond with valid JSON in this format: {"optimizedSchedule": [{"course": "...", "task": "...", "mainTopic": "...", "coreTopics": "...", "duration": "...", "suggestedTime": "..."}]}',
      },
      {
        role: 'user',
        content: `Create an optimized study schedule based on:

Course Deadlines:
${input.courseDeadlines}

Priorities:
${input.priorities}

Main Topic: ${input.mainTopic}
Core Topics: ${input.coreTopics}
Total Duration: ${input.duration}

Break down into logical study blocks with specific time slots. Allocate more time to higher priority items.`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('AI failed to generate schedule');
  }

  try {
    const parsed = JSON.parse(text);
    return { optimizedSchedule: parsed.optimizedSchedule || [] };
  } catch {
    throw new Error('Failed to parse AI schedule response');
  }
}
