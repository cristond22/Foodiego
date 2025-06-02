// redux/reducers/userReducer.js

const initialState = {
    name: null,
    role: null,
    token: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOGIN_USER":
        return {
          ...state,
          name: action.payload.name,
          role: action.payload.role,
          token: action.payload.token,
        };
  
      case "LOGOUT_USER":
        return initialState;
  
      default:
        return state;
    }
  };
  
  export default userReducer;
  