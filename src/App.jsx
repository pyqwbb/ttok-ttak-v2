import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { LegacyCategoryProvider } from './stores/legacy/categoryStore';
import { CategoryProvider } from './stores/categoryStore';
import { CategoryBudgetProvider } from './stores/categoryBudgetStore';
import { ReactionProvider } from './stores/reactionStore';
import router from './router';

function App() {
  return (
    <UserProvider>
      <CategoryBudgetProvider>
        <LegacyCategoryProvider>
          <CategoryProvider>
            <ReactionProvider>
              <RouterProvider router={router} />
            </ReactionProvider>
          </CategoryProvider>
        </LegacyCategoryProvider>
      </CategoryBudgetProvider>
    </UserProvider>
  );
}

export default App;
