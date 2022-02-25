import { Stat, StatLabel, StatNumber, StatHelpText, Skeleton } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { Card } from 'components/Card';
import { ScholarState, scholarsMap } from 'src/recoil/scholars';

interface TotalScholarsCardProps {
  data: ScholarState[];
  isLoading: boolean;
}

export const TotalScholarsCard = ({ data, isLoading }: TotalScholarsCardProps): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const activeScholars = useMemo(() => scholars.filter(scholar => !scholar.inactive), [scholars]);

  const totalSlpDay = useMemo(
    () =>
      data
        .filter(dataScholar => activeScholars.find(activeScholar => activeScholar.address === dataScholar.address))
        .reduce((prev, currResult) => {
          return prev + currResult.slpDay;
        }, 0),
    [activeScholars, data]
  );

  const averageSlp = useMemo(
    () => (activeScholars.length ? Math.floor(totalSlpDay / activeScholars.length) : 0),
    [activeScholars.length, totalSlpDay]
  );

  return (
    <Card p={3}>
      <Stat>
        <StatLabel>You currently have</StatLabel>
        <StatNumber>
          {activeScholars.length} {pluralize('scholar', activeScholars.length)}
        </StatNumber>
        <Skeleton isLoaded={!isLoading} h="20px" w="235px" mt={1}>
          <StatHelpText>averaging {averageSlp} SLP/day</StatHelpText>
        </Skeleton>
      </Stat>
    </Card>
  );
};
