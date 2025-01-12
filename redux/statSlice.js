import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboard: {
        stats: [],
    }
};

const statSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        setStats: (state, action) => {
            console.log('ACTION:', action)
            state.dashboard.stats = action.payload;
        },
    },
});

export const { setStats } = statSlice.actions;

export default statSlice.reducer;
