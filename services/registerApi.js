import axios from '@/utils/axios';

// ***************************
// |
// | REGISTER
// |
// ***************************

export const signUp = async ({ firstName, lastName, email, password, mobile }) => {
    try {
        const response = await axios.post('/public/register', {
            firstName,
            lastName,
            email,
            password,
            mobile,
        });
        return response;
    } catch (error) {
        throw error;
    }
};