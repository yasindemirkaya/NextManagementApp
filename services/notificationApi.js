import axios from '@/utils/axios';

// ***************************
// |
// | GET NOTIFICATION COUNT
// |
// ***************************

export const getNotificationCount = async (token) => {
    try {
        const response = await axios.get('private/notifications/get-notification-count')

        return {
            success: true,
            data: response.totalNotificationCount,
            message: response.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
};