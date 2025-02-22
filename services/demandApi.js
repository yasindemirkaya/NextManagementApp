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

export const updateDemand = async (demandId, status, admin_response, targetId) => {
    try {
        const requestData = {
            demandId,
            status,
            admin_response
        };

        // targetId sadece gerekliyse ekleniyor
        if (targetId) {
            requestData.targetId = targetId;
        }

        const response = await axios.put('/private/demands/update-demand', requestData);

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
// | GET DEMAND COUNT
// |
// ***************************

export const getDemandCount = async () => {
    try {
        const response = await axios.get('/private/demands/get-demand-count')

        return {
            success: true,
            data: response.totalDemandCount,
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
// | GET ALL DEMAND TYPES
// |
// ***************************

export const getDemandTypes = async (params = {}) => {
    try {
        const response = await axios.get('/private/demands/get-demand-types', { params });

        return {
            success: true,
            data: response.demand_types,
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
// | GET DEMAND TYPE BY ID
// |
// ***************************

export const getDemandTypeById = async (id) => {
    try {
        const response = await axios.get('/private/demands/get-demand-type-by-id', {
            params: { id }
        });

        return {
            success: true,
            data: response.demandType,
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
// | CREATE DEMAND TYPE
// |
// ***************************

export const createDemandType = async (typeName) => {
    try {
        const response = await axios.post('/private/demands/create-demand-type', {
            typeName,
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | UPDATE USER GROUP TYPE
// |
// ***************************

export const updateDemandType = async (demandTypeId, newTypeName) => {
    try {
        const response = await axios.put('/private/demands/update-demand-type', {
            demandTypeId,
            newTypeName,
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | DELETE DEMAND TYPE
// |
// ***************************

export const deleteDemandType = async (demandTypeId) => {
    try {
        const response = await axios.delete('/private/deands/delete-demand-type', {
            data: { demandTypeId },
        });
        return response;
    } catch (error) {
        throw error;
    }
};