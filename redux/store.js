import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./page";

const store = configureStore({
    reducer: {
        page: pageReducer,
    },
});

export default store;