import axios from '@/utils/axios';

// ***************************
// |
// | LOGIN
// |
// ***************************

export const login = async (email, password) => {
    try {
        const response = await axios.post('/public/login', {
            email,
            password
        });
        return response
    } catch (error) {
        throw error;
    }
};