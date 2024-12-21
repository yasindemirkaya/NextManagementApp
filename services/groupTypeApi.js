import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL GROUP TYPES
// |
// ***************************

export const getGroupTypes = async (params = {}) => {
    try {
        const response = await axios.get('/private/user-group-types/get-user-group-types', { params });

        return {
            success: true,
            data: response.user_group_types,
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
// | GET GROUP TYPE BY ID
// |
// ***************************

export const getGroupTypeById = async (id) => {
    try {
        const response = await axios.get('/private/user-group-types/get-user-group-type-by-id', {
            params: { id }
        });

        return {
            success: true,
            data: response.groupType,
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
// | CREATE USER GROUP TYPE
// |
// ***************************

export const createGroupType = async (typeName) => {
    try {
        const response = await axios.post('/private/user-group-types/create-user-group-type', {
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

export const updateGroupType = async (groupTypeId, newTypeName) => {
    try {
        const response = await axios.put('/private/user-group-types/update-user-group', {
            groupTypeId,
            newTypeName,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | DELETE USER GROUP TYPE
// |
// ***************************

export const deleteGroupType = async (groupTypeId) => {
    try {
        const response = await axios.delete('/private/user-group-types/delete-user-group-type', {
            data: { groupTypeId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};