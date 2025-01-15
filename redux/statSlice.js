import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboardStats: [],
    isDashboardStatsInitialized: false,
    showDashboardStats: true
};

const statSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        // SET DASHBOARD STATS
        setDashboardStats: (state, action) => {
            state.dashboardStats = action.payload;
        },
        // SET IS DASHBOARD INITIALIZED
        setIsDashboardStatsInitialized: (state, action) => {
            state.isDashboardStatsInitialized = action.payload;
        },
        // SET SHOW DASHBOARD STATS
        setShowDashboardStats: (state, action) => {
            state.showDashboardStats = action.payload
        },
        // RESET DASHBOARD STATS
        resetDashboardStats: (state) => {
            state.dashboardStats = []
            state.isDashboardStatsInitialized = false
            state.showDashboardStats = true
        }
    },
});

export const { setDashboardStats, setIsDashboardStatsInitialized, setShowDashboardStats, resetDashboardStats } = statSlice.actions;

export default statSlice.reducer;
