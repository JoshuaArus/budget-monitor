import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import accountConfigRoutes from './routes/accountConfig.js';
import recurringDebitRoutes from './routes/recurringDebit.js';
import oneTimeDebitRoutes from './routes/oneTimeDebit.js';
import recurringIncomeRoutes from './routes/recurringIncome.js';
import oneTimeIncomeRoutes from './routes/oneTimeIncome.js';
import deferredDebitRoutes from './routes/deferredDebit.js';
import savingsRoutes from './routes/savings.js';
import summaryRoutes from './routes/summary.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Sécurité HTTP
app.use(helmet());

// CORS strict
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true
}));

// Parsing JSON
app.use(express.json());
app.use(cookieParser());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('MongoDB connecté');
	})
	.catch((err) => {
		console.error('Erreur MongoDB:', err);
	});

// Route de test
app.get('/api/ping', (req, res) => {
	res.json({ message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/account-config', accountConfigRoutes);
app.use('/api/recurring-debits', recurringDebitRoutes);
app.use('/api/one-time-debits', oneTimeDebitRoutes);
app.use('/api/recurring-incomes', recurringIncomeRoutes);
app.use('/api/one-time-incomes', oneTimeIncomeRoutes);
app.use('/api/deferred-debits', deferredDebitRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/summary', summaryRoutes);

app.listen(PORT, () => {
	console.log(`Serveur backend démarré sur le port ${PORT}`);
});

process.on('uncaughtException', err => { console.error('Uncaught:', err); });
process.on('unhandledRejection', err => { console.error('Unhandled:', err); }); 