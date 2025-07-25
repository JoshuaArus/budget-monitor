import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

function EditableRow({ item, type, onSave, onCancel }) {
	const { t } = useTranslation();
	const [name, setName] = useState(item.name);
	const [amount, setAmount] = useState(item.amount);
	const [month, setMonth] = useState(item.month || '');
	const [loading, setLoading] = useState(false);
	const handleSave = async () => {
		setLoading(true);
		try {
			if (type === 'recurring') {
				await axios.put(`/api/recurring-debits/${item._id}`, { name, amount }, { withCredentials: true });
			} else {
				await axios.put(`/api/one-time-debits/${item._id}`, { name, amount, month }, { withCredentials: true });
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
			{type === 'one-time' && (
				<input value={month} onChange={e => setMonth(e.target.value)} style={{ width: 80 }} />
			)}
			<button onClick={handleSave} disabled={loading}>{t('save')}</button>
			<button onClick={onCancel}>{t('cancel')}</button>
		</li>
	);
}

export default function DebitList() {
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
			axios.get('/api/recurring-debits', { withCredentials: true }),
			axios.get('/api/one-time-debits', { withCredentials: true })
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
				await axios.delete(`/api/recurring-debits/${id}`, { withCredentials: true });
			} else {
				await axios.delete(`/api/one-time-debits/${id}`, { withCredentials: true });
			}
			fetchData();
		} catch {
			alert(t('delete_error') || 'Erreur lors de la suppression');
		}
	};

	const currentMonth = dayjs().format('YYYY-MM');

	const handleCheck = async (id, checked) => {
		try {
			await axios.put(`/api/recurring-debits/${id}/check`, { month: currentMonth, checked }, { withCredentials: true });
			fetchData();
		} catch {
			alert(t('edit_error') || 'Erreur lors de la modification');
		}
	};

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;
	if (error) return <div style={{ color: 'red' }}>{error}</div>;

	return (
		<div style={{ marginTop: 16 }}>
			<h3>{t('recurring_debits') || 'Prélèvements récurrents'}</h3>
			<ul>
				{recurring.map(d => {
					const checkedMonth = d.checkedMonths?.find(m => m.month === currentMonth)?.checked || false;
					return editId === d._id && editType === 'recurring' ? (
						<EditableRow key={d._id} item={d} type="recurring" onSave={() => { setEditId(null); fetchData(); }} onCancel={() => setEditId(null)} />
					) : (
						<li key={d._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<input type="checkbox" checked={checkedMonth} onChange={e => handleCheck(d._id, e.target.checked)} />
							{d.name} - {d.amount} €
							<button onClick={() => { setEditId(d._id); setEditType('recurring'); }}>{t('edit')}</button>
							<button onClick={() => handleDelete(d._id, 'recurring')}>{t('delete')}</button>
						</li>
					);
				})}
			</ul>
			<h3>{t('one_time_debits') || 'Prélèvements ponctuels'}</h3>
			<ul>
				{oneTime.map(d => (
					editId === d._id && editType === 'one-time' ? (
						<EditableRow key={d._id} item={d} type="one-time" onSave={() => { setEditId(null); fetchData(); }} onCancel={() => setEditId(null)} />
					) : (
						<li key={d._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							{d.name} - {d.amount} € ({d.month})
							<button onClick={() => { setEditId(d._id); setEditType('one-time'); }}>{t('edit')}</button>
							<button onClick={() => handleDelete(d._id, 'one-time')}>{t('delete')}</button>
						</li>
					)
				))}
			</ul>
		</div>
	);
} 