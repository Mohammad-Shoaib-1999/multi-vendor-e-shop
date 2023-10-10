import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import Store from './redux/store';



const root = document.getElementById('root');
const rootElement = (
  <Provider store={Store}>
    {console.count("Index.js rendered!")}
    <App />
  </Provider>
);
const rootContainer = ReactDOM.createRoot(root);
rootContainer.render(rootElement);
