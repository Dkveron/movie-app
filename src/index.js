import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from '../src/components/App/App.js';

import { AppProvider } from './AppContext/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <App />
  </AppProvider>,
);
