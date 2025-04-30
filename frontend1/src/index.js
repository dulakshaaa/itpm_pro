import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//initialize React app entry point with strict mode

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
