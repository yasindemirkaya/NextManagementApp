import mongoose from 'mongoose';

const connectToDatabase = async (req, res, next) => {
    if (mongoose.connection.readyState >= 1) {
        return next(); // Bağlantı zaten sağlanmışsa, bir sonraki middleware'a geç
    }
    try {
        const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ManagementApp';

        if (!dbUri) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        // Veritabanı adı belirtmek iyi olabilir (Atlas'ta hangi db'yi kullanacağımızı belirleyebiliriz)
        await mongoose.connect(dbUri, {
            dbName: process.env.MONGODB_DB_NAME || 'NextManagementApp', // Veritabanı adı ekledik
            useNewUrlParser: true, // Modern URL parser kullanmak
            useUnifiedTopology: true, // Topology management
        });

        console.log('MongoDB connection successful');
        next(); // Bağlantı başarılıysa bir sonraki middleware'a geç
    } catch (error) {
        console.error('MongoDB connection error:', error);
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
};

export default connectToDatabase;
