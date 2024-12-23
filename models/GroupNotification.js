import mongoose from 'mongoose';

const groupNotificationSchema = new mongoose.Schema({
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
    group: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserGroup',
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

// 'GroupNotification' modelini oluşturur ve 'groupNotifications' koleksiyonuna bağlar
const GroupNotification = mongoose.models.GroupNotification || mongoose.model('GroupNotification', groupNotificationSchema, 'groupNotifications');

export default GroupNotification;
