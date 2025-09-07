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
});
export type OptimizeStudyScheduleInput = z.infer<typeof OptimizeStudyScheduleInputSchema>;

const OptimizeStudyScheduleOutputSchema = z.object({
  optimizedSchedule: z
    .string()
    .describe('The optimized study schedule, including the course, task, and suggested study time.'),
});
export type OptimizeStudyScheduleOutput = z.infer<typeof OptimizeStudyScheduleOutputSchema>;

export async function optimizeStudySchedule(input: OptimizeStudyScheduleInput): Promise<OptimizeStudyScheduleOutput> {
  return optimizeStudyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeStudySchedulePrompt',
  input: {schema: OptimizeStudyScheduleInputSchema},
  output: {schema: OptimizeStudyScheduleOutputSchema},
  prompt: `You are an AI assistant designed to optimize study schedules for students.

  Based on the provided course deadlines and priorities, generate an optimized study schedule.

  Course Deadlines:
  {{courseDeadlines}}

  Priorities:
  {{priorities}}

  Output the schedule in a clear, easy-to-follow format, including the course, task, and suggested study time.
  Consider the deadlines and priorities when creating the schedule, and allocate study time accordingly.
  Be concise, clear and easy to follow.
  Do not assume any implicit deadlines or priorities, only use the provided data.
  Focus on suggesting when to study which subject, and do not provide additional motivational or time management advice.
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
