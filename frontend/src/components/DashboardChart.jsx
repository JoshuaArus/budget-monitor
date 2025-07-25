import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardChart() {
	const { t } = useTranslation();
	const [summary, setSummary] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		setLoading(true);
		axios.get('/api/summary', { withCredentials: true })
			.then(res => setSummary(res.data.slice().reverse())) // du plus ancien au plus récent
			.catch(() => setError(t('fetch_error') || 'Erreur de chargement'))
			.finally(() => setLoading(false));
	}, [t]);

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;
	if (error) return <div style={{ color: 'red' }}>{error}</div>;
	if (!summary.length) return <div>{t('no_data') || 'Aucune donnée'}</div>;

	return (
		<div style={{ marginTop: 32 }}>
			<h3>{t('evolution_chart') || 'Évolution sur 12 mois'}</h3>
			<ResponsiveContainer width="100%" height={240}>
				<LineChart data={summary} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" fontSize={12} />
					<YAxis fontSize={12} />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="forecastBalance" stroke="#0070f3" name={t('forecast_balance')} dot={false} />
					<Line type="monotone" dataKey="saving" stroke="#43a047" name={t('saving')} dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
} 