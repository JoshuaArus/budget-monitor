import mongoose from 'mongoose';

const accountConfigSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
	overdraftLimit: { type: Number, default: 0 },
	initialBalance: { type: Number, default: 0 },
	taxRate: { type: Number, default: 0 }, // Pourcentage (ex: 0.15 pour 15%)
	grossToNetRate: { type: Number, default: 0.77 }, // Par défaut 77%
});

export default mongoose.model('AccountConfig', accountConfigSchema); 