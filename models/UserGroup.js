import mongoose from 'mongoose';

// Kullanıcı grubu şeması
const userGroupSchema = new mongoose.Schema({
    group_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    group_leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // group_leader, User koleksiyonundaki bir belgeyi referans alacak
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // created_by, User koleksiyonundaki bir belgeyi referans alacak
        required: false,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // updated_by, User koleksiyonundaki bir belgeyi referans alacak
        required: false,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // members, User koleksiyonundaki belgeleri referans alacak
        required: false, // members opsiyonel olabilir, ancak boş bırakılabilir
    }],
}, {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

// Modeli tanımlarken, var olan modeli kontrol et ve yeni model tanımla
const UserGroup = mongoose.models.UserGroup || mongoose.model('UserGroup', userGroupSchema, 'userGroups');

export default UserGroup;
