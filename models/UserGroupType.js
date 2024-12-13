import mongoose from 'mongoose';

const UserGroupTypeSchema = new mongoose.Schema({
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

const UserGroupType = mongoose.models.UserGroupType || mongoose.model('UserGroupType', UserGroupTypeSchema, 'userGroupTypes');

export default UserGroupType;
