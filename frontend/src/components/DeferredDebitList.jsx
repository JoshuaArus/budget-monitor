import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function EditableRow({ item, onSave, onCancel }) {
	const { t } = useTranslation();
	const [name, setName] = useState(item.name);
	const [amount, setAmount] = useState(item.amount);
	const [inputMonth, setInputMonth] = useState(item.inputMonth);
	const [debitMonth, setDebitMonth] = useState(item.debitMonth);
	const [loading, setLoading] = useState(false);
	const handleSave = async () => {
		setLoading(true);
		try {
			await axios.put(`/api/deferred-debits/${item._id}`, { name, amount, inputMonth, debitMonth }, { withCredentials: true });
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
			<input value={inputMonth} onChange={e => setInputMonth(e.target.value)} style={{ width: 80 }} placeholder="YYYY-MM" />
			<input value={debitMonth} onChange={e => setDebitMonth(e.target.value)} style={{ width: 80 }} placeholder="YYYY-MM" />
			<button onClick={handleSave} disabled={loading}>{t('save')}</button>
			<button onClick={onCancel}>{t('cancel')}</button>
		</li>
	);
}

function AddRow({ onAdd }) {
	const { t } = useTranslation();
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [inputMonth, setInputMonth] = useState('');
	const [debitMonth, setDebitMonth] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const handleAdd = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await axios.post('/api/deferred-debits', { name, amount: Number(amount), inputMonth, debitMonth }, { withCredentials: true });
			setName(''); setAmount(''); setInputMonth(''); setDebitMonth('');
			onAdd();
		} catch {
			setError(t('add_error') || 'Erreur lors de l\'ajout');
		} finally {
			setLoading(false);
		}
	};
	return (
		<form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
			<input value={name} onChange={e => setName(e.target.value)} placeholder={t('name')} required style={{ width: 80 }} />
			<input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t('amount')} required min="0" step="0.01" style={{ width: 60 }} />
			<input value={inputMonth} onChange={e => setInputMonth(e.target.value)} placeholder={t('input_month') || 'Mois saisie'} required style={{ width: 80 }} />
			<input value={debitMonth} onChange={e => setDebitMonth(e.target.value)} placeholder={t('debit_month') || 'Mois débit'} required style={{ width: 80 }} />
			<button type="submit" disabled={loading}>{t('add')}</button>
			{error && <span style={{ color: 'red' }}>{error}</span>}
		</form>
	);
}

export default function DeferredDebitList() {
	const { t } = useTranslation();
	const [debits, setDebits] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editId, setEditId] = useState(null);

	const fetchData = () => {
		setLoading(true);
		axios.get('/api/deferred-debits', { withCredentials: true })
			.then(res => setDebits(res.data))
			.catch(() => setError(t('fetch_error') || 'Erreur de chargement'))
			.finally(() => setLoading(false));
	};

	useEffect(() => { fetchData(); }, [t]);

	const handleDelete = async (id) => {
		if (!window.confirm(t('delete_confirm') || 'Supprimer ?')) return;
		try {
			await axios.delete(`/api/deferred-debits/${id}`, { withCredentials: true });
			fetchData();
		} catch {
			alert(t('delete_error') || 'Erreur lors de la suppression');
		}
	};

	if (loading) return <div>{t('loading') || 'Chargement...'}</div>;
	if (error) return <div style={{ color: 'red' }}>{error}</div>;

	return (
		<div style={{ marginTop: 16 }}>
			<h3>{t('deferred_debits') || 'Débits différés'}</h3>
			<AddRow onAdd={fetchData} />
			<ul>
				{debits.map(d => (
					editId === d._id ? (
						<EditableRow key={d._id} item={d} onSave={() => { setEditId(null); fetchData(); }} onCancel={() => setEditId(null)} />
					) : (
						<li key={d._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							{d.name} - {d.amount} € ({t('input_month')}: {d.inputMonth}, {t('debit_month')}: {d.debitMonth})
							<button onClick={() => setEditId(d._id)}>{t('edit')}</button>
							<button onClick={() => handleDelete(d._id)}>{t('delete')}</button>
						</li>
					)
				))}
			</ul>
		</div>
	);
} 