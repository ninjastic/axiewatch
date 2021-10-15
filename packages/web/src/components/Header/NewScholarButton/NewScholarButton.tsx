import { IconButton } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import { useCreateModal } from '../../../services/hooks/useCreateModal';
import { NewScholarModal } from './NewScholarModal';

export const NewScholarButton = (): JSX.Element => {
  const newScholarModal = useCreateModal({
    id: 'newScholarModal',
    title: () => 'New Scholar',
    content: () => <NewScholarModal />,
    size: '2xl',
  });

  return <IconButton aria-label="Add scholar" icon={<RiAddFill />} onClick={newScholarModal.onOpen} variant="ghost" />;
};
