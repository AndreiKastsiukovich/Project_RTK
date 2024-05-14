import { useMemo } from "react";
import { bindActionCreators } from "redux";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksThunks } from "features/TodolistsList/tasks.reducer";
import { todolistsActions, todolistsThunks } from "features/TodolistsList/todolists.reducer";
import { authThunks } from "features/auth/auth.reducer";

const actionsAll = { ...tasksThunks, ...todolistsThunks, ...todolistsActions, ...authThunks };

type AllActions = typeof actionsAll;
type AllActionsBindDispatch = RemapActionCreators<AllActions>;

export const useActions = () => {
    const dispatch = useAppDispatch();

    return useMemo(() => bindActionCreators<AllActions, AllActionsBindDispatch>(actionsAll, dispatch), [dispatch]);
};

// Types
type RemapActionCreators<T extends Record<string, any>> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<ReturnType<T[K]>>;
}