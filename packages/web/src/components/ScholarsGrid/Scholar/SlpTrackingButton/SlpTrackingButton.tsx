import { Box, Button, Stack, HStack, Text, Tooltip, IconButton } from '@chakra-ui/react';
import { AiOutlineBarChart } from 'react-icons/ai';
import { BiInfoCircle } from 'react-icons/bi';

import { useCreateModal } from '../../../../services/hooks/useCreateModal';
import { SlpTrackingChart } from '../SlpTrackingChart';

interface SlpTrackingButtonProps {
  address: string;
  onlyIcon?: boolean;
}

export const SlpTrackingButton = ({ address, onlyIcon = false }: SlpTrackingButtonProps): JSX.Element => {
  const slpTrackingModal = useCreateModal({
    id: `slpTrackingModal:${address}`,
    title: (
      <HStack>
        <Text fontWeight="bold">SLP Tracking</Text>
        <Tooltip label="The SLP tracking feature is in BETA. There are no guarantees that the data will be 100% correct at this early stage. Please report any inconsistence or bug.">
          <Box>
            <BiInfoCircle />
          </Box>
        </Tooltip>
      </HStack>
    ),
    content: (
      <Box minH="280px">
        <Stack py={4}>
          <SlpTrackingChart address={address} />
        </Stack>
      </Box>
    ),
    size: '3xl',
  });

  return onlyIcon ? (
    <IconButton
      size="sm"
      aria-label="Slp Tracking History"
      icon={<AiOutlineBarChart />}
      onClick={slpTrackingModal.onOpen}
    />
  ) : (
    <Button leftIcon={<AiOutlineBarChart />} onClick={slpTrackingModal.onOpen}>
      SLP Tracking
    </Button>
  );
};
