import express from 'express';
import auth from '../middleware/auth.js';
import AccountConfig from '../models/AccountConfig.js';
import RecurringDebit from '../models/RecurringDebit.js';
import OneTimeDebit from '../models/OneTimeDebit.js';
import RecurringIncome from '../models/RecurringIncome.js';
import OneTimeIncome from '../models/OneTimeIncome.js';
import DeferredDebit from '../models/DeferredDebit.js';
import Savings from '../models/Savings.js';

const router = express.Router();

// Synthèse prévisionnelle sur 12 mois glissants
router.get('/', auth, async (req, res) => {
	const userId = req.user.id;
	const config = await AccountConfig.findOne({ user: userId });
	if (!config) return res.status(400).json({ error: 'Config manquante.' });

	// Récupérer tous les mouvements
	const [recDebits, oneDebits, recIncomes, oneIncomes, defDebits, savings] = await Promise.all([
		RecurringDebit.find({ user: userId }),
		OneTimeDebit.find({ user: userId }),
		RecurringIncome.find({ user: userId }),
		OneTimeIncome.find({ user: userId }),
		DeferredDebit.find({ user: userId }),
		Savings.find({ user: userId })
	]);

	// Générer la liste des 12 mois glissants (YYYY-MM)
	const months = [];
	const now = new Date();
	for (let i = 0; i < 12; i++) {
		const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
		months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
	}

	// Calculs par mois
	const summary = months.map(month => {
		// Incomes
		let income = 0;
		recIncomes.forEach(inc => {
			if (inc.type === 'fixed') income += inc.amount;
			else income += inc.amount * (1 - config.taxRate) * config.grossToNetRate;
		});
		oneIncomes.filter(inc => inc.month === month).forEach(inc => { income += inc.amount; });
		// Debits
		let debit = 0;
		recDebits.forEach(d => { debit += d.amount; });
		oneDebits.filter(d => d.month === month).forEach(d => { debit += d.amount; });
		defDebits.filter(d => d.debitMonth === month).forEach(d => { debit += d.amount; });
		// Solde épargne
		const saving = savings.find(s => s.month === month)?.amount || null;
		return { month, income, debit, saving };
	});

	// Calcul du solde glissant
	let balance = config.initialBalance;
	const overdraft = config.overdraftLimit;
	const result = summary.map(({ month, income, debit, saving }) => {
		balance += income - debit;
		return {
			month,
			income,
			debit,
			saving,
			forecastBalance: balance,
			provisionnalBalance: balance + overdraft
		};
	});

	res.json(result);
});

export default router; 