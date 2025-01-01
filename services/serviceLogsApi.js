import axios from '@/utils/axios';

// ***************************
// |
// | GET SERVICE LOGS
// |
// ***************************

export const getServiceLogs = async (guid) => {
    try {
        const response = await axios.post('/private/service-logs/get-service-logs', {
            guid: guid
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.logs,
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
