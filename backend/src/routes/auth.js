import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Inscription
router.post('/register',
	body('email').isEmail().withMessage('Email invalide.'),
	body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({ error: 'Email et mot de passe requis.' });
			}
			const existing = await User.findOne({ email });
			if (existing) {
				return res.status(409).json({ error: 'Email déjà utilisé.' });
			}
			const user = new User({ email, password });
			await user.save();
			res.status(201).json({ message: 'Utilisateur créé.' });
		} catch (err) {
			res.status(500).json({ error: 'Erreur serveur.' });
		}
	});

// Connexion
router.post('/login',
	body('email').isEmail().withMessage('Email invalide.'),
	body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({ error: 'Email et mot de passe requis.' });
			}
			const user = await User.findOne({ email });
			if (!user) {
				return res.status(401).json({ error: 'Identifiants invalides.' });
			}
			const valid = await user.comparePassword(password);
			if (!valid) {
				return res.status(401).json({ error: 'Identifiants invalides.' });
			}
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
			// Envoi du token en httpOnly cookie
			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60 * 1000
			});
			res.json({ message: 'Connexion réussie.' });
		} catch (err) {
			res.status(500).json({ error: 'Erreur serveur.' });
		}
	});

// Déconnexion
router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'Déconnexion réussie.' });
});

export default router; 