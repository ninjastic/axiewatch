import { Stat, StatLabel, StatNumber, StatHelpText, Skeleton } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { UseQueryResult } from 'react-query';
import { useMemo } from 'react';

import { Card } from '@components/Card';
import { APIScholarResponse } from '@src/types/api';
import { parseScholarData } from '@src/services/utils/parseScholarData';

interface TotalScholarsCardProps {
  data: UseQueryResult<APIScholarResponse>[];
  isLoading: boolean;
}

export const TotalScholarsCard = ({ data, isLoading }: TotalScholarsCardProps): JSX.Element => {
  const totalSlpDay = useMemo(
    () =>
      data
        .filter(result => result.isSuccess)
        .reduce((prev, currResult) => {
          const scholarData = parseScholarData({ data: currResult.data });

          return prev + scholarData.slpDay;
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
          {data.length} {pluralize('scholar', data.length)}
        </StatNumber>
        <Skeleton isLoaded={!isLoading} h="20px" w="235px" mt={1}>
          <StatHelpText>averaging {averageSlp} SLP/day</StatHelpText>
        </Skeleton>
      </Stat>
    </Card>
  );
};
