import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import type { Storage } from 'redux-persist'

const storage: Storage = {
  getItem: (key) => Promise.resolve(sessionStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(sessionStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(sessionStorage.removeItem(key)),
}
import projectsReducer from './projects/projectsSlice'
import reportDataReducer from './reportData/reportDataSlice'

const persistConfig = {
  key: 'nadlan-root',
  storage,
  version: 1,
}

const rootReducer = combineReducers({
  projects: projectsReducer,
  reportData: reportDataReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
