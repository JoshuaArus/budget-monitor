import express from 'express';
import DeferredDebit from '../models/DeferredDebit.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Liste des dépenses à débit différé de l'utilisateur
router.get('/', auth, async (req, res) => {
	const debits = await DeferredDebit.find({ user: req.user.id });
	res.json(debits);
});

// Créer une dépense à débit différé
router.post('/',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	body('inputMonth').isString().notEmpty().withMessage('Mois de saisie requis.'),
	body('debitMonth').isString().notEmpty().withMessage('Mois de prélèvement requis.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount, inputMonth, debitMonth } = req.body;
		const debit = new DeferredDebit({ user: req.user.id, name, amount, inputMonth, debitMonth });
		await debit.save();
		res.status(201).json(debit);
	});

// Mettre à jour une dépense à débit différé
router.put('/:id',
	body('name').isString().notEmpty().withMessage('Nom requis.'),
	body('amount').isNumeric().withMessage('Montant invalide.'),
	body('inputMonth').isString().notEmpty().withMessage('Mois de saisie requis.'),
	body('debitMonth').isString().notEmpty().withMessage('Mois de prélèvement requis.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, amount, inputMonth, debitMonth } = req.body;
		const debit = await DeferredDebit.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ name, amount, inputMonth, debitMonth },
			{ new: true }
		);
		res.json(debit);
	});

// Supprimer une dépense à débit différé
router.delete('/:id', auth, async (req, res) => {
	await DeferredDebit.deleteOne({ _id: req.params.id, user: req.user.id });
	res.json({ message: 'Supprimé.' });
});

export default router; 