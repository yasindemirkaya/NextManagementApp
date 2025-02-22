import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL PROJECTS
// |
// ***************************

export const getProjects = async (params = {}) => {
    try {
        const response = await axios.get('/private/projects/get-projects', { params });

        if (response.code === 1) {
            return {
                success: true,
                data: response.projects,
                pagination: response.pagination
            };
        } else {
            return {
                success: false,
                error: response.message
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
};


// ***************************
// |
// | GET PROJECT BY ID
// |
// ***************************

export const getProjectById = async (id) => {
    try {
        const response = await axios.get('/private/projects/get-project-by-id', {
            params: { id }
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.project
            };
        } else {
            return {
                success: false,
                error: response.message
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};


// ***************************
// |
// | CREATE PROJECT
// |
// ***************************

export const createProject = async (projectData) => {
    try {
        const response = await axios.post('/private/projects/create-project', projectData);

        if (response.code === 1) {
            return {
                success: true,
                projectId: response.projectId,
                message: response.message
            };
        } else {
            return {
                success: false,
                error: response.message
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};


// ***************************
// |
// | UPDATE PROJECT
// |
// ***************************

export const updateProject = async (projectData) => {
    try {
        const response = await axios.put('/private/projects/update-project', projectData);

        if (response.code === 1) {
            return {
                success: true,
                message: response.message
            };
        } else {
            return {
                success: false,
                error: response.message
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};


// ***************************
// |
// | DELETE PROJECT
// |
// ***************************

export const deleteProject = async (projectId) => {
    try {
        const response = await axios.delete('/private/projects/delete-project', {
            data: { projectId }
        });

        if (response.code === 1) {
            return {
                success: true,
                message: response.message
            };
        } else {
            return {
                success: false,
                error: response.message
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};


// ***************************
// |
// | GET ALL PROJECT TYPES
// |
// ***************************

export const getProjectTypes = async (params = {}) => {
    try {
        const response = await axios.get('/private/projects/get-project-types', { params });

        return {
            success: true,
            data: response.project_types,
            pagination: response.pagination,
            message: response.message,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};


// ***************************
// |
// | GET PROJECT TYPE BY ID
// |
// ***************************

export const getProjectTypeById = async (id) => {
    try {
        const response = await axios.get('/private/projects/get-project-type-by-id', {
            params: { id }
        });

        return {
            success: true,
            data: response.projectType,
            message: response.message,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};


// ***************************
// |
// | CREATE PROJECT TYPE
// |
// ***************************

export const createProjectType = async (typeName) => {
    try {
        const response = await axios.post('/private/projects/create-project-type', {
            typeName,
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | UPDATE PROJECT TYPE
// |
// ***************************

export const updateProjectType = async (projectTypeId, newTypeName) => {
    try {
        const response = await axios.put('/private/projects/update-project-type', {
            projectTypeId,
            newTypeName,
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | DELETE PROJECT TYPE
// |
// ***************************

export const deleteProjectType = async (projectTypeId) => {
    try {
        const response = await axios.delete('/private/projects/delete-project-type', {
            data: { projectTypeId },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
