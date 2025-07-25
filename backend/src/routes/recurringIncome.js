import express from 'express';
import RecurringIncome from '../models/RecurringIncome.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Liste des revenus récurrents de l'utilisateur
router.get('/', auth, async (req, res) => {
	const incomes = await RecurringIncome.find({ user: req.user.id });
	res.json(incomes);
});

// Créer un revenu récurrent
router.post('/',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	body('type').isIn(['fixed', 'gross']).withMessage('Type invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount, type } = req.body;
		const income = new RecurringIncome({ user: req.user.id, name, amount, type });
		await income.save();
		res.status(201).json(income);
	});

// Mettre à jour un revenu récurrent
router.put('/:id',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	body('type').isIn(['fixed', 'gross']).withMessage('Type invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount, type } = req.body;
		const income = await RecurringIncome.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ name, amount, type },
			{ new: true }
		);
		res.json(income);
	});

// Supprimer un revenu récurrent
router.delete('/:id', auth, async (req, res) => {
	await RecurringIncome.deleteOne({ _id: req.params.id, user: req.user.id });
	res.json({ message: 'Supprimé.' });
});

export default router; 