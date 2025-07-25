import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MobileNav() {
	const { t } = useTranslation();
	return (
		<nav className="mobile-nav">
			<NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>{t('dashboard')}</NavLink>
			<NavLink to="/debits" className={({ isActive }) => isActive ? 'active' : ''}>{t('debits')}</NavLink>
			<NavLink to="/incomes" className={({ isActive }) => isActive ? 'active' : ''}>{t('incomes')}</NavLink>
			<NavLink to="/savings" className={({ isActive }) => isActive ? 'active' : ''}>{t('savings')}</NavLink>
			<NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>{t('settings')}</NavLink>
		</nav>
	);
} 