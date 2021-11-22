import { Button } from '@chakra-ui/react';
import { RiDeleteBinLine } from 'react-icons/ri';

import { useCreateModal } from '../../../../services/hooks/useCreateModal';
import { ConfirmDeleteModalBody, ConfirmDeleteModalFooter } from './ConfirmDeleteModal';

interface ConfirmDeleteButtonProps {
  scholarAddress: string;
}

export const ConfirmDeleteButton = ({ scholarAddress }: ConfirmDeleteButtonProps): JSX.Element => {
  const confirmDeleteModal = useCreateModal({
    id: `confirmDeleteModal:${scholarAddress}`,
    title: 'Delete this scholar?',
    content: <ConfirmDeleteModalBody scholarAddress={scholarAddress} />,
    footer: <ConfirmDeleteModalFooter scholarAddress={scholarAddress} />,
    size: '2xl',
  });

  return (
    <Button leftIcon={<RiDeleteBinLine />} onClick={confirmDeleteModal.onOpen} colorScheme="red">
      Delete
    </Button>
  );
};
