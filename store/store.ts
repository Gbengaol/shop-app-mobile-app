import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import thunk from "redux-thunk";

const middlewares = [thunk]; // All middlewares (no matter their number) go into this array

export const store = createStore(reducers, {}, applyMiddleware(...middlewares));
