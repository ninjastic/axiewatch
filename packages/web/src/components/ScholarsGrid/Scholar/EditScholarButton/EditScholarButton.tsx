import { Button, IconButton } from '@chakra-ui/react';
import { BsPencilSquare } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';
import { useCreateModal } from '../../../../services/hooks/useCreateModal';
import { EditScholarModal } from './EditScholarModal';

interface EditScholarButtonParams {
  address: string;
  size: string;
  onlyIcon?: boolean;
}

export const EditScholarButton = ({ address, size, onlyIcon = false }: EditScholarButtonParams): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  const editScholarModal = useCreateModal({
    id: 'editScholarModal',
    title: () => 'Edit scholar',
    size: 'lg',
    content: () => <EditScholarModal name={scholar.name} address={address} />,
  });

  return onlyIcon ? (
    <IconButton
      size={size || 'lg'}
      aria-label="Edit Scholar"
      icon={<BsPencilSquare />}
      onClick={e => {
        e.stopPropagation();
        editScholarModal.onOpen();
      }}
    />
  ) : (
    <Button
      aria-label="Edit scholar"
      size={size || 'lg'}
      leftIcon={<BsPencilSquare />}
      onClick={e => {
        e.stopPropagation();
        editScholarModal.onOpen();
      }}
    >
      Edit
    </Button>
  );
};
