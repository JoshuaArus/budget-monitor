import mongoose from 'mongoose';

const recurringDebitSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true },
	amount: { type: Number, required: true },
	checkedMonths: [{
		month: { type: String, required: true }, // Format 'YYYY-MM'
		checked: { type: Boolean, default: false }
	}],
	createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('RecurringDebit', recurringDebitSchema); 