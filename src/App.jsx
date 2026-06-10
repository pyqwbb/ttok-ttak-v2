import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './stores/userStore';
import { CategoryProvider } from './stores/categoryStore';
import { ReactionProvider } from './stores/reactionStore';
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
