import { DataTypes } from 'sequelize';
import sequelize from '@/config/db';

const UserGroup = sequelize.define('UserGroup', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
    },
    group_leader: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        }
    }
}, {
    tableName: 'user_groups', // Veritabanında 'user_groups' tablosuna kaydedilir
    timestamps: true, // createdAt ve updatedAt alanları otomatik olarak eklenir
})

export default UserGroup;