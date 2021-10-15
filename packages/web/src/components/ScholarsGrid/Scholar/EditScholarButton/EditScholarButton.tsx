import { Button } from '@chakra-ui/react';
import { BsPencilSquare } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';
import { useCreateModal } from '../../../../services/hooks/useCreateModal';
import { EditScholarModal } from './EditScholarModal';

interface EditScholarButtonParams {
  address: string;
}

export function EditScholarButton({ address }: EditScholarButtonParams) {
  const scholar = useRecoilValue(scholarSelector(address));

  const editScholarModal = useCreateModal({
    id: 'editScholarModal',
    title: () => 'Edit scholar',
    size: 'lg',
    content: () => <EditScholarModal name={scholar.name} address={address} />,
  });

  return (
    <Button
      aria-label="Edit scholar"
      leftIcon={<BsPencilSquare />}
      onClick={e => {
        e.stopPropagation();
        editScholarModal.onOpen();
      }}
    >
      Edit
    </Button>
  );
}
