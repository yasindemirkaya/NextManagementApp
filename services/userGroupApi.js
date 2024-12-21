import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL USER GROUPS
// |
// ***************************

export const getAllUserGroups = async (params = {}) => {
    try {
        const response = await axios.get('/private/groups/get-user-groups', { params });

        if (response.code === 1) {
            return {
                success: true,
                data: response.groups,
                pagination: response.pagination
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
            error: error.message
        };
    }
};


// ***************************
// |
// | GET USER GROUP BY ID
// |
// ***************************

export const getUserGroupById = async (id) => {
    try {
        const response = await axios.get('/private/group/get-user-group-by-id', {
            params: { id }
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.group
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
            error: 'An error occurred when receiving user group data. Please try again later.'
        };
    }
};



// ***************************
// |
// | CREATE USER GROUP
// |
// ***************************

export const createUserGroup = async (data) => {
    try {
        const response = await axios.post('/private/group/create-user-group', {
            groupName: data.groupName,
            description: data.description,
            type: data.type,
            isActive: data.isActive,
            groupLeader: data.groupLeader,
            members: data.members || []
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
            error: error.message
        };
    }
};


// ***************************
// |
// | DELETE USER GROUP
// |
// ***************************

export const deleteUserGroup = async (userGroupId) => {
    try {
        const response = await axios.delete('/private/group/delete-user-group', {
            data: { groupId: userGroupId }
        });

        if (response.code === 1) {
            return {
                success: true,
                message: 'The user group has been deleted successfully.'
            };
        } else {
            return {
                success: false,
                error: response.message || 'User group could not be deleted. Please try again.'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: 'An error occurred while deleting the user group. Please try again later.'
        };
    }
};


// ***************************
// |
// | UPDATE USER GROUP
// |
// ***************************

export const updateUserGroup = async (updatedData) => {
    try {
        const response = await axios.put('/private/group/update-user-group', updatedData);

        if (response.code === 1) {
            return {
                success: true,
                message: response.message
            };
        } else {
            return {
                success: false,
                error: response.message || 'User group could not be updated. Please try again.'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: 'An error occurred while updating the user group. Please try again later.'
        };
    }
};