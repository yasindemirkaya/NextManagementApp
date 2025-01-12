import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";

import userReducer from "./userSlice";
import statReducer from "./statSlice";

// Persist config
const persistConfig = {
    key: "root",
    storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedStatReducer = persistReducer(persistConfig, statReducer);

const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        stats: persistedStatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

export default store;