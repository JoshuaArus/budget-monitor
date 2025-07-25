import mongoose from 'mongoose';

const deferredDebitSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true },
	amount: { type: Number, required: true },
	inputMonth: { type: String, required: true }, // Mois de saisie 'YYYY-MM'
	debitMonth: { type: String, required: true }, // Mois de prélèvement 'YYYY-MM'
	createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('DeferredDebit', deferredDebitSchema); 