import axios from '@/utils/axios';

// ***************************
// |
// | GET ALL USERS
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


// ***************************
// |
// | GET USER (YOURSELF)
// |
// ***************************

export const getUser = () => {
    return axios.get('/private/user/get-user')
        .then(response => response)
        .catch(error => {
            throw error;
        });
};


// ***************************
// |
// | CHANGE PASSWORD (YOURSELF)
// |
// ***************************

export const changePassword = async (data) => {
    try {
        const response = await axios.patch('/private/user/change-password', data);
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | CHANGE PASSWORD BY ID
// |
// ***************************

export const changePasswordById = async (data, userId) => {
    try {
        const response = await axios.patch('/private/user/change-password-by-id', {
            ...data,
            userId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | CREATE USER
// |
// ***************************

export const createUser = async (data) => {
    try {
        const mobile = data.mobile.replace(/\D/g, '');

        const response = await axios.post('/private/user/create-user', {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            mobile: mobile,
            isActive: data.isActive,
            isVerified: data.isVerified,
            role: data.role,
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | DELETE USER (YOURSELF)
// |
// ***************************

export const deleteUser = async () => {
    try {
        const response = await axios.delete('/private/user/delete-user');
        return response;
    } catch (error) {
        throw error;
    }
};


// ***************************
// |
// | DELETE USER BY ID
// |
// ***************************

export const deleteUserById = async (userId) => {
    try {
        const response = await axios.delete('/private/user/delete-user-by-id', {
            data: { userId },
        });
        return response;
    } catch (error) {
        throw error;
    }
};