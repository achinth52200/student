'use server'

import { z } from 'zod'
import { optimizeStudySchedule } from '@/ai/flows/optimize-study-schedule'
import { provideAiDrivenWellbeingSupport } from '@/ai/flows/ai-driven-wellbeing-support'
import { wellbeingChat } from '@/ai/flows/wellbeing-chat-flow'

const optimizeScheduleSchema = z.object({
  courseDeadlines: z.string().min(1, 'Please provide course deadlines.'),
  priorities: z.string().min(1, 'Please provide course priorities.'),
})

type OptimizeScheduleState = {
  message?: string
  schedule?: string
  errors?: {
    courseDeadlines?: string[]
    priorities?: string[]
  }
}

export async function optimizeStudyScheduleAction(
  prevState: OptimizeScheduleState,
  formData: FormData
): Promise<OptimizeScheduleState> {
  const validatedFields = optimizeScheduleSchema.safeParse({
    courseDeadlines: formData.get('courseDeadlines'),
    priorities: formData.get('priorities'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
    }
  }

  try {
    const result = await optimizeStudySchedule(validatedFields.data)
    return {
      message: 'Schedule optimized successfully!',
      schedule: result.optimizedSchedule,
    }
  } catch (error) {
    return {
      message: 'An error occurred while optimizing the schedule. Please try again.',
    }
  }
}

const wellbeingSupportSchema = z.object({
  stressLevel: z.coerce.number().min(1).max(10),
  emotionalRegulation: z.string().min(1, 'Please describe your emotional state.'),
  physicalActivity: z.string().min(1, 'Please describe your physical activity.'),
  sleepQuality: z.string().min(1, 'Please describe your sleep quality.'),
  studyHours: z.coerce.number().min(0),
})

type WellbeingSupportState = {
  message?: string
  feedback?: string
  errors?: {
    stressLevel?: string[]
    emotionalRegulation?: string[]
    physicalActivity?: string[]
    sleepQuality?: string[]
    studyHours?: string[]
  }
}

export async function provideWellbeingSupportAction(
  prevState: WellbeingSupportState,
  formData: FormData
): Promise<WellbeingSupportState> {
  const validatedFields = wellbeingSupportSchema.safeParse({
    stressLevel: formData.get('stressLevel'),
    emotionalRegulation: formData.get('emotionalRegulation'),
    physicalActivity: formData.get('physicalActivity'),
    sleepQuality: formData.get('sleepQuality'),
    studyHours: formData.get('studyHours'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
    }
  }

  try {
    const result = await provideAiDrivenWellbeingSupport(validatedFields.data)
    return {
      message: 'Feedback generated successfully!',
      feedback: result.feedback,
    }
  } catch (error) {
    return {
      message: 'An error occurred while generating feedback. Please try again.',
    }
  }
}

const wellbeingChatSchema = z.object({
  history: z.string(), // JSON string of message history
  message: z.string().min(1, 'Please enter a message.'),
});

type WellbeingChatState = {
  response?: string;
  error?: string;
};

export async function wellbeingChatAction(
  prevState: WellbeingChatState,
  formData: FormData
): Promise<WellbeingChatState> {
  const validatedFields = wellbeingChatSchema.safeParse({
    history: formData.get('history'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Validation failed. Please check your input.',
    };
  }
  
  try {
    const history = JSON.parse(validatedFields.data.history);
    const result = await wellbeingChat({
      history,
      message: validatedFields.data.message,
    });
    return {
      response: result.response,
    };
  } catch (error) {
    return {
      error: 'An error occurred while getting a response. Please try again.',
    };
  }
}
