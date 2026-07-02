import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { CategoryProvider } from './stores/categoryStore';
import { CategoryBudgetProvider } from './stores/categoryBudgetStore';
import { ReactionProvider } from './stores/reactionStore';
import router from './router';

function App() {
  return (
    <UserProvider>
      <CategoryBudgetProvider>
        <CategoryProvider>
          <ReactionProvider>
            <RouterProvider router={router} />
          </ReactionProvider>
        </CategoryProvider>
      </CategoryBudgetProvider>
    </UserProvider>
  );
}

export default App;
