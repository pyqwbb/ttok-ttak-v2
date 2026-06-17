import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './store/useUserStore';
import { CategoryProvider } from './store/useCategoryStore';
import { ReactionProvider } from './store/useReactionStore';
import router from './router';

function App() {
  return (
    <UserProvider>
      <CategoryProvider>
        <ReactionProvider>
          <RouterProvider router={router} />
        </ReactionProvider>
      </CategoryProvider>
    </UserProvider>
  );
}

export default App;
