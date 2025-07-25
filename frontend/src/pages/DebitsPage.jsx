import React from 'react';
import { useTranslation } from 'react-i18next';
import DebitList from '../components/DebitList';
import DebitForm from '../components/DebitForm';
import DeferredDebitList from '../components/DeferredDebitList';

export default function DebitsPage() {
	const { t } = useTranslation();
	return (
		<div style={{ marginTop: 32 }}>
			<h2>{t('debits')}</h2>
			<DebitForm onSuccess={() => window.location.reload()} />
			<DebitList />
			<DeferredDebitList />
		</div>
	);
} 