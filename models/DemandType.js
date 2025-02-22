import mongoose from 'mongoose';

const DemanTypeSchema = new mongoose.Schema({
    type_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    created_by: {
        type: String,
        required: true,
    },
    updated_by: {
        type: String,
    },
}, {
    timestamps: true,
});

const DemandType = mongoose.models.DemandType || mongoose.model('DemandType', DemanTypeSchema, 'demandTypes');

export default DemandType;
