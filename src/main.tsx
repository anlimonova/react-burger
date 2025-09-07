import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './services/store';

if (import.meta.env.MODE !== 'production') {
  (window as WindowWithStore).__APP_STORE__ = store;
}
import { HashRouter } from 'react-router-dom';

import { App } from '@components/app/app';

import type { WindowWithStore } from '@/global';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
