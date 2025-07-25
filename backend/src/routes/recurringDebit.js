import express from 'express';
import RecurringDebit from '../models/RecurringDebit.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Liste des prélèvements récurrents de l'utilisateur
router.get('/', auth, async (req, res) => {
	const debits = await RecurringDebit.find({ user: req.user.id });
	res.json(debits);
});

// Créer un prélèvement récurrent
router.post('/',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount } = req.body;
		const debit = new RecurringDebit({ user: req.user.id, name, amount, checkedMonths: [] });
		await debit.save();
		res.status(201).json(debit);
	});

// Mettre à jour un prélèvement (nom, montant)
router.put('/:id',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount } = req.body;
		const debit = await RecurringDebit.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ name, amount },
			{ new: true }
		);
		res.json(debit);
	});

// Mettre à jour le statut coché d'un mois
router.put('/:id/check', auth, async (req, res) => {
	const { month, checked } = req.body; // month: 'YYYY-MM', checked: bool
	const debit = await RecurringDebit.findOne({ _id: req.params.id, user: req.user.id });
	if (!debit) return res.status(404).json({ error: 'Not found' });
	const idx = debit.checkedMonths.findIndex(m => m.month === month);
	if (idx >= 0) {
		debit.checkedMonths[idx].checked = checked;
	} else {
		debit.checkedMonths.push({ month, checked });
	}
	await debit.save();
	res.json(debit);
});

// Supprimer un prélèvement
router.delete('/:id', auth, async (req, res) => {
	await RecurringDebit.deleteOne({ _id: req.params.id, user: req.user.id });
	res.json({ message: 'Supprimé.' });
});

export default router; 