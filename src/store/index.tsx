import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import colorReducer from "./reducers/colorReducer";

const persitConfig = {
  key: "root",
  storage,
  // blacklist: ["auth"], // Do not persist auth state
  whitelist: ["auth"], // Persist only the 'auth' slice of the state
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  categories: categoryReducer,
  color: colorReducer
});

const persistedReducer = persistReducer(persitConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({ serializableCheck: false });
    middlewares.prepend(thunk);
    return middlewares;
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

export default store;
