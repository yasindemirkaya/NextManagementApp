import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        unique: true,
        sparse: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: Number,
        default: 0,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // created_by alanı başka bir kullanıcıyı referans alacak
        required: false,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // updated_by alanı başka bir kullanıcıyı referans alacak
        required: false,
    },
    user_groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserGroup', // UserGroup koleksiyonunu referans alır
        default: [],
        required: false
    }],
}, {
    timestamps: true,
});

// 'User' modelini oluşturur ve 'users' koleksiyonuna bağlar
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
