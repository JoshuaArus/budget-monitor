import express from 'express';
import AccountConfig from '../models/AccountConfig.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Obtenir la config de l'utilisateur
router.get('/', auth, async (req, res) => {
	const config = await AccountConfig.findOne({ user: req.user.id });
	res.json(config);
});

// Créer ou mettre à jour la config
router.post('/',
	body('overdraftLimit').isNumeric().withMessage('Découvert autorisé invalide.'),
	body('initialBalance').isNumeric().withMessage('Solde initial invalide.'),
	body('taxRate').isNumeric().withMessage('Taux d\'imposition invalide.'),
	body('grossToNetRate').isNumeric().withMessage('Taux brut/net invalide.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { overdraftLimit, initialBalance, taxRate, grossToNetRate } = req.body;
		let config = await AccountConfig.findOne({ user: req.user.id });
		if (config) {
			config.overdraftLimit = overdraftLimit;
			config.initialBalance = initialBalance;
			config.taxRate = taxRate;
			config.grossToNetRate = grossToNetRate;
			await config.save();
			return res.json(config);
		}
		config = new AccountConfig({
			user: req.user.id,
			overdraftLimit,
			initialBalance,
			taxRate,
			grossToNetRate
		});
		await config.save();
		res.status(201).json(config);
	});

// Supprimer la config
router.delete('/', auth, async (req, res) => {
	await AccountConfig.deleteOne({ user: req.user.id });
	res.json({ message: 'Config supprimée.' });
});

export default router; 