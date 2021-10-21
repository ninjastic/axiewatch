import { Collapse, HStack, Stack, Divider, Flex, Text, Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarFieldsAtom, scholarSelector } from '../../../../recoil/scholars';
import { EditScholarButton } from '../EditScholarButton/EditScholarButton';
import { ProfileButton } from '../ProfileButton';
import { PveStats } from '../PveStats';
import { ScholarAxies } from '../ScholarAxies';
import { SlpTrackingButton } from '../SlpTrackingButton';
import { BattlesButton } from '../../../BattlesButton';

interface CollapsedProps {
  address: string;
  show: boolean;
}

export const Collapsed = ({ address, show }: CollapsedProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const scholarFields = useRecoilValue(scholarFieldsAtom);

  return (
    <Collapse in={show} animateOpacity>
      <Divider />

      <Flex align="center" minH="80px" w="100%">
        <Stack px={5} w="100%">
          <Flex align="center" justify="space-between">
            <HStack spacing={10}>
              {!scholarFields.includes('adventureSlp') && (
                <Stack>
                  <Text fontWeight="bold">Daily Adventure</Text>
                  <PveStats address={address} shouldLoad={show} />
                </Stack>
              )}
              <Box minH="75px">
                <ScholarAxies address={address} shouldLoad={show} />
              </Box>
            </HStack>

            <HStack>
              <BattlesButton address={scholar.address} />
              <SlpTrackingButton address={scholar.address} />
              <ProfileButton address={scholar.address} />
              <EditScholarButton address={address} />
            </HStack>
          </Flex>
        </Stack>
      </Flex>
    </Collapse>
  );
};
