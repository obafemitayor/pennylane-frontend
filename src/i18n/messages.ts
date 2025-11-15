import { messages as registerMessages } from '../pages/register/messages';
import { messages as emailStepMessages } from '../pages/register/steps/messages';
import { messages as userIngredientPickerMessages } from '../components/userIngredientPicker/messages';
import { messages as homeMessages } from '../pages/home/messages';
import { messages as recipeDetailsMessages } from '../pages/recipeDetails/messages';
import { messages as userIngredientsPageMessages } from '../pages/userIngredients/messages';
import { messages as addIngredientMessages } from '../pages/userIngredients/components/AddIngredient/messages';
import { messages as ingredientListMessages } from '../pages/userIngredients/components/IngredientList/messages';

export const allMessages = {
  en: {
    ...registerMessages,
    ...emailStepMessages,
    ...userIngredientPickerMessages,
    ...homeMessages,
    ...recipeDetailsMessages,
    ...userIngredientsPageMessages,
    ...addIngredientMessages,
    ...ingredientListMessages,
  },
};
