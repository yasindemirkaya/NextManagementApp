import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL DEMANDS
// |
// ***************************

export const getDemands = async (params = {}) => {
    try {
        const response = await axios.get('/private/demands/get-demands', { params });

        if (response.code === 1) {
            return {
                success: true,
                data: response.demands,
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
// | GET DEMAND BY ID
// |
// ***************************

export const getDemandById = async (id) => {
    try {
        const response = await axios.get('/private/demands/get-demand-by-id', {
            params: { id }
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.demand
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
// | CREATE DEMAND
// |
// ***************************

export const createDemand = async (data = {}) => {
    try {
        const response = await axios.post('/private/demands/create-demand', {
            targetId: data.targetUser.value,
            title: data.title.value,
            description: data.description,
            start_date: data.startDate,
            end_date: data.endDate || null
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.demandId,
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
// | UPDATE DEMAND
// |
// ***************************

export const updateDemand = async (demandId, status, admin_response) => {
    try {
        const response = await axios.put('/private/demands/update-demand', {
            demandId,
            status,
            admin_response
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.demand
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