'use server'

import { z } from 'zod'
import { optimizeStudySchedule } from '@/ai/flows/optimize-study-schedule'
import { provideAiDrivenWellbeingSupport } from '@/ai/flows/ai-driven-wellbeing-support'
import { wellbeingChat } from '@/ai/flows/wellbeing-chat-flow'
import { extractTransactionFromImage } from '@/ai/flows/extract-transaction-from-image-flow';
import type { Transaction } from '@/lib/types';

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

const extractTransactionSchema = z.object({
  receipt: z.instanceof(File),
});

type ExtractTransactionState = {
    transaction?: Omit<Transaction, 'id' | 'date' | 'status'>;
    error?: string;
}

export async function extractTransactionAction(
    prevState: ExtractTransactionState,
    formData: FormData
): Promise<ExtractTransactionState> {
    const validatedFields = extractTransactionSchema.safeParse({
        receipt: formData.get('receipt'),
    });

    if (!validatedFields.success) {
        return {
            error: 'Validation failed. Please provide a valid image file.',
        };
    }
    
    const file = validatedFields.data.receipt;
    if (file.size === 0) {
        return {
            error: 'Please upload a non-empty file.'
        }
    }

    try {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const photoDataUri = `data:${file.type};base64,${base64}`;

        const result = await extractTransactionFromImage({ photoDataUri });
        if (result.transaction) {
            return {
                transaction: result.transaction,
            };
        } else {
            return {
                error: 'Could not extract transaction from the image. Please try another one.',
            }
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'An unexpected error occurred while analyzing the receipt. Please try again.',
        };
    }
}
