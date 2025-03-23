import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL TASKS
// |
// ***************************

export const getTasks = async (params = {}) => {
    try {
        const response = await axios.get('/private/tasks/get-tasks', { params });

        if (response.code === 1) {
            return {
                success: true,
                data: response.tasks,
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
// | GET TASK BY ID
// |
// ***************************

export const getTaskById = async (id) => {
    try {
        const response = await axios.get('/private/tasks/get-task-by-id', {
            params: { id }
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.task
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
// | CREATE TASK
// |
// ***************************

export const createTask = async (taskData) => {
    try {
        const response = await axios.post('/private/tasks/create-task', taskData);

        if (response.code === 1) {
            return {
                success: true,
                taskId: response.taskId,
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
// | UPDATE TASK
// |
// ***************************

export const updateTask = async (taskData) => {
    try {
        const response = await axios.put('/private/tasks/update-task', taskData);

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
// | DELETE TASK
// |
// ***************************

export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete('/private/tasks/delete-task', {
            data: { taskId }
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
// | GET ALL TASK LABELS
// |
// ***************************

export const getTaskLabels = async (params = {}) => {
    try {
        const response = await axios.get('/private/tasks/get-task-labels', { params });

        return {
            success: true,
            data: response.task_labels,
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
// | GET TASK LABEL BY ID
// |
// ***************************

export const getTaskLabelById = async (id) => {
    try {
        const response = await axios.get('/private/tasks/get-task-label-by-id', {
            params: { id }
        });

        return {
            success: true,
            data: response.taskLabel,
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
// | CREATE TASK LABEL
// |
// ***************************

export const createTaskLabel = async (labelName) => {
    try {
        const response = await axios.post('/private/tasks/create-task-label', {
            labelName,
        });
        return response;
    } catch (error) {
        throw error;
    }
};