import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

export default function AccountConfigForm() {
	const { t } = useTranslation();
	const [values, setValues] = useState({
		overdraftLimit: '',
		initialBalance: '',
		taxRate: '',
		grossToNetRate: ''
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		setLoading(true);
		axios.get('/api/account-config', { withCredentials: true })
			.then(res => {
				if (res.data) setValues(res.data);
			})
			.catch(() => setError(t('fetch_error') || 'Erreur de chargement'))
			.finally(() => setLoading(false));
	}, [t]);

	const handleChange = e => {
		setValues(v => ({ ...v, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setSaving(true);
		setError('');
		setSuccess(false);
		try {
			await axios.post('/api/account-config', {
				overdraftLimit: Number(values.overdraftLimit),
				initialBalance: Number(values.initialBalance),
				taxRate: Number(values.taxRate),
				grossToNetRate: Number(values.grossToNetRate)
			}, { withCredentials: true });
			setSuccess(true);
			toast.success(t('save_success') || 'Sauvegarde réussie');
		} catch {
			setError(t('save_error') || 'Erreur lors de la sauvegarde');
			toast.error(t('save_error') || 'Erreur lors de la sauvegarde');
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, maxWidth: 320 }}>
			<label>
				{t('overdraft_limit')}
				<input name="overdraftLimit" type="number" value={values.overdraftLimit} onChange={handleChange} required min="0" step="0.01" />
			</label>
			<label>
				{t('initial_balance')}
				<input name="initialBalance" type="number" value={values.initialBalance} onChange={handleChange} required step="0.01" />
			</label>
			<label>
				{t('tax_rate')}
				<input name="taxRate" type="number" value={values.taxRate} onChange={handleChange} required min="0" max="1" step="0.01" />
				<span style={{ fontSize: 12, color: '#888' }}>{t('tax_rate_hint')}</span>
			</label>
			<label>
				{t('gross_to_net_rate')}
				<input name="grossToNetRate" type="number" value={values.grossToNetRate} onChange={handleChange} required min="0" max="1" step="0.01" />
				<span style={{ fontSize: 12, color: '#888' }}>{t('gross_to_net_rate_hint')}</span>
			</label>
			<button type="submit" disabled={saving}>{t('save')}</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			{success && <div style={{ color: 'green' }}>{t('save_success') || 'Sauvegarde réussie'}</div>}
		</form>
	);
} 