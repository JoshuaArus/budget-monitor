import mongoose from 'mongoose';

const recurringIncomeSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true },
	amount: { type: Number, required: true },
	type: { type: String, enum: ['fixed', 'gross'], required: true }, // 'fixed' = montant net, 'gross' = à convertir
	createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('RecurringIncome', recurringIncomeSchema); 