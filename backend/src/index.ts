import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chatRouter } from './routes/chat.js';
import { errorHandler } from './middleware/errorHandler.js';
import { db, initDb } from './db/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (req: Request, res: Response) => {
  try {
    await initDb();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.post('/migrate', async (req: Request, res: Response) => {
  try {
    await initDb();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schema = readFileSync(join(__dirname, 'db', 'schema.sql'), 'utf-8');
    await db.query(schema);
    res.json({ status: 'success', message: 'Migration completed successfully' });
  } catch (error: any) {
    console.error('Migration failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Migration failed' });
  }
});

app.use('/chat', chatRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

