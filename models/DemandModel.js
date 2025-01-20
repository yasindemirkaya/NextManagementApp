import mongoose from 'mongoose';

const demandSchema = new mongoose.Schema({
    // Talebi açanın ID'si
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Talebin gittiği kişinin ID'si
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    admin_response: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});


const Demand = mongoose.models.Demand || mongoose.model('Demand', demandSchema, 'userSettings');

export default Demand;
