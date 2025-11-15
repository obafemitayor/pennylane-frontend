import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Box,
  Card,
  Avatar,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  HStack,
  Button,
  Combobox,
  Select,
} from '@chakra-ui/react';
import { useListCollection } from '@ark-ui/react';
import { useUser } from '../../hooks/useUser';
import { useRecipes } from '../../hooks/useRecipes';
import { useCategories } from '../../hooks/useCategories';
import { useCuisines } from '../../hooks/useCuisines';
import { messages } from './messages';

interface CategoryFilterProps {
  categoryId: number | undefined;
  onCategoryChange: (categoryId: number | undefined) => void;
  categories: Array<{ id: number; name: string }>;
  onInputChange: (value: string) => void;
  loading?: boolean;
}

interface CuisineFilterProps {
  cuisineId: number | undefined;
  onCuisineChange: (cuisineId: number | undefined) => void;
  cuisines: Array<{ id: number; name: string }>;
}

interface ViewUserIngredientsProps {
  userId: number;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryId,
  onCategoryChange,
  categories,
  onInputChange,
  loading,
}) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState<string>('');
  const { collection, set: setCollection } = useListCollection<{ value: string; label: string }>({
    initialItems: [],
  });

  useEffect(() => {
    setCollection([
      { value: '', label: intl.formatMessage(messages.categoriesFilter) },
      ...categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })),
    ]);
  }, [categories, intl, setCollection]);

  useEffect(() => {
    if (!categoryId) {
      setInputValue('');
      return;
    }
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    if (selectedCategory) {
      setInputValue(selectedCategory.name);
    }
  }, [categoryId, categories]);

  const handleInputValueChange = (e: { inputValue: string }) => {
    setInputValue(e.inputValue);
    onInputChange(e.inputValue);
  };

  const handleValueChange = (e: { value: string | string[] }) => {
    const selectedValue = Array.isArray(e.value) ? e.value[0] : e.value;
    if (selectedValue === '') {
      onCategoryChange(undefined);
      setInputValue('');
      return;
    }
    onCategoryChange(selectedValue ? Number(selectedValue) : undefined);
  };

  return (
    <Box maxW="200px">
      <Combobox.Root
        collection={collection}
        value={categoryId ? [categoryId.toString()] : []}
        onInputValueChange={handleInputValueChange}
        onValueChange={handleValueChange}
      >
        <Combobox.Control bg="white">
          <Combobox.Input
            placeholder={intl.formatMessage(messages.categoriesFilter)}
            value={inputValue}
            color="gray.900"
            bg="white"
          />
          {loading && (
            <Combobox.IndicatorGroup>
              <Spinner size="sm" />
            </Combobox.IndicatorGroup>
          )}
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            {categories.length === 0 && !loading && (
              <Combobox.Empty>{intl.formatMessage(messages.noCategories)}</Combobox.Empty>
            )}
            {categories.length > 0 && (
              <Combobox.ItemGroup>
                <Combobox.Item key="all" item="">
                  {intl.formatMessage(messages.categoriesFilter)}
                </Combobox.Item>
                {categories.map((cat) => (
                  <Combobox.Item key={cat.id} item={cat.id.toString()}>
                    {cat.name}
                  </Combobox.Item>
                ))}
              </Combobox.ItemGroup>
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </Box>
  );
};

const CuisineFilter: React.FC<CuisineFilterProps> = ({ cuisineId, onCuisineChange, cuisines }) => {
  const intl = useIntl();

  const selectItems = useMemo(
    () => [
      { value: '', label: intl.formatMessage(messages.cuisinesFilter) },
      ...cuisines.map((cuisine) => ({ value: cuisine.id.toString(), label: cuisine.name })),
    ],
    [cuisines, intl]
  );

  const { collection, set: setCollection } = useListCollection({
    initialItems: selectItems,
  });

  useEffect(() => {
    setCollection(selectItems);
  }, [selectItems, setCollection]);

  const selectedCuisine = cuisines.find((cuisine) => cuisine.id === cuisineId);
  const selectedValue = selectedCuisine ? selectedCuisine.id.toString() : '';

  return (
    <Box minW="200px" maxW="250px">
      <Select.Root
        collection={collection}
        value={selectedValue ? [selectedValue] : []}
        onValueChange={(e) => {
          const selectedValue = Array.isArray(e.value) ? e.value[0] : e.value;
          if (selectedValue === '') {
            onCuisineChange(undefined);
          } else {
            onCuisineChange(selectedValue ? Number(selectedValue) : undefined);
          }
        }}
      >
        <Select.HiddenSelect />
        <Select.Control bg="white" color="gray.900">
          <Select.Trigger bg="white" color="gray.900">
            <Select.ValueText
              placeholder={intl.formatMessage(messages.cuisinesFilter)}
              color="gray.900"
            />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {selectItems.map((item) => (
              <Select.Item key={item.value || 'all'} item={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Box>
  );
};

const ViewUserIngredients: React.FC<ViewUserIngredientsProps> = ({ userId }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(`/users/${userId}/user-ingredients`)}
      variant="solid"
      colorPalette="gray"
      color="white"
    >
      {intl.formatMessage(messages.manageUserIngredients)}
    </Button>
  );
};

const getRecipeBadgeInfo = (
  missingCount: number | undefined | null,
  intl: ReturnType<typeof useIntl>
): { bgColor: string; message: string } => {
  const count = missingCount || 0;
  const category = count === 0 ? 'none' : count <= 5 ? 'few' : 'many';
  switch (category) {
    case 'none':
      return {
        bgColor: 'green.500',
        message: intl.formatMessage(messages.canFullyCook),
      };
    case 'few':
      return {
        bgColor: 'orange.500',
        message: intl.formatMessage(messages.needFewIngredients, { count }),
      };
    case 'many':
      return {
        bgColor: 'red.500',
        message: intl.formatMessage(messages.needManyIngredients),
      };
  }
};

export const Home: React.FC = () => {
  const intl = useIntl();
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { user, loading: userLoading, fetchUserByEmail } = useUser();
  const { recipes, loading: recipesLoading, getMostRelevantRecipes } = useRecipes();
  const { categories, loading: categoriesLoading, searchCategories } = useCategories();
  const { cuisines, loading: cuisinesLoading } = useCuisines();
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [cuisineId, setCuisineId] = useState<number | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  useEffect(() => {
    if (email) {
      fetchUserByEmail(email);
    }
  }, [email, fetchUserByEmail]);

  useEffect(() => {
    if (user) {
      getMostRelevantRecipes(user.id, {
        categoryId,
        cuisineId,
      });
      setCurrentPage(1);
    }
  }, [user, categoryId, cuisineId, getMostRelevantRecipes]);

  const handleRecipeClick = (recipeId: number) => {
    if (user) {
      navigate(`/users/${user.id}/recipes/${recipeId}`);
    }
  };

  if (userLoading || recipesLoading || cuisinesLoading) {
    return (
      <Container centerContent>
        <Spinner size="xl" mt={8} />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container centerContent>
        <Text mt={8}>{intl.formatMessage(messages.userNotFound)}</Text>
      </Container>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <Container centerContent>
        <Text mt={8}>{intl.formatMessage(messages.recipesNotFound)}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading>{intl.formatMessage(messages.recommendedRecipes)}</Heading>

        <HStack gap={4} justify="space-between">
          <HStack gap={4}>
            <CategoryFilter
              categoryId={categoryId}
              onCategoryChange={setCategoryId}
              categories={categories}
              onInputChange={searchCategories}
              loading={categoriesLoading}
            />
            <CuisineFilter
              cuisineId={cuisineId}
              onCuisineChange={setCuisineId}
              cuisines={cuisines}
            />
          </HStack>
          <ViewUserIngredients userId={user.id} />
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {currentRecipes.map((recipe) => {
            const { bgColor: badgeBgColor, message: badgeMessage } = getRecipeBadgeInfo(
              recipe.total_ingredients_missing_for_recipe,
              intl
            );
            return (
              <Card.Root
                key={recipe.id}
                cursor="pointer"
                onClick={() => handleRecipeClick(recipe.id)}
                _hover={{ shadow: 'md' }}
                transition="all 0.2s"
              >
                <Card.Body gap={2}>
                  <Avatar.Root size="lg" shape="rounded">
                    {recipe.image_url && <Avatar.Image src={recipe.image_url} alt={recipe.name} />}
                    <Avatar.Fallback name={recipe.name} />
                  </Avatar.Root>
                  <Card.Title mt={2}>{recipe.name}</Card.Title>
                  <Card.Description>
                    <VStack align="start" gap={1}>
                      {recipe.cook_time != null && (
                        <Text fontSize="sm">
                          {recipe.cook_time === 0
                            ? intl.formatMessage(messages.noCookingRequired)
                            : `${intl.formatMessage(messages.cook)}: ${recipe.cook_time} ${intl.formatMessage(messages.min)}`}
                        </Text>
                      )}
                      {recipe.prep_time && (
                        <Text fontSize="sm">
                          {intl.formatMessage(messages.prep)}: {recipe.prep_time}{' '}
                          {intl.formatMessage(messages.min)}
                        </Text>
                      )}
                      {recipe.ratings && (
                        <Text fontSize="sm">
                          {intl.formatMessage(messages.rating)}: {recipe.ratings}
                        </Text>
                      )}
                      <Box
                        bg={badgeBgColor}
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="md"
                        mt={2}
                        w="fit-content"
                        fontSize="sm"
                      >
                        {badgeMessage}
                      </Box>
                    </VStack>
                  </Card.Description>
                </Card.Body>
              </Card.Root>
            );
          })}
        </SimpleGrid>

        {totalPages > 1 && (
          <HStack justify="center" gap={2} mt={4}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="solid"
              colorPalette="blue"
            >
              Previous
            </Button>
            <Text>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="solid"
              colorPalette="blue"
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
};
