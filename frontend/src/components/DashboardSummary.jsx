import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function DashboardSummary() {
	const { t } = useTranslation();
	const [summary, setSummary] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		setLoading(true);
		axios.get('/api/summary', { withCredentials: true })
			.then(res => setSummary(res.data))
			.catch(() => setError(t('fetch_error') || 'Erreur de chargement'))
			.finally(() => setLoading(false));
	}, [t]);

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;
	if (error) return <div style={{ color: 'red' }}>{error}</div>;
	if (!summary.length) return <div>{t('no_data') || 'Aucune donnée'}</div>;

	const current = summary[0];

	return (
		<div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
			<div><b>{t('month')}:</b> {current.month}</div>
			<div><b>{t('income')}:</b> {current.income} €</div>
			<div><b>{t('debit')}:</b> {current.debit} €</div>
			<div><b>{t('saving')}:</b> {current.saving !== null ? current.saving + ' €' : '-'}</div>
			<div><b>{t('forecast_balance')}:</b> {current.forecastBalance} €</div>
			<div><b>{t('provisionnal_balance')}:</b> {current.provisionnalBalance} €</div>
		</div>
	);
} 