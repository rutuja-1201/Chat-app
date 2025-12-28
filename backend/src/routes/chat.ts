import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { processMessage, getConversationHistory } from '../services/chatService.js';
import { validateMessageLength } from '../middleware/validateInput.js';

export const chatRouter = Router();

const messageSchema = z.object({
  message: z.string().min(1).max(5000),
  sessionId: z.string().uuid().optional().nullable(),
});

chatRouter.post('/message', validateMessageLength, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId } = messageSchema.parse(req.body);
    const result = await processMessage(message, sessionId || undefined);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

chatRouter.get('/history/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const history = await getConversationHistory(sessionId);
    res.json({ messages: history });
  } catch (error) {
    next(error);
  }
});

