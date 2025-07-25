import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function EditableRow({ item, onSave, onCancel }) {
	const { t } = useTranslation();
	const [amount, setAmount] = useState(item.amount);
	const [month, setMonth] = useState(item.month);
	const [loading, setLoading] = useState(false);
	const handleSave = async () => {
		setLoading(true);
		try {
			await axios.put(`/api/savings/${item._id}`, { amount, month }, { withCredentials: true });
			onSave();
		} catch {
			alert(t('edit_error') || 'Erreur lors de la modification');
		} finally {
			setLoading(false);
		}
	};
	return (
		<li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
			<input value={month} onChange={e => setMonth(e.target.value)} style={{ width: 80 }} />
			<input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 60 }} />
			<button onClick={handleSave} disabled={loading}>{t('save')}</button>
			<button onClick={onCancel}>{t('cancel')}</button>
		</li>
	);
}

export default function SavingsList() {
	const { t } = useTranslation();
	const [savings, setSavings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editId, setEditId] = useState(null);

	const fetchData = () => {
		setLoading(true);
		axios.get('/api/savings', { withCredentials: true })
			.then(res => setSavings(res.data))
			.catch(() => setError(t('fetch_error') || 'Erreur de chargement'))
			.finally(() => setLoading(false));
	};

	useEffect(() => { fetchData(); }, [t]);

	const handleDelete = async (id) => {
		if (!window.confirm(t('delete_confirm') || 'Supprimer ?')) return;
		try {
			await axios.delete(`/api/savings/${id}`, { withCredentials: true });
			fetchData();
		} catch {
			alert(t('delete_error') || 'Erreur lors de la suppression');
		}
	};

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;
	if (error) return <div style={{ color: 'red' }}>{error}</div>;

	return (
		<div style={{ marginTop: 16 }}>
			<h3>{t('savings_list') || "Saisies d'épargne"}</h3>
			<ul>
				{savings.map(s => (
					editId === s._id ? (
						<EditableRow key={s._id} item={s} onSave={() => { setEditId(null); fetchData(); }} onCancel={() => setEditId(null)} />
					) : (
						<li key={s._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							{s.month} : {s.amount} €
							<button onClick={() => setEditId(s._id)}>{t('edit')}</button>
							<button onClick={() => handleDelete(s._id)}>{t('delete')}</button>
						</li>
					)
				))}
			</ul>
		</div>
	);
} 