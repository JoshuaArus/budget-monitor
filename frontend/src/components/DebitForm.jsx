import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function DebitForm({ onSuccess }) {
	const { t } = useTranslation();
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [type, setType] = useState('recurring');
	const [month, setMonth] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		setLoading(true);
		try {
			if (type === 'recurring') {
				await axios.post('/api/recurring-debits', { name, amount: Number(amount) }, { withCredentials: true });
			} else {
				await axios.post('/api/one-time-debits', { name, amount: Number(amount), month }, { withCredentials: true });
			}
			setSuccess(true);
			setName('');
			setAmount('');
			setMonth('');
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
			<label htmlFor="debit-name">{t('name')}</label>
			<input id="debit-name" value={name} onChange={e => setName(e.target.value)} required />
			<label htmlFor="debit-amount">{t('amount')}</label>
			<input id="debit-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" />
			<label htmlFor="debit-type">{t('type')}</label>
			<select id="debit-type" value={type} onChange={e => setType(e.target.value)}>
				<option value="recurring">{t('recurring')}</option>
				<option value="one-time">{t('one_time')}</option>
			</select>
			{type === 'one-time' && (
				<>
					<label htmlFor="debit-month">{t('month')}</label>
					<input id="debit-month" value={month} onChange={e => setMonth(e.target.value)} required placeholder="YYYY-MM" />
				</>
			)}
			<button type="submit" disabled={loading}>{t('add')}</button>
			<div aria-live="polite" style={{ minHeight: 24 }}>
				{error && <span style={{ color: 'red' }}>{error}</span>}
				{success && <span style={{ color: 'green' }}>{t('add_success') || 'Ajout réussi'}</span>}
			</div>
		</form>
	);
} 