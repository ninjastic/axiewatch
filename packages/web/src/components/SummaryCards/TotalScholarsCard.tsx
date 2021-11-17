import { Stat, StatLabel, StatNumber, StatHelpText, Skeleton } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { Card } from '@components/Card';
import { ParsedScholarData } from '@src/services/utils/parseScholarData';
import { scholarsMap } from '@src/recoil/scholars';

interface TotalScholarsCardProps {
  data: ParsedScholarData[];
  isLoading: boolean;
}

export const TotalScholarsCard = ({ data, isLoading }: TotalScholarsCardProps): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);

  const totalSlpDay = useMemo(
    () =>
      data.reduce((prev, currResult) => {
        return prev + currResult.slpDay;
      }, 0),
    [data]
  );

  const averageSlp = useMemo(
    () => (data.length ? Math.floor(totalSlpDay / data.length) : 0),
    [data.length, totalSlpDay]
  );

  return (
    <Card p={3}>
      <Stat>
        <StatLabel>You currently have</StatLabel>
        <StatNumber>
          {scholars.length} {pluralize('scholar', scholars.length)}
        </StatNumber>
        <Skeleton isLoaded={!isLoading} h="20px" w="235px" mt={1}>
          <StatHelpText>averaging {averageSlp} SLP/day</StatHelpText>
        </Skeleton>
      </Stat>
    </Card>
  );
};
