import { TAction } from "../actions";
import { actionType } from "../actionTypes";
import produce from "immer";
import { ICart } from "../../interfaces/cart";

export type TCart = {
  items: Array<ICart>;
};

const initialState: TCart = {
  items: [],
};

export const cartReducer = produce(
  (state: TCart = initialState, action: TAction): TCart => {
    switch (action.type) {
      case actionType.ADD_TO_CART:
        const { price, id, title, ownerPushToken } = action.payload;

        // check if product is already in cart
        const itemInCart = state.items.find((item) => item.id === id);

        if (itemInCart) {
          const index = state.items.findIndex((item) => item.id === id);
          if (index !== -1) {
            state.items[index].quantity = itemInCart.quantity + 1;
            state.items[index].sum = itemInCart.sum + itemInCart.productPrice;
          }
          return state;
        } else {
          const newCartItem = {
            id,
            productTitle: title,
            productPrice: price,
            sum: price,
            quantity: 1,
            ownerPushToken,
          };
          state.items.unshift(newCartItem);
          return state;
        }

      case actionType.CLEAR_CART:
        return initialState;

      case actionType.REMOVE_FROM_CART:
        const item = state.items.find((item) => item.id === action.payload);
        const index = state.items.findIndex(
          (item) => item.id === action.payload
        );
        if (item && item?.quantity > 1) {
          state.items[index].quantity = item.quantity - 1;
          state.items[index].sum = item.sum - item.productPrice;
        } else {
          state.items.splice(index, 1);
        }
        return state;
      default:
        return state;
    }
  }
);
