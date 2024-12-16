import axios from '@/utils/axios';

// ***************************
// |
// | GET USERS
// |
// ***************************

export const getUsers = async (params = {}) => {
    try {
        const response = await axios.get('/private/users/get-users', { params });

        if (response.code === 1) {
            return {
                success: true,
                data: response.users,
                pagination: response.pagination
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
// | GET USERS BY ID
// |
// ***************************

export const getUserById = async (id) => {
    try {
        const response = await axios.get('/private/user/get-user-by-id', {
            params: { id },
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.user,
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
            error: response.message,
        };
    }
};