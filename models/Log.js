import { DataTypes } from 'sequelize';
import sequelize from '@/config/db';

const Log = sequelize.define('Log', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    request: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    response: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Log kayıtları için timestamp ekler
    tableName: 'logs', // Tablo adı
});

export default Log;
