import express from 'express';
import OneTimeIncome from '../models/OneTimeIncome.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Liste des versements ponctuels de l'utilisateur
router.get('/', auth, async (req, res) => {
	const incomes = await OneTimeIncome.find({ user: req.user.id });
	res.json(incomes);
});

// Créer un versement ponctuel
router.post('/',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	body('month').isString().notEmpty().withMessage('Mois requis.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount, month } = req.body;
		const income = new OneTimeIncome({ user: req.user.id, name, amount, month });
		await income.save();
		res.status(201).json(income);
	});

// Mettre à jour un versement ponctuel
router.put('/:id',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	body('month').isString().notEmpty().withMessage('Mois requis.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount, month } = req.body;
		const income = await OneTimeIncome.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ name, amount, month },
			{ new: true }
		);
		res.json(income);
	});

// Supprimer un versement ponctuel
router.delete('/:id', auth, async (req, res) => {
	await OneTimeIncome.deleteOne({ _id: req.params.id, user: req.user.id });
	res.json({ message: 'Supprimé.' });
});

export default router; 