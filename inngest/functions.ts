import { inngest } from './client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI();

export const executeAiQuery = inngest.createFunction(
  { id: 'execute-ai-query' },
  { event: 'ai/execute-query' },
  async ({ event, step }) => {
    const steps = await step.ai.wrap('gemini-generate-text', generateText, {
      system: `You are a helpful assistant that can answer questions and help with tasks.`,
      model: google('gemini-2.5-flash'),
      prompt: `What is the capital of France?`,
    });
    const response = await steps.text;
    return { message: response };
  }
);
