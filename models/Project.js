import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    project_lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignment_type: {
        type: String,
        required: true
    },
    assignee_user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }],
    assignee_group: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false,
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});


const Project = mongoose.models.Project || mongoose.model('Project', projectSchema, 'projects');

export default Project;
