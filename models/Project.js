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
    projectLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignmentType: {
        type: String,
        required: true
    },
    assigneeUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }],
    assigneeGroup: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false,
    }]
}, {
    timestamps: true,
});


const Project = mongoose.models.Project || mongoose.model('Project', projectSchema, 'projects');

export default Project;
