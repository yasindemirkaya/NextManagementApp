import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboardStats: [],
    isInitialized: false,
};

const statSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        // SET STATS
        setStats: (state, action) => {
            state.dashboardStats = action.payload;
        },
        // SET IS INITIALIZED
        setIsInitialized: (state, action) => {
            state.isInitialized = action.payload;
        },
    },
});

export const { setStats, setIsInitialized } = statSlice.actions;

export default statSlice.reducer;
