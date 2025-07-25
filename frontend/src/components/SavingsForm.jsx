import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SavingsForm({ onSuccess }) {
	const { t } = useTranslation();
	const [month, setMonth] = useState('');
	const [amount, setAmount] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		setLoading(true);
		try {
			await axios.post('/api/savings', { month, amount: Number(amount) }, { withCredentials: true });
			setSuccess(true);
			setMonth('');
			setAmount('');
			toast.success(t('add_success') || 'Ajout réussi');
			if (onSuccess) onSuccess();
		} catch (err) {
			setError(t('add_error') || 'Erreur lors de l\'ajout');
			toast.error(t('add_error') || 'Erreur lors de l\'ajout');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
			<label>
				{t('month')}
				<input value={month} onChange={e => setMonth(e.target.value)} required placeholder="YYYY-MM" />
			</label>
			<label>
				{t('amount')}
				<input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" />
			</label>
			<button type="submit" disabled={loading}>{t('add')}</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			{success && <div style={{ color: 'green' }}>{t('add_success') || 'Ajout réussi'}</div>}
		</form>
	);
} 