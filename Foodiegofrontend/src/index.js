import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Correct import
import { Provider } from 'react-redux';
import store from "./redux/store";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
