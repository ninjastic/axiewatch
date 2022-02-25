import { Button } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { modalSelector } from 'src/recoil/modal';
import { useCreateModal, UseCreateModalData } from './useCreateModal';

interface SimpleConfirmModalFooterProps {
  onConfirm(): void;
}

const SimpleConfirmModalFooter = ({ onConfirm }: SimpleConfirmModalFooterProps): JSX.Element => {
  const modal = useRecoilValue(modalSelector('confirmModal'));

  const handleConfirm = () => {
    onConfirm();
    modal.onClose();
  };

  return (
    <>
      <Button onClick={modal.onClose}>No</Button>

      <Button colorScheme="red" ml={3} onClick={handleConfirm}>
        Yes
      </Button>
    </>
  );
};

interface UseSimpleConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => any;
}

export const useSimpleConfirmModal = ({
  title,
  message,
  onConfirm,
}: UseSimpleConfirmModalProps): UseCreateModalData => {
  const confirmModal = useCreateModal({
    id: 'confirmModal',
    title,
    content: message,
    footer: <SimpleConfirmModalFooter onConfirm={onConfirm} />,
  });

  return confirmModal;
};
