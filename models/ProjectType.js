import mongoose from 'mongoose';

const ProjectTypeSchema = new mongoose.Schema({
    type_name: {
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
    },
}, {
    timestamps: true,
});

const ProjectType = mongoose.models.ProjectType || mongoose.model('ProjectType', ProjectTypeSchema, 'projectTypes');

export default ProjectType;
