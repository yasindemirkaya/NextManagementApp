import mongoose from 'mongoose';

const statisticSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    icon_color: {
        type: String,
        required: true,
    },
    bg_color: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// 'Statistic' modelini oluşturur ve 'statistics' koleksiyonuna bağlar
const Statistic = mongoose.models.Statistic || mongoose.model('Statistic', statisticSchema, 'statistics');

export default Statistic;
