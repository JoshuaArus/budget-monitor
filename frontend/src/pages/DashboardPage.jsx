import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardSummary from '../components/DashboardSummary';
import DashboardChart from '../components/DashboardChart';

export default function DashboardPage() {
	const { t } = useTranslation();
	return (
		<div style={{ marginTop: 32 }}>
			<h2>{t('dashboard')}</h2>
			<DashboardSummary />
			<DashboardChart />
			{/* À compléter avec les widgets de synthèse */}
		</div>
	);
} 