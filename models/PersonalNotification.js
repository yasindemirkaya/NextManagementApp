import mongoose from 'mongoose';

const personalNotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    date: {
        type: Date,
        required: false,
    },
    is_seen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// 'PersonalNotification' modelini oluşturur ve 'personalNotifications' koleksiyonuna bağlar
const PersonalNotification = mongoose.models.PersonalNotification || mongoose.model('PersonalNotification', personalNotificationSchema, 'personalNotifications');

export default PersonalNotification;
