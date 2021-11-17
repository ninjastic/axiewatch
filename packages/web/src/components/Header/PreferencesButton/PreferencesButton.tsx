import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { AiOutlineSetting } from 'react-icons/ai';

import { useCreateModal } from '../../../services/hooks/useCreateModal';
import { PreferencesModal } from './PreferencesModal';

export const PreferencesButton = ({ ...rest }: Omit<IconButtonProps, 'aria-label'>): JSX.Element => {
  const preferencesModal = useCreateModal({
    id: 'preferencesModal',
    title: 'Preferences',
    content: <PreferencesModal />,
    size: '6xl',
  });

  return (
    <IconButton
      icon={<AiOutlineSetting />}
      onClick={preferencesModal.onOpen}
      variant="ghost"
      aria-label="Preferences"
      {...rest}
    />
  );
};
