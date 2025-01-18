import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem("language")
            localStorage.removeItem("theme")
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;