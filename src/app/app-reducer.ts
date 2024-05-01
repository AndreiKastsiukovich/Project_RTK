import { authAPI } from "../api/todolists-api";
import { authActions } from "../features/Login/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";

export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    }

  },
  selectors: {
    selectStatus: sliceState => sliceState.status,
    selectError: sliceState => sliceState.error,
    selectIsInitialized: sliceState => sliceState.isInitialized
  }
});

export const appReducer = slice.reducer;
export const appAction = slice.actions;
export const {selectStatus,selectError,selectIsInitialized} = slice.selectors
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }

    dispatch(appAction.setAppInitialized({ isInitialized: true }));
  });
};


