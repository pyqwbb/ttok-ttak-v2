import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { CategoryProvider } from './stores/categoryStore';
import { TransactionProvider } from './stores/transactionStore';
import { CategoryBudgetProvider } from './stores/categoryBudgetStore';
import { GamificationProvider } from './stores/gamificationStore';
import router from './router';

function App() {
  return (
    <UserProvider>
      <CategoryBudgetProvider>
        <GamificationProvider>
            <TransactionProvider>
              <CategoryProvider>
                <RouterProvider router={router} />
              </CategoryProvider>
            </TransactionProvider>
        </GamificationProvider>
      </CategoryBudgetProvider>
    </UserProvider>
  );
}

export default App;
