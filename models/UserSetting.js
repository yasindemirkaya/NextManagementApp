import mongoose from 'mongoose';

const userSettingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    language: {
        type: String,
        required: false,
    },
    theme: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});


const UserSetting = mongoose.models.UserSetting || mongoose.model('UserSetting', userSettingSchema, 'userSettings');

export default UserSetting;
