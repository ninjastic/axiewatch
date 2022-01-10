import { Collapse, HStack, Stack, Divider, Flex, Text, Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarFieldsAtom } from '../../../../recoil/scholars';
import { EditScholarButton } from '../EditScholarButton';
import { ProfileButton } from '../ProfileButton';
import { PveStats } from '../PveStats';
import { ScholarAxies } from '../ScholarAxies';
// import { SlpTrackingButton } from '../SlpTrackingButton';
import { SlpTrackingChart } from '../SlpTrackingChart';
import { BattlesButton } from '../../../BattlesButton';

interface CollapsedProps {
  address: string;
  show: boolean;
}

export const Collapsed = ({ address, show }: CollapsedProps): JSX.Element => {
  const scholarFields = useRecoilValue(scholarFieldsAtom);

  return (
    <Collapse in={show} animateOpacity>
      <Divider />

      <Flex align="center" minH="120px" w="100%">
        <Stack px={5} w="100%">
          <Flex align="center" justify="space-between">
            {!scholarFields.includes('adventureSlp') && (
              <Stack>
                <Text fontWeight="bold" fontSize="sm">
                  Daily Adventure
                </Text>
                <PveStats address={address} />
              </Stack>
            )}

            <Box minH="75px" minW="305px">
              <ScholarAxies address={address} shouldLoad={show} />
            </Box>

            <Box w="500px">{show && <SlpTrackingChart address={address} height={120} showYAxis={false} />}</Box>

            <HStack>
              <BattlesButton address={address} />
              <ProfileButton address={address} />
              <EditScholarButton address={address} />
            </HStack>
          </Flex>
        </Stack>
      </Flex>
    </Collapse>
  );
};
