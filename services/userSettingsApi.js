import axios from '@/utils/axios';

// ***************************
// |
// | GET USER SETTINGS
// |
// ***************************

export const getUserSettings = async () => {
    try {
        const response = await axios.get('/private/settings/user-settings/get-user-settings');

        if (response.code === 1) {
            return {
                success: true,
                data: response.settings,
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
// | CREATE USER SETTINGS
// |
// ***************************

export const createUserSettings = async (language, theme) => {
    try {
        const response = await axios.post('/private/settings/user-settings/create-user-setting', {
            language,
            theme
        });

        if (response.code === 1) {
            return {
                success: true,
                data: response.settings,
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
