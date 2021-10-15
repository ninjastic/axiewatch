import { Stack, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';
import { EditScholarButton } from '../EditScholarButton/EditScholarButton';
import { ProfileButton } from '../ProfileButton';
import { PveStats } from '../PveStats';
import { ScholarAxies } from '../ScholarAxies';
import { SlpTrackingButton } from '../SlpTrackingButton';
import { BattlesButton } from '../../../BattlesButton';

interface ScholarDetailsProps {
  address: string;
}

export function ScholarDetails({ address }: ScholarDetailsProps) {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <Stack p={5} spacing={5}>
      <Stack align="flex-start">
        <Text fontWeight="bold">Daily Adventure</Text>
        <PveStats address={address} />
      </Stack>

      <ScholarAxies address={address} />

      <Stack>
        <SlpTrackingButton address={scholar.address} />
        <BattlesButton address={scholar.address} />
        <ProfileButton address={scholar.address} />
        <EditScholarButton address={address} />
      </Stack>
    </Stack>
  );
}
