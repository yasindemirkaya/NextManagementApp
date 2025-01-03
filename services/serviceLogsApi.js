import axios from '@/utils/axios';

// ***************************
// |
// | GET SERVICE LOGS BY GUID
// |
// ***************************

export const getServiceLogsByGUID = async (guid) => {
    try {
        const response = await axios.get(`/private/service-logs/get-service-logs-by-guid`, {
            params: { guid }
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.logs,
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
// | GET SERVICE LOGS BY DATE
// |
// ***************************

export const getServiceLogsByDate = async (startDate, endDate, userEmail = null, userId = null) => {
    try {
        const response = await axios.get('/private/service-logs/get-service-logs-by-date', {
            params: { startDate, endDate, userEmail, userId },
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.logs,
                message: response.message,
            };
        } else {
            return {
                success: false,
                error: response.message,
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};
