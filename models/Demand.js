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
    start_date: {
        type: Date,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    admin_response: {
        type: String,
        required: false,
        default: ""
    }
}, {
    timestamps: true,
});


const Demand = mongoose.models.Demand || mongoose.model('Demand', demandSchema, 'demands');

export default Demand;
