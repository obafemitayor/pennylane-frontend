import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, VStack, HStack, Text } from '@chakra-ui/react';
import { UserIngredientPicker } from '../../../../components/userIngredientPicker/UserIngredientPicker';
import { userIngredientService } from '../../../../services/userIngredientService';
import { buildUserIngredientsPayload } from '../../../utils/utils';
import type { UserIngredientStepInput } from '../../../../types';
import { messages } from './messages';

interface AddIngredientProps {
  userId: number | undefined;
  onSave: () => void;
  onCancel: () => void;
}

export const AddIngredient: React.FC<AddIngredientProps> = ({
  userId,
  onSave,
  onCancel,
}) => {
  const intl = useIntl();
  const [userIngredients, setUserIngredients] = useState<UserIngredientStepInput[]>([
    {
      id: '1',
      selectedIngredient: null,
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!userId) {
      return;
    }
    setError(null);
    const { ingredientsInDB, ingredientsNotInDB } = buildUserIngredientsPayload(userIngredients);
    if (ingredientsInDB.length === 0 && ingredientsNotInDB.length === 0) {
      setError(intl.formatMessage(messages.atLeastOneIngredientRequired));
      return;
    }
    setIsLoading(true);
    try {
      await userIngredientService.addIngredients(userId, {
        ingredientsInDB,
        ingredientsNotInDB,
      });
      onSave();
    } catch (err: any) {
      console.error('Failed to save ingredients:', err);
      alert(err.response?.data?.error || intl.formatMessage(messages.failedToAdd));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap={4}>
      <UserIngredientPicker
        userIngredients={userIngredients}
        setUserIngredients={setUserIngredients}
      />
      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}
      <HStack gap={2}>
        <Button
          colorPalette="blue"
          size="lg"
          onClick={handleSave}
          loading={isLoading}
          disabled={isLoading}
        >
          {intl.formatMessage(messages.add)}
        </Button>
        <Button
          onClick={onCancel}
          variant="solid"
          bg="red.500"
          color="white"
          _hover={{ bg: 'red.600' }}
          size="lg"
        >
          {intl.formatMessage(messages.cancel)}
        </Button>
      </HStack>
    </VStack>
  );
};

