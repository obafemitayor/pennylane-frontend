import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import type { AxiosError } from 'axios';
import { Button, VStack, Text, Box, Heading } from '@chakra-ui/react';
import { AddEmailStep } from './steps/AddEmailStep';
import { UserIngredientPicker } from '../../components/userIngredientPicker/UserIngredientPicker';
import type { UserIngredientPickerInput } from '../../types';
import { userService } from '../../services/userService';
import { buildUserIngredientsPayload } from '../utils/utils';
import { localStorageUtils } from '../../utils/localStorage';
import { messages } from './messages';

export const Register: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'ingredients'>('email');
  const [email, setEmail] = useState('');
  const [userIngredients, setUserIngredients] = useState<UserIngredientPickerInput[]>([
    {
      id: '1',
      selectedIngredient: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmitted = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep('ingredients');
  };

  const registerUser = async () => {
    setError(null);
    const { ingredientsInDB, ingredientsNotInDB } = buildUserIngredientsPayload(userIngredients);
    if (ingredientsInDB.length === 0 && ingredientsNotInDB.length === 0) {
      setError(intl.formatMessage(messages.atLeastOneIngredientRequired));
      return;
    }
    setIsLoading(true);

    try {
      await userService.createUser(email, {
        ingredientsInDB,
        ingredientsNotInDB,
      });
      localStorageUtils.setUserEmail(email);
      navigate(`/home/${email}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      console.error('Failed to save ingredients:', err);
      alert(axiosError.response?.data?.error || intl.formatMessage(messages.registrationFailed));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      w="100%"
    >
      <Box maxW="lg" w="100%">
        {step === 'email' && (
          <VStack gap={6} w="100%" textAlign="center">
            <Heading size="lg">{intl.formatMessage(messages.welcome)}</Heading>
            <Text color="gray.600" fontSize="md" lineHeight="tall">
              {intl.formatMessage(messages.personalIntroduction)}
            </Text>
            <AddEmailStep onEmailSubmitted={handleEmailSubmitted} />
          </VStack>
        )}
        {step === 'ingredients' && (
          <VStack gap={4} w="100%">
            <Text color="gray.600" fontSize="md" lineHeight="tall">
              {intl.formatMessage(messages.addIngredientsMessage)}
            </Text>
            <UserIngredientPicker
              userIngredients={userIngredients}
              setUserIngredients={setUserIngredients}
            />
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button
              colorPalette="blue"
              size="lg"
              onClick={registerUser}
              loading={isLoading}
              w="100%"
            >
              {intl.formatMessage(messages.completeRegistration)}
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
};
