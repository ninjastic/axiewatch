import { Button, useDisclosure } from '@chakra-ui/react';
import { FiKey } from 'react-icons/fi';

import { ImportSeedModal } from './ImportSeedModal';

export function ImportSeedButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} leftIcon={<FiKey />}>
        Seed
      </Button>

      <ImportSeedModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
