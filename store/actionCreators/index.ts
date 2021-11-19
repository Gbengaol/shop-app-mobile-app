import { Dispatch } from "redux";
import { actionType } from "../actionTypes";
import { TAction } from "../actions";
import { IProduct } from "../../interfaces/product";
import { IAuth } from "../../interfaces/auth";

export const addToCart = (payload: IProduct) => {
  return async (dispatch: Dispatch<TAction>) => {
    dispatch({
      type: actionType.ADD_TO_CART,
      payload,
    });
  };
};
export const clearCart = () => {
  return async (dispatch: Dispatch<TAction>) => {
    dispatch({
      type: actionType.CLEAR_CART,
    });
  };
};
export const removeFromCart = (payload: string) => {
  return async (dispatch: Dispatch<TAction>) => {
    dispatch({
      type: actionType.REMOVE_FROM_CART,
      payload,
    });
  };
};
export const authenticateUser = (payload: IAuth) => {
  return async (dispatch: Dispatch<TAction>) => {
    dispatch({
      type: actionType.AUTHENTICATE_USER,
      payload,
    });
  };
};
export const unauthenticateUser = () => {
  return async (dispatch: Dispatch<TAction>) => {
    dispatch({
      type: actionType.UNAUTHENTICATE_USER,
    });
  };
};

let timer: any;

export const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

export const autoLogoutUser = (payload: number) => {
  return async (dispatch: Dispatch<TAction>) => {
    timer = setTimeout(() => {
      dispatch({
        type: actionType.UNAUTHENTICATE_USER,
      });
    }, payload);
  };
};
