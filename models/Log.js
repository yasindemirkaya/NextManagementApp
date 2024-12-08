import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // userId, User koleksiyonundaki bir belgeyi referans alacak
        required: false,
    },
    ip: {
        type: String,
        required: false,
    },
    userAgent: {
        type: String,
        required: false,
    },
    path: {
        type: String,
        required: true,
    },
    request: {
        type: mongoose.Schema.Types.Mixed, // JSON verisi için Mixed tipi kullanılır
        required: false,
    },
    response: {
        type: mongoose.Schema.Types.Mixed, // JSON verisi için Mixed tipi kullanılır
        required: false,
    },
    method: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // createdAt ve updatedAt alanları otomatik olarak ekler
});

let Log;

try {
    Log = mongoose.model('Log');
} catch (error) {
    // Eğer model zaten tanımlanmışsa, tekrar tanımlamaya çalışmıyoruz
    Log = mongoose.model('Log', logSchema);
}

export default Log;
