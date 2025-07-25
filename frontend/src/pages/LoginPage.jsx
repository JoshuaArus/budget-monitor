import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
	const { t } = useTranslation();
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await login(email, password);
			navigate('/dashboard');
		} catch (err) {
			setError(t('login_error') || 'Erreur de connexion');
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
			<button type="submit">{t('login')}</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
		</form>
	);
} 