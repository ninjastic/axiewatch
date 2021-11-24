import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import { DangerSettingsCollapsed } from './DangerSettingsCollapsed';

export const DangerSettingsButton = (): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box textAlign="center">
      <Button rightIcon={isOpen ? <BsChevronUp /> : <BsChevronDown />} variant="ghost" onClick={onToggle}>
        Danger settings
      </Button>

      <Box pt={3}>
        <DangerSettingsCollapsed isOpen={isOpen} />
      </Box>
    </Box>
  );
};
