// src/store.js
import { createStore } from "redux";

// Initial State
const initialState = {
  cart: [],
  user: {
    name: localStorage.getItem("userName") || null,
    role: localStorage.getItem("userRole") || null,
    token: localStorage.getItem("token") || null,
  },
};

// Reducer Function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, action.payload] };

    case "LOGIN_USER":
      const { name, role, token } = action.payload;
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);
      localStorage.setItem("token", token);
      return { ...state, user: { name, role, token } };

    case "LOGOUT_USER":
      localStorage.clear();
      return { ...state, user: { name: null, role: null, token: null } };

    default:
      return state;
  }
};

// ✅ Create Redux Store
const store = createStore(reducer);

export default store;
