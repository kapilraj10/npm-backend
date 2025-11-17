import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import buildCors from './middleware/cors.js';
import morgan from 'morgan';
import matchesRouter from './routes/matches.js';
import authRouter from './routes/auth.js';

const app = express();

// CORS
app.use(buildCors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/matches', matchesRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/npl';

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
