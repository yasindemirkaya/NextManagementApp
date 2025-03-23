import mongoose from 'mongoose';

const TaskLabelSchema = new mongoose.Schema({
    label_name: {
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
        required: false
    },
}, {
    timestamps: true,
});

const TaskLabel = mongoose.models.TaskLabel || mongoose.model('TaskLabel', TaskLabelSchema, 'taskLabels');

export default TaskLabel;
