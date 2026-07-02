import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { LegacyCategoryProvider } from './stores/legacy/categoryStore';
import { CategoryProvider } from './stores/categoryStore';
import { TransactionProvider } from './stores/transactionStore';
import { CategoryBudgetProvider } from './stores/categoryBudgetStore';
import { GamificationProvider } from './stores/gamificationStore';
import { ReactionProvider } from './stores/reactionStore';
import router from './router';

function App() {
  return (
    <UserProvider>
      <CategoryBudgetProvider>
        <GamificationProvider>
          <LegacyCategoryProvider>
            <TransactionProvider>
              <CategoryProvider>
                <ReactionProvider>
                  <RouterProvider router={router} />
                </ReactionProvider>
              </CategoryProvider>
            </TransactionProvider>
          </LegacyCategoryProvider>
        </GamificationProvider>
      </CategoryBudgetProvider>
    </UserProvider>
  );
}

export default App;
