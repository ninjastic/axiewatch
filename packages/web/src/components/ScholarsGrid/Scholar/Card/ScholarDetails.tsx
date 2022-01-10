import { Stack, Text } from '@chakra-ui/react';

import { EditScholarButton } from '../EditScholarButton';
import { ProfileButton } from '../ProfileButton';
import { PveStats } from '../PveStats';
import { ScholarAxies } from '../ScholarAxies';
import { SlpTrackingButton } from '../SlpTrackingButton';
import { BattlesButton } from '../../../BattlesButton';

interface ScholarDetailsProps {
  address: string;
}

export const ScholarDetails = ({ address }: ScholarDetailsProps): JSX.Element => {
  return (
    <Stack p={5} spacing={5}>
      <Stack align="flex-start">
        <Text fontWeight="bold" fontSize="sm">
          Daily Adventure
        </Text>
        <PveStats address={address} />
      </Stack>

      <ScholarAxies address={address} />

      <Stack>
        <SlpTrackingButton address={address} />
        <BattlesButton address={address} />
        <ProfileButton address={address} />
        <EditScholarButton address={address} />
      </Stack>
    </Stack>
  );
};
