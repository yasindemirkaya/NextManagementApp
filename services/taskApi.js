import axios from '@/utils/axios';

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