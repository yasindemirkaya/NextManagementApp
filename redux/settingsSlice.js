import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userSettings: {
        language: '',
        theme: ''
    }
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        // SET USER SETTINGS
        setUserSettings: (state, action) => {
            const { language, theme } = action.payload;
            if (language) {
                state.userSettings.language = language;
                localStorage.setItem("language", language)
            }
            if (theme) {
                state.userSettings.theme = theme;
                localStorage.setItem("theme", theme)
            }
        },
    },
});

export const { setUserSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
