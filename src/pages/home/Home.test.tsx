import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Home } from './Home';
import { useUser } from '../../hooks/useUser';
import { useRecipes } from '../../hooks/useRecipes';
import { useCategories } from '../../hooks/useCategories';
import { useCuisines } from '../../hooks/useCuisines';
import { renderWithProviders } from '../../test/testUtils';

vi.mock('../../hooks/useUser');
vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useCategories');
vi.mock('../../hooks/useCuisines');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ email: 'test@example.com' }),
    useNavigate: () => mockNavigate,
  };
});

const user = userEvent.setup();

describe('Home', () => {
  const mockFetchUserByEmail = vi.fn();
  const mockGetMostRelevantRecipes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 1, email: 'test@example.com' },
      loading: false,
      error: null,
      fetchUserByEmail: mockFetchUserByEmail,
    });
    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: [],
      loading: false,
      error: null,
      getMostRelevantRecipes: mockGetMostRelevantRecipes,
    });
    (useCategories as ReturnType<typeof vi.fn>).mockReturnValue({
      categories: [],
      loading: false,
      error: null,
    });
    (useCuisines as ReturnType<typeof vi.fn>).mockReturnValue({
      cuisines: [],
      loading: false,
      error: null,
    });
  });

  it('validates when an error occurred', () => {
    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: [],
      loading: false,
      error: 'Failed to fetch recipes',
      getMostRelevantRecipes: mockGetMostRelevantRecipes,
    });

    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
  });

  it('validates that the page displays with data', async () => {
    const mockRecipes = [
      {
        id: 1,
        name: 'Test Recipe',
        image_url: 'https://example.com/image.jpg',
        total_ingredients_user_has_for_recipe: 5,
        total_ingredients_missing_for_recipe: 2,
      },
    ];

    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: mockRecipes,
      loading: false,
      error: null,
      getMostRelevantRecipes: mockGetMostRelevantRecipes,
    });

    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    const recipeCard =
      screen.getByText('Test Recipe').closest('div[role]') ||
      screen.getByText('Test Recipe').parentElement?.parentElement;
    if (recipeCard) {
      await user.click(recipeCard as HTMLElement);
    }

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/users/1/recipes/1');
    });
  });

  it('tests pagination', async () => {
    const mockRecipes = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Recipe ${i + 1}`,
      image_url: 'https://example.com/image.jpg',
      total_ingredients_user_has_for_recipe: 5,
      total_ingredients_missing_for_recipe: 2,
    }));

    (useRecipes as ReturnType<typeof vi.fn>).mockReturnValue({
      recipes: mockRecipes,
      loading: false,
      error: null,
      getMostRelevantRecipes: mockGetMostRelevantRecipes,
    });

    renderWithProviders(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Recipe 1')).toBeInTheDocument();
      expect(screen.getByText('Recipe 10')).toBeInTheDocument();
      expect(screen.queryByText('Recipe 11')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Recipe 11')).toBeInTheDocument();
      expect(screen.getByText('Recipe 20')).toBeInTheDocument();
      expect(screen.queryByText('Recipe 1')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();

    const previousButton = screen.getByRole('button', { name: /previous/i });
    await user.click(previousButton);

    await waitFor(() => {
      expect(screen.getByText('Recipe 1')).toBeInTheDocument();
      expect(screen.queryByText('Recipe 11')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
  });
});
