import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { CategoryProvider } from './stores/categoryStore';
import { ReactionProvider } from './stores/reactionStore';
import router from './router';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <UserProvider>
      <CategoryProvider>
        <ReactionProvider>
          <RouterProvider router={router} />
        </ReactionProvider>
      </CategoryProvider>
    </UserProvider>
  </React.StrictMode>,
);
