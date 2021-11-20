import { Button } from '@chakra-ui/react';
import { BsFillPersonPlusFill } from 'react-icons/bs';

import { useCreateModal } from '../../../services/hooks/useCreateModal';
import { NewScholarModal } from './NewScholarModal';

export const NewScholarButton = (): JSX.Element => {
  const newScholarModal = useCreateModal({
    id: 'newScholarModal',
    title: 'New Scholar',
    content: <NewScholarModal />,
    size: '2xl',
  });

  return (
    <Button leftIcon={<BsFillPersonPlusFill />} onClick={newScholarModal.onOpen}>
      New Scholar
    </Button>
  );
};
