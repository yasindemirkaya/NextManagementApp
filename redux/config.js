import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import userReducer from './user';

// Persist configuration
const persistConfig = {
    key: 'root', // Persist edilen verinin anahtarı
    storage, // Hangi storage kullanılacak (localStorage)
    whitelist: ['user'], // sadece user bilgilerini persist et
};

// Root reducer
const rootReducer = combineReducers({
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export { persistedReducer }; // persistedReducer'ı dışa aktar