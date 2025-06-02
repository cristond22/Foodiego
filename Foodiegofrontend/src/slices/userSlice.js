// src/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: localStorage.getItem("userName") || null,
  role: localStorage.getItem("userRole") || null,
  token: localStorage.getItem("token") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { name, role, token } = action.payload;
      state.name = name;
      state.role = role;
      state.token = token;
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);
      localStorage.setItem("token", token);
    },
    logoutUser: (state) => {
      state.name = null;
      state.role = null;
      state.token = null;
      localStorage.clear(); // or clear only relevant keys
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
