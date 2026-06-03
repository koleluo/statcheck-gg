import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import summonerRoutes from './routes/summoners';
import championRoutes from './routes/champions';
import matchRoutes from './routes/matches';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/summoners', summonerRoutes);
app.use('/api/champions', championRoutes);
app.use('/api/matches', matchRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`StatCheck API running on http://localhost:${PORT}`);
});

export default app;
