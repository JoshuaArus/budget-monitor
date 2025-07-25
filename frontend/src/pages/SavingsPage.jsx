import React from 'react';
import { useTranslation } from 'react-i18next';
import SavingsList from '../components/SavingsList';
import SavingsForm from '../components/SavingsForm';

export default function SavingsPage() {
	const { t } = useTranslation();
	return (
		<div style={{ marginTop: 32 }}>
			<h2>{t('savings')}</h2>
			<SavingsForm onSuccess={() => window.location.reload()} />
			<SavingsList />
		</div>
	);
} 