import mongoose from 'mongoose';

const savingsSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	month: { type: String, required: true }, // Format 'YYYY-MM'
	amount: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Savings', savingsSchema); 