import { Button } from '@chakra-ui/react';

import { useCreateModal, UseCreateModalData } from './useCreateModal';

interface useSimpleConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => any;
}

export const useSimpleConfirmModal = ({
  title,
  message,
  onConfirm,
}: useSimpleConfirmModalProps): UseCreateModalData => {
  const confirmModal = useCreateModal({
    id: 'confirmModal',
    title: () => title,
    content: () => message,
    footer: () => {
      const handleConfirm = () => {
        onConfirm();
        confirmModal.onClose();
      };

      return (
        <>
          <Button onClick={confirmModal.onClose}>No</Button>

          <Button colorScheme="red" ml={3} onClick={handleConfirm}>
            Yes
          </Button>
        </>
      );
    },
  });

  return confirmModal;
};
