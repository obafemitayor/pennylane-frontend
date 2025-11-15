import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  recommendedRecipes: {
    id: 'home.recommendedRecipes',
    defaultMessage:
      "Here's what you can cook now… and the ones you're just a few ingredients away from. 👌",
  },
  categoriesFilter: {
    id: 'home.categoriesFilter',
    defaultMessage: 'Filter by Category',
  },
  cuisinesFilter: {
    id: 'home.cuisinesFilter',
    defaultMessage: 'Filter by Cuisine',
  },
  manageUserIngredients: {
    id: 'home.manageUserIngredients',
    defaultMessage: 'Your Ingredients',
  },
  userNotFound: {
    id: 'home.userNotFound',
    defaultMessage: 'User not found',
  },
  noRecipesFound: {
    id: 'home.noRecipesFound',
    defaultMessage: 'No recipes found. Add more ingredients to your user ingredients!',
  },
  cook: {
    id: 'home.cook',
    defaultMessage: 'Cooking Time',
  },
  noCookingRequired: {
    id: 'home.noCookingRequired',
    defaultMessage: 'Does not require cooking',
  },
  prep: {
    id: 'home.prep',
    defaultMessage: 'Preparation Time',
  },
  rating: {
    id: 'home.rating',
    defaultMessage: 'Rating',
  },
  min: {
    id: 'home.min',
    defaultMessage: 'min',
  },
  has: {
    id: 'home.has',
    defaultMessage: 'Has',
  },
  missing: {
    id: 'home.missing',
    defaultMessage: 'Missing',
  },
  loading: {
    id: 'home.loading',
    defaultMessage: 'Loading...',
  },
  noCategories: {
    id: 'home.noCategories',
    defaultMessage: 'No categories available',
  },
  recipesNotFound: {
    id: 'home.recipesNotFound',
    defaultMessage: 'No recipes found',
  },
  canFullyCook: {
    id: 'home.canFullyCook',
    defaultMessage: "You're all set, you can cook this right now! 👌",
  },
  needFewIngredients: {
    id: 'home.needFewIngredients',
    defaultMessage:
      "You're super close to cooking this, you just need to grab {count} {count, plural, one {ingredient} other {ingredients}} 🤏",
  },
  needManyIngredients: {
    id: 'home.needManyIngredients',
    defaultMessage:
      'This one\'s a stretch, your pantry said "not today"😅. You\'re missing quite a few ingredients for this recipe.',
  },
});
