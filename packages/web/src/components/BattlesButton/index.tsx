import { Button } from '@chakra-ui/react';
import { RiSwordLine } from 'react-icons/ri';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { BattlesModal } from './BattlesModal';

interface BattlesButtonProps {
  address: string;
}

export function BattlesButton({ address }: BattlesButtonProps) {
  const battlesModal = useCreateModal({
    id: 'battlesModal',
    title: () => 'Matches',
    content: () => <BattlesModal address={address} />,
    size: '6xl',
  });

  return (
    <Button leftIcon={<RiSwordLine />} onClick={battlesModal.onOpen}>
      Battles
    </Button>
  );
}
