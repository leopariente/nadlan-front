import { configureStore, combineReducers } from '@reduxjs/toolkit'
import projectsReducer from './projects/projectsSlice'
import reportDataReducer from './reportData/reportDataSlice'
import authReducer from './auth/authSlice'

const rootReducer = combineReducers({
  projects: projectsReducer,
  reportData: reportDataReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
