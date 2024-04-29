import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "../../api/todolists-api";
import { AppRootStateType, AppThunk } from "../../app/store";
import { appAction } from "../../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistAction } from "features/TodolistsList/todolists-reducer";


const slice = createSlice({
  name: "task",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      const task = state[action.payload.todolistId];
      const index = task.findIndex(el => el.id === action.payload.taskId);
      if (index !== -1) {
        task.splice(index, 1);
      }
    },
    addTask(state, action: PayloadAction<{ task: TaskType }>) {
      const task = state[action.payload.task.todoListId];
      task.unshift(action.payload.task);
    },
    updateTask(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
      const task = state[action.payload.todolistId];
      const index = task.findIndex(el => el.id === action.payload.taskId);
      if (index === -1) {
        task[index] = { ...task[index], ...action.payload.model };
      }
    },
    setTasks(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks;
    }
  },
   extraReducers: builder => {
    builder.addCase(todolistAction.addTodolist,(state,action)=>{

    })
  }
});

export const tasksReducer = slice.reducer;
export const taskAction = slice.actions;

export const _tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return { ...state, [action.todolistId]: state[action.todolistId].filter((t) => t.id != action.taskId) };
    case "ADD-TASK":
      return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, ...action.model } : t
        )
      };
    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };
    case "REMOVE-TODOLIST":
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    case "SET-TODOLISTS": {
      const copyState = { ...state };
      action.todolists.forEach((tl: any) => {
        copyState[tl.id] = [];
      });
      return copyState;
    }
    case "SET-TASKS":
      return { ...state, [action.todolistId]: action.tasks };
    default:
      return state;
  }
};

// actions

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId }) as const;

// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
  dispatch(appAction.setAppStatus({ status: "loading" }));
  todolistsAPI.getTasks(todolistId).then((res) => {
    const tasks = res.data.items;
    dispatch(setTasksAC(tasks, todolistId));
    dispatch(appAction.setAppStatus({ status: "succeeded" }));
  });
};
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch) => {
  todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
    const action = removeTaskAC(taskId, todolistId);
    dispatch(action);
  });
};
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
    (dispatch) => {
      dispatch(appAction.setAppStatus({ status: "loading" }));
      todolistsAPI
        .createTask(todolistId, title)
        .then((res) => {
          if (res.data.resultCode === 0) {
            const task = res.data.data.item;
            const action = addTaskAC(task);
            dispatch(action);
            dispatch(appAction.setAppStatus({ status: "succeeded" }));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
      const state = getState();
      const task = state.tasks[todolistId].find((t) => t.id === taskId);
      if (!task) {
        //throw new Error("task not found in the state");
        console.warn("task not found in the state");
        return;
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
      };

      todolistsAPI
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === 0) {
            const action = updateTaskAC(taskId, domainModel, todolistId);
            dispatch(action);
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
type ActionsType = any

