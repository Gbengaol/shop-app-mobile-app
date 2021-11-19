import { IProduct } from "../../interfaces/product";
import { actionType } from "../actionTypes";
import { IOrder } from "../../interfaces/order";
import { IAuth } from "../../interfaces/auth";
export interface AddToCart {
  type: actionType.ADD_TO_CART;
  payload: IProduct;
}
export interface RemoveFromCart {
  type: actionType.REMOVE_FROM_CART;
  payload: string;
}
export interface ClearCart {
  type: actionType.CLEAR_CART;
}
export interface AuthenticateUser {
  type: actionType.AUTHENTICATE_USER;
  payload: IAuth;
}
export interface UnauthenticateUser {
  type: actionType.UNAUTHENTICATE_USER;
}
export interface AutoLogoutUser {
  type: actionType.AUTO_LOGOUT_USER;
}

export type TAction =
  | AddToCart
  | RemoveFromCart
  | ClearCart
  | AuthenticateUser
  | UnauthenticateUser
  | AutoLogoutUser;
