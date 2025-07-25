import React from 'react';
import { useTranslation } from 'react-i18next';
import AccountConfigForm from '../components/AccountConfigForm';

export default function SettingsPage() {
	const { t } = useTranslation();
	return (
		<div style={{ marginTop: 32 }}>
			<h2>{t('settings')}</h2>
			<AccountConfigForm />
		</div>
	);
} 