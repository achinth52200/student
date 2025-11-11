
'use server';

/**
 * @fileOverview AI-powered study schedule optimizer.
 *
 * - optimizeStudySchedule - A function that generates an optimized study schedule.
 * - OptimizeStudyScheduleInput - The input type for the optimizeStudySchedule function.
 * - OptimizeStudyScheduleOutput - The return type for the optimizeStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeStudyScheduleInputSchema = z.object({
  courseDeadlines: z
    .string()
    .describe(
      'A list of course deadlines, each including the course name, assignment, and due date (e.g., `Course: Math 101, Assignment: Final Exam, Due Date: 2024-05-15`).' + 
      'List each course deadline on a newline.'
    ),
  priorities: z
    .string()
    .describe(
      'A list of course priorities, each including the course name and its priority (e.g., `Course: Math 101, Priority: High`).' + 
      'List each course priority on a newline.'
    ),
    mainTopic: z.string().describe('The main topic or subject for the study session.'),
    coreTopics: z.string().describe('A comma-separated list of core topics to focus on.'),
    duration: z.string().describe('The total duration for the study session (e.g., "3 hours").')
});
export type OptimizeStudyScheduleInput = z.infer<typeof OptimizeStudyScheduleInputSchema>;


const ScheduleItemSchema = z.object({
  course: z.string().describe('The name of the course.'),
  task: z.string().describe('The specific task or assignment to work on.'),
  mainTopic: z.string().describe('The main topic for this study block.'),
  coreTopics: z.string().describe('The specific core topics to cover.'),
  duration: z.string().describe('The allocated time for this study block (e.g., "45 minutes").'),
  suggestedTime: z.string().describe('The suggested day and time to study (e.g., "Monday, 4:00 PM - 5:00 PM").')
});

const OptimizeStudyScheduleOutputSchema = z.object({
  optimizedSchedule: z.array(ScheduleItemSchema).describe('The optimized study schedule as a list of tasks.'),
});
export type OptimizeStudyScheduleOutput = z.infer<typeof OptimizeStudyScheduleOutputSchema>;

export async function optimizeStudySchedule(input: OptimizeStudyScheduleInput): Promise<OptimizeStudyScheduleOutput> {
  return optimizeStudyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeStudySchedulePrompt',
  input: { schema: OptimizeStudyScheduleInputSchema },
  output: { schema: OptimizeStudyScheduleOutputSchema },
  prompt: `You are an AI assistant designed to optimize study schedules for students into a structured timetable format.

  Based on the provided course deadlines, priorities, topics, and desired duration, generate an optimized study schedule.

  Course Deadlines:
  {{courseDeadlines}}

  Priorities:
  {{priorities}}
  
  Main Topic: {{mainTopic}}
  Core Topics: {{coreTopics}}
  Total Duration: {{duration}}

  Generate a structured timetable. Each entry in the timetable should be an object with the following fields:
  - course: The course name.
  - task: The specific assignment or study goal.
  - mainTopic: The main topic for that specific study block.
  - coreTopics: The specific sub-topics to cover.
  - duration: How long to spend on this block.
  - suggestedTime: A specific day and time slot for the study block.
  
  Break down the total duration into logical study blocks, allocating time based on priorities.
  Be concise, clear and easy to follow. The output must be an array of schedule items.
  `,
});

const optimizeStudyScheduleFlow = ai.defineFlow(
  {
    name: 'optimizeStudyScheduleFlow',
    inputSchema: OptimizeStudyScheduleInputSchema,
    outputSchema: OptimizeStudyScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
