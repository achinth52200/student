
'use server'

import { z } from 'zod'
import { optimizeStudySchedule } from '@/ai/flows/optimize-study-schedule'
import { provideAiDrivenWellbeingSupport } from '@/ai/flows/ai-driven-wellbeing-support'
import { wellbeingChat } from '@/ai/flows/wellbeing-chat-flow'
import { extractTransactionsFromImage } from '@/ai/flows/extract-transaction-from-image-flow';
import { generatePersonalizedTips } from '@/ai/flows/generate-personalized-tips-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import type { Transaction, Reminder, ScheduleItem } from '@/lib/types';

const optimizeScheduleSchema = z.object({
  courseDeadlines: z.string().min(1, 'Please provide course deadlines.'),
  priorities: z.string().min(1, 'Please provide course priorities.'),
  mainTopic: z.string().min(1, 'Please provide a main topic.'),
  coreTopics: z.string().min(1, 'Please provide core topics.'),
  duration: z.string().min(1, 'Please provide a duration.'),
})

type OptimizeScheduleState = {
  message?: string
  schedule?: ScheduleItem[]
  errors?: {
    courseDeadlines?: string[]
    priorities?: string[]
    mainTopic?: string[]
    coreTopics?: string[]
    duration?: string[]
  }
}

export async function optimizeStudyScheduleAction(
  formData: FormData
): Promise<OptimizeScheduleState> {
  const validatedFields = optimizeScheduleSchema.safeParse({
    courseDeadlines: formData.get('courseDeadlines'),
    priorities: formData.get('priorities'),
    mainTopic: formData.get('mainTopic'),
    coreTopics: formData.get('coreTopics'),
    duration: formData.get('duration'),
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
  audioDataUri?: string
  errors?: {
    stressLevel?: string[]
    emotionalRegulation?: string[]
    physicalActivity?: string[]
    sleepQuality?: string[]
    studyHours?: string[]
  }
}

export async function provideWellbeingSupportAction(
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
    const feedbackResult = await provideAiDrivenWellbeingSupport(validatedFields.data);
    
    if (!feedbackResult.feedback) {
        return { message: 'Could not generate feedback at this time. Please try again.' }
    }
    
    const audioResult = await textToSpeech({ text: feedbackResult.feedback });
    
    return {
      message: 'Feedback generated successfully!',
      feedback: feedbackResult.feedback,
      audioDataUri: audioResult.audioDataUri,
    }
  } catch (error) {
    console.error(error);
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
    transactions?: Omit<Transaction, 'id' | 'date' | 'status'>[];
    error?: string;
}

export async function extractTransactionAction(
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

        const result = await extractTransactionsFromImage({ photoDataUri });
        
        if (result.transactions && result.transactions.length > 0) {
            return {
                transactions: result.transactions,
            };
        } else {
            return {
                error: 'Could not extract any transactions from the image. Please try another one.',
            }
        }
    } catch (error) {
        console.error(error);
        return {
            error: 'An unexpected error occurred while analyzing the receipt. Please try again.',
        };
    }
}


const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.string(),
  status: z.enum(['Completed', 'Pending', 'Failed']),
});

const ReminderSchema = z.object({
    id: z.string(),
    title: z.string(),
    dueDate: z.string(),
    completed: z.boolean(),
});

const generateTipsSchema = z.object({
  transactions: z.array(TransactionSchema),
  reminders: z.array(ReminderSchema),
});


type Tip = {
    icon: "PiggyBank" | "GraduationCap" | "HeartPulse" | "Lightbulb";
    text: string;
}

type GenerateTipsState = {
  tips?: Tip[];
  error?: string;
};

export async function generatePersonalizedTipsAction(
  transactions: Transaction[],
  reminders: Reminder[]
): Promise<GenerateTipsState> {
  // Convert dates to string representations
  const safeTransactions = transactions.map(t => ({...t, date: new Date(t.date).toISOString()}));
  const safeReminders = reminders.map(r => ({...r, dueDate: new Date(r.dueDate).toISOString()}));

  try {
    const result = await generatePersonalizedTips({ transactions: safeTransactions, reminders: safeReminders });
    return { tips: result.tips };
  } catch (error) {
    console.error("Error generating tips:", error);
    return {
      error: 'Failed to generate personalized tips. Please try again later.',
    };
  }
}
