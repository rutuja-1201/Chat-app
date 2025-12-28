import { db } from '../db/connection.js';
import { generateReply } from './llmService.js';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: Date;
}

export async function createConversation(): Promise<string> {
  const result = await db.query(
    'INSERT INTO conversations DEFAULT VALUES RETURNING id'
  );
  return result.rows[0].id;
}

export async function getOrCreateConversation(sessionId?: string): Promise<string> {
  if (sessionId) {
    const result = await db.query('SELECT id FROM conversations WHERE id = $1', [sessionId]);
    if (result.rows.length > 0) {
      return sessionId;
    }
  }
  return createConversation();
}

export async function saveMessage(
  conversationId: string,
  sender: 'user' | 'ai',
  text: string
): Promise<ChatMessage> {
  const result = await db.query(
    `INSERT INTO messages (conversation_id, sender, text)
     VALUES ($1, $2, $3)
     RETURNING id, conversation_id, sender, text, created_at`,
    [conversationId, sender, text]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender,
    text: row.text,
    createdAt: row.created_at,
  };
}

export async function getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
  const result = await db.query(
    `SELECT id, conversation_id, sender, text, created_at
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender,
    text: row.text,
    createdAt: row.created_at,
  }));
}

export async function processMessage(
  message: string,
  sessionId?: string
): Promise<{ reply: string; sessionId: string }> {
  const conversationId = await getOrCreateConversation(sessionId);

  await saveMessage(conversationId, 'user', message);

  const history = await getConversationHistory(conversationId);
  const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = history.map((msg) => ({
    role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: msg.text,
  }));

  const reply = await generateReply(conversationHistory, message);
  await saveMessage(conversationId, 'ai', reply);

  return { reply, sessionId: conversationId };
}

