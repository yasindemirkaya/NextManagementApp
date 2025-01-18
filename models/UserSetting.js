import mongoose from 'mongoose';

const userSettingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    theme: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});


const UserSetting = mongoose.models.UserSetting || mongoose.model('UserSetting', userSettingSchema, 'userSettings');

export default UserSetting;
