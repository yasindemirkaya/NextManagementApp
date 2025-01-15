import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboardStats: []
};

const statSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        setStats: (state, action) => {
            state.dashboardStats = action.payload;
        },
    },
});

export const { setStats } = statSlice.actions;

export default statSlice.reducer;
