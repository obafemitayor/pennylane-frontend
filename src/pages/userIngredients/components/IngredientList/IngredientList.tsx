import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Table,
  HStack,
  IconButton,
  Text,
  Button,
  Dialog,
  VStack,
} from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { UserIngredientPicker } from '../../../../components/userIngredientPicker/UserIngredientPicker';
import { useUserIngredients } from '../../../../hooks/useUserIngredients';
import type { UserIngredient, UserIngredientStepInput } from '../../../../types';
import { messages } from './messages';

interface IngredientListProps {
  userId: number | undefined;
  userIngredientsList: UserIngredient[];
}

interface EditIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: UserIngredient | null;
  userId: number | undefined;
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  userId,
}) => {
  const intl = useIntl();
  const { updateIngredient, loading } = useUserIngredients(userId);
  const [userIngredients, setUserIngredients] = useState<UserIngredientStepInput[]>([]);

  React.useEffect(() => {
    if (ingredient) {
      setUserIngredients([{
        id: ingredient.id.toString(),
        selectedIngredient: {
          id: ingredient.ingredient_id,
          name: ingredient.ingredient?.name || '',
        },
      }]);
    } else {
      setUserIngredients([]);
    }
  }, [ingredient]);

  const handleSave = async () => {
    if (!ingredient) {
      return;
    }
    const updatedUserIngredient = userIngredients.find(ui => ui.id === ingredient.id.toString());
    if (!updatedUserIngredient?.selectedIngredient) {
      return;
    }
    const ingredientPayload = {
      id: updatedUserIngredient.selectedIngredient.id,
      name: updatedUserIngredient.selectedIngredient.name,
    };

    try {
      await updateIngredient(ingredient.id, ingredientPayload);
      onClose();
      window.location.reload();
    } catch (err: any) {
      alert(err.message || intl.formatMessage(messages.failedToUpdate));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => {
      if (!details.open) {
        onClose();
      }
    }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{intl.formatMessage(messages.editIngredient)}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={4}>
              <UserIngredientPicker
                userIngredients={userIngredients}
                setUserIngredients={setUserIngredients}
                allowMultiple={false}
              />
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack gap={2}>
              <Button
                onClick={handleSave}
                variant="solid"
                bg="black"
                color="white"
                _hover={{ bg: 'gray.800' }}
                loading={loading}
                disabled={loading}
              >
                {intl.formatMessage(messages.saveChanges)}
              </Button>
              <Button
                onClick={onClose}
                variant="solid"
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                disabled={loading}
              >
                {intl.formatMessage(messages.cancel)}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export const IngredientList: React.FC<IngredientListProps> = ({
  userId,
  userIngredientsList,
}) => {
  const intl = useIntl();
  const { deleteIngredient, loading } = useUserIngredients(userId);
  const [editingIngredient, setEditingIngredient] = useState<UserIngredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (ingredient: UserIngredient) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
  };

  const handleDelete = async (ingredientId: number) => {
    if (!window.confirm(intl.formatMessage(messages.confirmDelete))) {
      return;
    }
    try {
      await deleteIngredient(ingredientId);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || intl.formatMessage(messages.failedToDelete));
    }
  };

  if (userIngredientsList.length === 0) {
    return <Text>{intl.formatMessage(messages.noIngredients)}</Text>;
  }

  return (
    <>
      <Box overflowX="auto">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                {intl.formatMessage(messages.ingredientName)}
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                {intl.formatMessage(messages.actions)}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {userIngredientsList.map((userIngredient) => (
              <Table.Row key={userIngredient.id}>
                <Table.Cell>
                  {userIngredient.ingredient?.name || ''}
                </Table.Cell>
                <Table.Cell>
                  <HStack>
                    <IconButton
                      aria-label={intl.formatMessage(messages.editIngredient)}
                      onClick={() => handleEdit(userIngredient)}
                      size="sm"
                    >
                      <MdEdit aria-hidden="true" />
                    </IconButton>
                    <IconButton
                      aria-label={intl.formatMessage(messages.deleteIngredient)}
                      onClick={() => handleDelete(userIngredient.id)}
                      size="sm"
                      colorPalette="red"
                      loading={loading}
                      disabled={loading}
                    >
                      <MdDelete aria-hidden="true" />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <EditIngredientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ingredient={editingIngredient}
        userId={userId}
      />
    </>
  );
};

