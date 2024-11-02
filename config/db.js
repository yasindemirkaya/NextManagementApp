import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to MySQL database.');
    } catch (error) {
        console.error('Database connection could not be established:', error);
    }
};

testConnection();

export default sequelize;