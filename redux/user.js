import { createSlice } from '@reduxjs/toolkit';

// Initial state for user data
const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Redux slice to manage user data
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
});

// Export actions
export const { setUser, setLoading, setError, clearUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;