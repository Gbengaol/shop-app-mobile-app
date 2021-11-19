import { TAction } from "../actions";
import { actionType } from "../actionTypes";
import produce from "immer";
import { IAuth } from "../../interfaces/auth";
import * as SecureStore from "expo-secure-store";
import { clearLogoutTimer, autoLogoutUser } from "../actionCreators/index";

const initialState: IAuth = {
  token: "",
  userId: "",
};

export const authReducer = produce(
  (state: IAuth = initialState, action: TAction): IAuth => {
    switch (action.type) {
      case actionType.AUTHENTICATE_USER:
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        return state;

      case actionType.UNAUTHENTICATE_USER:
        clearLogoutTimer();
        SecureStore.deleteItemAsync("userData");
        return initialState;

      default:
        return state;
    }
  }
);
