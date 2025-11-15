import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Combobox,
  Field,
  Spinner,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useListCollection } from '@ark-ui/react';
import type { Ingredient, UserIngredientStepInput } from '../../types';
import { useIngredients } from '../../hooks/useIngredients';
import { messages } from './messages';

interface IngredientsSelectProps {
  inputId: string;
  value: string;
  collection: ReturnType<typeof useListCollection<{ value: string; label: string }>>['collection'];
  ingredients: Ingredient[];
  loading?: boolean;
  onInputChange: (id: string, value: string) => void;
  onIngredientSelect: (id: string, ingredient: Ingredient | null) => void;
}

interface UserIngredientPickerProps {
  userIngredients: UserIngredientStepInput[];
  setUserIngredients: React.Dispatch<React.SetStateAction<UserIngredientStepInput[]>>;
  allowMultiple?: boolean;
}

const parseValue = (name: string): string | null => {
  const match = name.match(/^Add "(.+)" as an ingredient$/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const parseIngredient = (ingredient: Ingredient): Ingredient => {
  const parsedIngredientName = parseValue(ingredient.name);
  if (parsedIngredientName) {
    return { id: null, name: parsedIngredientName };
  }
  return ingredient;
};

const IngredientsSelect: React.FC<IngredientsSelectProps> = ({
  inputId,
  value,
  collection,
  ingredients,
  loading = false,
  onInputChange,
  onIngredientSelect,
}) => {
  const intl = useIntl();

  const handleValueChange = (e: { value: string | string[] }) => {
    const selectedValue = Array.isArray(e.value) ? e.value[0] : e.value;
    const selectedIngredient = ingredients.find((ing) =>
      ing.id !== null ? ing.id.toString() === selectedValue : ing.name === selectedValue
    );
    if (selectedIngredient) {
      const parsedIngredient = parseIngredient(selectedIngredient);
      onInputChange(inputId, parsedIngredient.name);
    }
    onIngredientSelect(inputId, selectedIngredient || null);
  };

  return (
    <Box w="100%">
      <Combobox.Root
        collection={collection}
        value={[]}
        onInputValueChange={(e) => onInputChange(inputId, e.inputValue)}
        onValueChange={handleValueChange}
      >
        <Combobox.Control w="100%">
          <Combobox.Input
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            value={value}
            w="100%"
          />
          {loading && (
            <Combobox.IndicatorGroup>
              <Spinner size="sm" />
            </Combobox.IndicatorGroup>
          )}
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            {ingredients.length > 0 && (
              <Combobox.ItemGroup>
                {ingredients.map((ingredient) => {
                  const itemKey =
                    ingredient.id !== null ? ingredient.id.toString() : ingredient.name;
                  return (
                    <Combobox.Item key={itemKey} item={itemKey}>
                      {ingredient.name}
                    </Combobox.Item>
                  );
                })}
              </Combobox.ItemGroup>
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </Box>
  );
};

export const UserIngredientPicker: React.FC<UserIngredientPickerProps> = ({
  userIngredients,
  setUserIngredients,
  allowMultiple = true,
}) => {
  const intl = useIntl();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { ingredients, loading, searchIngredients, reset } = useIngredients();
  const { collection, set: setCollection } = useListCollection<{ value: string; label: string }>({
    initialItems: [],
  });

  useEffect(() => {
    setCollection(
      ingredients.map((ing) => ({
        value: ing.id !== null ? ing.id.toString() : ing.name,
        label: ing.name,
      }))
    );
  }, [ingredients, setCollection]);

  const handleInputChange = (id: string, value: string) => {
    const parsedValue = parseValue(value.trim()) || value;
    setInputValues((prev) => ({ ...prev, [id]: parsedValue }));
    const searchQuery = parsedValue.trim();
    if (!searchQuery) {
      reset();
      setCollection([]);
      setUserIngredients((prev) =>
        prev.map((input) => (input.id === id ? { ...input, selectedIngredient: null } : input))
      );
      return;
    }
    reset();
    setCollection([]);
    searchIngredients(searchQuery);
  };

  const handleIngredientSelect = (id: string, selectedIngredient: Ingredient | null) => {
    if (!selectedIngredient) {
      return;
    }
    const parsedIngredient = parseIngredient(selectedIngredient);
    setUserIngredients((prev) =>
      prev.map((input) =>
        input.id === id ? { ...input, selectedIngredient: parsedIngredient } : input
      )
    );
    reset();
  };

  const addUserIngredient = () => {
    const newId = Date.now().toString();
    setInputValues((prev) => ({ ...prev, [newId]: '' }));
    setUserIngredients((prev) => [...prev, { id: newId, selectedIngredient: null }]);
  };

  const removeUserIngredient = (id: string) => {
    setUserIngredients((prev) => prev.filter((input) => input.id !== id));
    setInputValues((prev) => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  return (
    <Container maxW="lg" centerContent>
      <Box w="100%" mt={8}>
        <VStack gap={6}>
          <Heading size="lg">{intl.formatMessage(messages.title)}</Heading>
          <Text fontSize="sm" color="gray.600" textAlign="left" whiteSpace="pre-line">
            {intl.formatMessage(messages.guideText)}
          </Text>

          <VStack gap={4} w="100%">
            {userIngredients.map((input) => (
              <Field.Root key={input.id} w="100%">
                <HStack gap={2}>
                  <Box flex={1} w="100%">
                    <IngredientsSelect
                      inputId={input.id}
                      value={
                        inputValues[input.id] !== undefined
                          ? inputValues[input.id]
                          : input.selectedIngredient?.name || ''
                      }
                      collection={collection}
                      ingredients={ingredients}
                      loading={loading}
                      onInputChange={handleInputChange}
                      onIngredientSelect={handleIngredientSelect}
                    />
                  </Box>
                  {allowMultiple && (
                    <IconButton
                      aria-label={intl.formatMessage(messages.removeIngredient)}
                      onClick={() => removeUserIngredient(input.id)}
                      bg="white"
                      color="red.500"
                      variant="ghost"
                      _hover={{ bg: 'gray.50', color: 'red.600' }}
                    >
                      <MdDelete />
                    </IconButton>
                  )}
                </HStack>
              </Field.Root>
            ))}

            {allowMultiple && (
              <HStack w="100%" justify="flex-end" mt={2}>
                <Button
                  onClick={addUserIngredient}
                  variant="solid"
                  bg="green.500"
                  color="white"
                  _hover={{ bg: 'green.600' }}
                  size="sm"
                >
                  {intl.formatMessage(messages.addAnotherIngredient)}
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};
