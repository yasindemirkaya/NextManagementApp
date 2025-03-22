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