import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { CategoryProvider } from './stores/categoryStore';
import { CategoryBudgetProvider } from './stores/categoryBudgetStore';
import { ReactionProvider } from './stores/reactionStore';
import router from './router';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <UserProvider>
      <CategoryBudgetProvider>
        <CategoryProvider>
          <ReactionProvider>
            <RouterProvider router={router} />
          </ReactionProvider>
        </CategoryProvider>
      </CategoryBudgetProvider>
    </UserProvider>
  </React.StrictMode>,
);
