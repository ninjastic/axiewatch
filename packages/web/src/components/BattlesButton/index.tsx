import { Button } from '@chakra-ui/react';
import { RiSwordLine } from 'react-icons/ri';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { BattlesModal } from './BattlesModal';

interface BattlesButtonProps {
  address: string;
}

export const BattlesButton = ({ address }: BattlesButtonProps): JSX.Element => {
  const battlesModal = useCreateModal({
    id: `battlesModal:${address}`,
    title: 'Matches',
    content: <BattlesModal address={address} />,
    size: '6xl',
  });

  return (
    <Button leftIcon={<RiSwordLine />} onClick={battlesModal.onOpen}>
      Battles
    </Button>
  );
};
