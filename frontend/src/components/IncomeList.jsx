import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function EditableRow({ item, type, onSave, onCancel }) {
	const { t } = useTranslation();
	const [name, setName] = useState(item.name);
	const [amount, setAmount] = useState(item.amount);
	const [incomeType, setIncomeType] = useState(item.type || 'fixed');
	const [month, setMonth] = useState(item.month || '');
	const [loading, setLoading] = useState(false);
	const handleSave = async () => {
		setLoading(true);
		try {
			if (type === 'recurring') {
				await axios.put(`/api/recurring-incomes/${item._id}`, { name, amount, type: incomeType }, { withCredentials: true });
			} else {
				await axios.put(`/api/one-time-incomes/${item._id}`, { name, amount, month }, { withCredentials: true });
			}
			onSave();
		} catch {
			alert(t('edit_error') || 'Erreur lors de la modification');
		} finally {
			setLoading(false);
		}
	};
	return (
		<li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
			<input value={name} onChange={e => setName(e.target.value)} style={{ width: 80 }} />
			<input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 60 }} />
			{type === 'recurring' && (
				<select value={incomeType} onChange={e => setIncomeType(e.target.value)}>
					<option value="fixed">{t('fixed')}</option>
					<option value="gross">{t('gross')}</option>
				</select>
			)}
			{type === 'one-time' && (
				<input value={month} onChange={e => setMonth(e.target.value)} style={{ width: 80 }} />
			)}
			<button onClick={handleSave} disabled={loading}>{t('save')}</button>
			<button onClick={onCancel}>{t('cancel')}</button>
		</li>
	);
}

export default function IncomeList() {
	const { t } = useTranslation();
	const [recurring, setRecurring] = useState([]);
	const [oneTime, setOneTime] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editId, setEditId] = useState(null);
	const [editType, setEditType] = useState(null);

	const fetchData = () => {
		setLoading(true);
		Promise.all([
			axios.get('/api/recurring-incomes', { withCredentials: true }),
			axios.get('/api/one-time-incomes', { withCredentials: true })
		])
			.then(([rec, one]) => {
				setRecurring(rec.data);
				setOneTime(one.data);
			})
			.catch(() => setError(t('fetch_error') || 'Erreur de chargement'))
			.finally(() => setLoading(false));
	};

	useEffect(() => { fetchData(); }, [t]);

	const handleDelete = async (id, type) => {
		if (!window.confirm(t('delete_confirm') || 'Supprimer ?')) return;
		try {
			if (type === 'recurring') {
				await axios.delete(`/api/recurring-incomes/${id}`, { withCredentials: true });
			} else {
				await axios.delete(`/api/one-time-incomes/${id}`, { withCredentials: true });
			}
			fetchData();
		} catch {
			alert(t('delete_error') || 'Erreur lors de la suppression');
		}
	};

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;
	if (error) return <div style={{ color: 'red' }}>{error}</div>;

	return (
		<div style={{ marginTop: 16 }}>
			<h3>{t('recurring_incomes') || 'Revenus récurrents'}</h3>
			<ul>
				{recurring.map(i => (
					editId === i._id && editType === 'recurring' ? (
						<EditableRow key={i._id} item={i} type="recurring" onSave={() => { setEditId(null); fetchData(); }} onCancel={() => setEditId(null)} />
					) : (
						<li key={i._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							{i.name} - {i.amount} € ({t(i.type)})
							<button onClick={() => { setEditId(i._id); setEditType('recurring'); }}>{t('edit')}</button>
							<button onClick={() => handleDelete(i._id, 'recurring')}>{t('delete')}</button>
						</li>
					)
				))}
			</ul>
			<h3>{t('one_time_incomes') || 'Revenus ponctuels'}</h3>
			<ul>
				{oneTime.map(i => (
					editId === i._id && editType === 'one-time' ? (
						<EditableRow key={i._id} item={i} type="one-time" onSave={() => { setEditId(null); fetchData(); }} onCancel={() => setEditId(null)} />
					) : (
						<li key={i._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							{i.name} - {i.amount} € ({i.month})
							<button onClick={() => { setEditId(i._id); setEditType('one-time'); }}>{t('edit')}</button>
							<button onClick={() => handleDelete(i._id, 'one-time')}>{t('delete')}</button>
						</li>
					)
				))}
			</ul>
		</div>
	);
} 