import mongoose from 'mongoose';

const oneTimeIncomeSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true },
	amount: { type: Number, required: true },
	month: { type: String, required: true }, // Format 'YYYY-MM'
	createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('OneTimeIncome', oneTimeIncomeSchema); 