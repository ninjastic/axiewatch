import { Button, Collapse } from '@chakra-ui/react';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import { modalSelector } from '../../../../recoil/modal';
import { scholarsMap } from '../../../../recoil/scholars';
import { useSimpleConfirmModal } from '../../../../services/hooks/useSimpleConfirmModal';

interface DangerSettingsCollapsedProps {
  isOpen: boolean;
}

export const DangerSettingsCollapsed = ({ isOpen }: DangerSettingsCollapsedProps): JSX.Element => {
  const { onClose } = useRecoilValue(modalSelector('preferencesModal'));

  const setScholars = useSetRecoilState(scholarsMap);

  const confirmDeleteModal = useSimpleConfirmModal({
    title: 'Confirm',
    message: 'Are you sure you want to delete all scholars?',
    onConfirm: () => {
      toast('All scholars deleted', { type: 'success' });
      setScholars([]);
      onClose();
    },
  });

  return (
    <Collapse in={isOpen}>
      <Button onClick={confirmDeleteModal.onOpen} leftIcon={<RiErrorWarningFill />} colorScheme="red">
        Delete all scholars
      </Button>
    </Collapse>
  );
};
