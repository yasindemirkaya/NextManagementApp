import { createSlice } from "@reduxjs/toolkit"

const pageSlice = createSlice({
    name: 'page',
    initialState: {
        login: {
            username: "",
            loginStatus: false
        }
    },
    reducers: {
        setLogin: (state, action) => {
            state.login = action.payload
        },
    }
})

export const {
    setLogin,
} = pageSlice.actions

export default pageSlice.reducer