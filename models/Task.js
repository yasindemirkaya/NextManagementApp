import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    assignment_type: {
        type: String,
        required: true
    },
    assignee_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    assignee_group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false,
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    deadline: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
}, {
    timestamps: true,
});


const Task = mongoose.models.Task || mongoose.model('Task', taskSchema, 'tasks');

export default Task;
