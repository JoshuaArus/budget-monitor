import React from 'react';
import { useTranslation } from 'react-i18next';
import IncomeList from '../components/IncomeList';
import IncomeForm from '../components/IncomeForm';
import PlannedIncomeForm from '../components/PlannedIncomeForm';

export default function IncomesPage() {
	const { t } = useTranslation();
	return (
		<div style={{ marginTop: 32 }}>
			<h2>{t('incomes')}</h2>
			<PlannedIncomeForm onSuccess={() => window.location.reload()} />
			<IncomeForm onSuccess={() => window.location.reload()} />
			<IncomeList />
		</div>
	);
} 