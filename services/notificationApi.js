import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL NOTIFICATIONS
// |
// ***************************

export const getNotifications = async (params = {}) => {
    try {
        const response = await axios.get('/private/notifications/get-notifications', { params })

        if (response.code === 1) {
            return {
                success: true,
                data: response.notifications,
                message: response.message
            }
        } else {
            return {
                success: false,
                error: response.message
            }
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
// | GET MY NOTIFICATIONS
// |
// ***************************

export const getMyNotifications = async (params = {}) => {
    try {
        const response = await axios.get('/private/notifications/get-my-notifications', { params })

        if (response.code === 1) {
            return {
                success: true,
                data: response.notifications,
                message: response.message
            }
        } else {
            return {
                success: false,
                error: response.message
            }
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
// | GET NOTIFICATION BY ID
// |
// ***************************

export const getNotificationById = async (params = {}) => {
    try {
        const response = await axios.get('/private/notifications/get-notification-by-id', { params })

        if (response.code === 1) {
            return {
                success: true,
                data: response.notification,
                message: response.message
            }
        } else {
            return {
                success: false,
                error: response.message
            }
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
// | GET NOTIFICATION COUNT
// |
// ***************************

export const getNotificationCount = async () => {
    try {
        const response = await axios.get('/private/notifications/get-notification-count')

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


// ***************************
// |
// | CREATE PERSONAL NOTIFICATION
// |
// ***************************

export const createPersonalNotification = async (data = {}) => {
    try {
        const response = await axios.post('/private/notifications/create-personal-notification', data);

        if (response.code === 1) {
            return {
                success: true,
                data: response.notifications,
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
            error: error.response?.message || error.message
        };
    }
};


// ***************************
// |
// | CREATE GROUP NOTIFICATION
// |
// ***************************

export const createGroupNotification = async (data = {}) => {
    try {
        const response = await axios.post('/private/notifications/create-group-notification', data);

        if (response.code === 1) {
            return {
                success: true,
                data: response.notifications,
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
            error: error.response?.message || error.message
        };
    }
};


// ***************************
// |
// | UPDATE NOTIFICATION
// |
// ***************************

export const updateNotification = async (data = {}) => {
    try {
        const response = await axios.put('/private/notifications/update-notification', data);

        if (response.code === 1) {
            return {
                success: true,
                data: response.notification,
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
            error: error.response?.message || error.message
        };
    }
};


// ***************************
// |
// | DELETE NOTIFICATION
// |
// ***************************

export const deleteNotification = async (notificationId) => {
    try {
        const response = await axios.delete('/private/notifications/delete-notification', {
            data: { notificationId }
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
            error: error.response?.message || error.message
        };
    }
};