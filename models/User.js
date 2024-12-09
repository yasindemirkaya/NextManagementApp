import { DataTypes } from 'sequelize';
import sequelize from '@/config/db';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    created_by: {
<<<<<<< Updated upstream
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        }
    }
=======
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
>>>>>>> Stashed changes
}, {
    tableName: 'users', // Veritabanında 'users' tablosuna kaydedilir
    timestamps: true, // createdAt ve updatedAt alanları otomatik olarak eklenir
});

export default User;
