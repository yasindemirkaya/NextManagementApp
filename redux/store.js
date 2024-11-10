import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { persistedReducer } from './config'; // persistedReducer'ı buradan alıyoruz

const store = configureStore({
    reducer: persistedReducer, // persist edilmiş reducer'ı kullanıyoruz
    devTools: process.env.NODE_ENV !== 'production', // Geliştirme ortamında Redux DevTools'u aktif et
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            serializableCheck: false, // Serileştirilemeyen nesneler için kontrolü kapat
        }),
    ],
});

const persistor = persistStore(store); // Redux store'u ile persistStore'u başlatıyoruz

export { store, persistor }; // Store ve persistor'ı dışa aktarıyoruz