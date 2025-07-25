import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function IncomeForm({ onSuccess }) {
	const { t } = useTranslation();
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [type, setType] = useState('recurring');
	const [incomeType, setIncomeType] = useState('fixed');
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
				await axios.post('/api/recurring-incomes', { name, amount: Number(amount), type: incomeType }, { withCredentials: true });
			} else {
				await axios.post('/api/one-time-incomes', { name, amount: Number(amount), month }, { withCredentials: true });
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
			<label>
				{t('name')}
				<input value={name} onChange={e => setName(e.target.value)} required />
			</label>
			<label>
				{t('amount')}
				<input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" />
			</label>
			<label>
				{t('type')}
				<select value={type} onChange={e => setType(e.target.value)}>
					<option value="recurring">{t('recurring')}</option>
					<option value="one-time">{t('one_time')}</option>
				</select>
			</label>
			{type === 'recurring' && (
				<label>
					{t('income_type')}
					<select value={incomeType} onChange={e => setIncomeType(e.target.value)}>
						<option value="fixed">{t('fixed')}</option>
						<option value="gross">{t('gross')}</option>
					</select>
				</label>
			)}
			{type === 'one-time' && (
				<label>
					{t('month')}
					<input value={month} onChange={e => setMonth(e.target.value)} required placeholder="YYYY-MM" />
				</label>
			)}
			<button type="submit" disabled={loading}>{t('add')}</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			{success && <div style={{ color: 'green' }}>{t('add_success') || 'Ajout réussi'}</div>}
		</form>
	);
} 