import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
	const { t } = useTranslation();
	const { register } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		try {
			await register(email, password);
			setSuccess(true);
			navigate('/dashboard');
		} catch (err) {
			setError(t('register_error') || 'Erreur d\'inscription');
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
			<label>
				{t('email')}
				<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
			</label>
			<label>
				{t('password')}
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
			</label>
			<button type="submit">{t('register')}</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			{success && <div style={{ color: 'green' }}>{t('register_success') || 'Inscription réussie'}</div>}
		</form>
	);
} 