import { configureStore } from '@reduxjs/toolkit'
import reportReducer from './reportSlice'
import projectsReducer from './projectsSlice'

export const store = configureStore({
  reducer: {
    report: reportReducer,
    projects: projectsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
