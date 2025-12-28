import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

function getOpenAIClient(): OpenAI {
  const LLM_PROVIDER = process.env.LLM_PROVIDER || 'groq';
  const API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

  if (!API_KEY) {
    throw new Error('No API key found. Please set GROQ_API_KEY or OPENAI_API_KEY in your .env file.');
  }

  if (LLM_PROVIDER === 'groq') {
    return new OpenAI({
      apiKey: API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  } else {
    return new OpenAI({
      apiKey: API_KEY,
    });
  }
}

const SYSTEM_PROMPT = `You are a helpful and friendly customer support agent for a small e-commerce store called "Spur Store". 

Here's important information about the store:

SHIPPING POLICY:
- We ship worldwide
- Standard shipping: 5-7 business days ($5.99)
- Express shipping: 2-3 business days ($12.99)
- Free shipping on orders over $50
- Tracking information is provided for all orders

RETURN/REFUND POLICY:
- 30-day return policy from date of delivery
- Items must be unused and in original packaging
- Refunds are processed within 5-7 business days
- Return shipping is free for defective items
- Store credit available for items returned after 30 days

SUPPORT HOURS:
- Monday to Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed
- Email: support@spurstore.com

Answer customer questions clearly, concisely, and in a friendly tone. If you don't know something specific, acknowledge it and offer to help them find the information.`;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateReply(
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  try {
    dotenv.config();
    const openai = getOpenAIClient();
    const LLM_PROVIDER = process.env.LLM_PROVIDER || 'groq';

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    const model = LLM_PROVIDER === 'groq' 
      ? (process.env.GROQ_MODEL || 'llama-3.1-8b-instant')
      : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content;
    if (!reply) {
      throw new Error('No reply generated from LLM');
    }

    return reply.trim();
  } catch (error: any) {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        const LLM_PROVIDER = process.env.LLM_PROVIDER || 'groq';
        const keyName = LLM_PROVIDER === 'groq' ? 'GROQ_API_KEY' : 'OPENAI_API_KEY';
        throw new Error(`Invalid API key. Please check your ${keyName} environment variable.`);
      }
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (error.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again shortly.');
      }
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error(`Failed to generate reply: ${error.message || 'Unknown error'}`);
  }
}

