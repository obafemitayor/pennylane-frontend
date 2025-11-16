import { Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './pages/register/Register';
import { Recipes } from './pages/recipes/Recipes';
import { RecipeDetails } from './pages/recipeDetails/RecipeDetails';
import { UserIngredients } from './pages/userIngredients/UserIngredients';
import { localStorageUtils } from './utils/localStorage';

function App() {
  const userEmail = localStorageUtils.getUserEmail();

  return (
    <Routes>
      <Route
        path="/"
        element={userEmail ? <Navigate to={`/home/${userEmail}`} replace /> : <Register />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/home/:email" element={<Recipes />} />
      <Route path="/users/:userId/recipes/:recipeId" element={<RecipeDetails />} />
      <Route path="/users/:userId/user-ingredients" element={<UserIngredients />} />
    </Routes>
  );
}

export default App;
