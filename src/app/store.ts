import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { ThunkAction } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
  }
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>;

export type AppDispatch = typeof store.dispatch

