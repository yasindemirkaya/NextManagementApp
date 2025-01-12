import axios from '@/utils/axios';

// ***************************
// |
// | GET DASHBOARD STATISTICS
// |
// ***************************

export const getDashboardStatistics = async () => {
    try {
        const response = await axios.get('/private/statistics/get-dashboard-statistics')

        if (response.code === 1) {
            return {
                success: true,
                message: response.message,
                data: response.data,
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
