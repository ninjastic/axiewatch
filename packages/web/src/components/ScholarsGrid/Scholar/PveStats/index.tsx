import { Box, Text, Spinner } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from 'src/recoil/scholars';

interface PveStatsProps {
  address: string;
}

export const PveStats = ({ address }: PveStatsProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  if (!scholar.loaded) {
    return (
      <Box>
        <Spinner size="sm" />
      </Box>
    );
  }

  return <Text>{scholar.pveSlp} / 50</Text>;
};
