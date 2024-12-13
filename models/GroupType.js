import mongoose from 'mongoose';

const GroupTypeSchema = new mongoose.Schema({
    type_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    created_by: {
        type: String,  // Burada ObjectId yerine String kullanıyoruz.
        required: true,
    },
    updated_by: {
        type: String,  // Burada da ObjectId yerine String kullanıyoruz.
    },
}, {
    timestamps: true,
});

// Modeli oluşturuyoruz
const GroupType = mongoose.models.GroupType || mongoose.model('GroupType', GroupTypeSchema, 'groupTypes');

export default GroupType;
