import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { LegacyCategoryProvider } from './stores/legacy/categoryStore';
import { CategoryProvider } from './stores/categoryStore';
import { TransactionProvider } from './stores/transactionStore';
import { CategoryBudgetProvider } from './stores/categoryBudgetStore';
import { ReactionProvider } from './stores/reactionStore';
import router from './router';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <UserProvider>
      <CategoryBudgetProvider>
        <LegacyCategoryProvider>
          <TransactionProvider>
            <CategoryProvider>
              <ReactionProvider>
                <RouterProvider router={router} />
              </ReactionProvider>
            </CategoryProvider>
          </TransactionProvider>
        </LegacyCategoryProvider>
      </CategoryBudgetProvider>
    </UserProvider>
  </React.StrictMode>,
);
