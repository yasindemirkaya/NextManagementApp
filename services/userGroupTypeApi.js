import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL USER GROUP TYPES
// |
// ***************************

export const getUserGroupTypes = async () => {
    try {
        const response = await axios.get('/private/user-group-types/get-user-group-types');
        return {
            success: true,
            data: response.user_group_types,
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

export const createUserGroupType = async (typeName) => {
    try {
        const response = await axios.post('/private/user-group-types/create-user-group-type', {
            typeName,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | UPDATE USER GROUP TYPE
// |
// ***************************

export const updateUserGroupType = async (groupTypeId, newTypeName) => {
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

export const deleteUserGroupType = async (groupTypeId) => {
    try {
        const response = await axios.delete('/private/user-group-types/delete-user-group-type', {
            data: { groupTypeId }, // DELETE isteklerinde body kısmını data ile göndermelisiniz
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};