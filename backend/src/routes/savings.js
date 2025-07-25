import express from 'express';
import Savings from '../models/Savings.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Liste des épargnes mensuelles de l'utilisateur
router.get('/', auth, async (req, res) => {
	const savings = await Savings.find({ user: req.user.id });
	res.json(savings);
});

// Créer une saisie d'épargne
router.post('/',
	body('month').isString().notEmpty().withMessage('Mois requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { month, amount } = req.body;
		let saving = await Savings.findOne({ user: req.user.id, month });
		if (saving) {
			saving.amount = amount;
			await saving.save();
			return res.json(saving);
		}
		saving = new Savings({ user: req.user.id, month, amount });
		await saving.save();
		res.status(201).json(saving);
	});

// Mettre à jour une saisie d'épargne
router.put('/:id',
	body('month').isString().notEmpty().withMessage('Mois requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { month, amount } = req.body;
		const saving = await Savings.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ month, amount },
			{ new: true }
		);
		res.json(saving);
	});

// Supprimer une saisie d'épargne
router.delete('/:id', auth, async (req, res) => {
	await Savings.deleteOne({ _id: req.params.id, user: req.user.id });
	res.json({ message: 'Supprimé.' });
});

export default router; 