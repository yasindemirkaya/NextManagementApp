import mongoose from 'mongoose';

const taskLabelTypeSchema = new mongoose.Schema({
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

const TaskLabelType = mongoose.models.TaskLabelType || mongoose.model('TaskLabelType', taskLabelTypeSchema, 'taskLabelTypes');

export default TaskLabelType;
