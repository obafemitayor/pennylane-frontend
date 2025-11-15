import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import { Register } from './pages/register/Register';
import { Home } from './pages/home/Home';
import { RecipeDetails } from './pages/recipeDetails/RecipeDetails';
import { UserIngredients } from './pages/userIngredients/UserIngredients';
import { localStorageUtils } from './utils/localStorage';

function App() {
  const [isChecking, setIsChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorageUtils.getUserEmail();
    setUserEmail(email);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userEmail ? (
            <Navigate to={`/home/${userEmail}`} replace />
          ) : (
            <Register />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/home/:email" element={<Home />} />
      <Route path="/users/:userId/recipes/:recipeId" element={<RecipeDetails />} />
      <Route path="/users/:userId/user-ingredients" element={<UserIngredients />} />
    </Routes>
  );
}

export default App;
