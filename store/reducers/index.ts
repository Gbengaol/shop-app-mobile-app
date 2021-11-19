import { combineReducers } from "redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cartReducer } from "./cartReducer";
import { authReducer } from "./authReducer";

const persistWithConfig = {
  key: "root",
  storage: AsyncStorage,
  transforms: [
    encryptTransform({
      secretKey: "this_is_actually_a_very_secretive_password",
      onError: function (error) {
        console.log(error);
      },
    }),
  ],
};

const reducers = combineReducers({
  cart: cartReducer,
  auth: authReducer,
});

export default reducers;

export type TRootState = ReturnType<typeof reducers>;
