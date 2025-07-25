import express from 'express';
import OneTimeDebit from '../models/OneTimeDebit.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Liste des prélèvements ponctuels de l'utilisateur
router.get('/', auth, async (req, res) => {
	const debits = await OneTimeDebit.find({ user: req.user.id });
	res.json(debits);
});

// Créer un prélèvement ponctuel
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
		const debit = new OneTimeDebit({ user: req.user.id, name, amount, month });
		await debit.save();
		res.status(201).json(debit);
	});

// Mettre à jour un prélèvement ponctuel
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
		const debit = await OneTimeDebit.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ name, amount, month },
			{ new: true }
		);
		res.json(debit);
	});

// Supprimer un prélèvement ponctuel
router.delete('/:id', auth, async (req, res) => {
	await OneTimeDebit.deleteOne({ _id: req.params.id, user: req.user.id });
	res.json({ message: 'Supprimé.' });
});

export default router; 