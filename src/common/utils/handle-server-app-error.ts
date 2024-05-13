import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { BaseResponseType } from "common/types/common.types";

/**
 * Обрабатывает ошибки, полученные от сервера, и обновляет состояние приложения
 * @param data объект, содержащий данные, возвращенные сервером
 * @param dispatch функция-диспетчер Redux для отправки действий в хранилище
 * @param showGlobalError флаг, указывающий, нужно ли отображать глобальную ошибку
 * @returns void
 */

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showGlobalError:boolean = true) => {

  if(showGlobalError){
    dispatch(appActions.setAppError({error : data.messages.length ? data.messages[0] : "Some error occurred"}))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
