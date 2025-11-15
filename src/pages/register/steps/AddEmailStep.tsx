import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { messages } from './messages';

interface AddEmailStepProps {
  onEmailSubmitted: (email: string) => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AddEmailStep = ({ onEmailSubmitted }: AddEmailStepProps) => {
  const intl = useIntl();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(intl.formatMessage(messages.emailRequired));
      return;
    }
    if (!validateEmail(email)) {
      setError(intl.formatMessage(messages.emailInvalid));
      return;
    }
    onEmailSubmitted(email);
  };

  return (
    <VStack gap={4} w="100%">
      <Box as="form" onSubmit={handleSubmit} w="100%">
        <VStack gap={4}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={intl.formatMessage(messages.emailPlaceholder)}
            size="lg"
          />
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button type="submit" colorPalette="blue" size="lg" w="100%">
            {intl.formatMessage(messages.continue)}
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};
