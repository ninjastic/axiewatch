import { Stack, HStack, Tag, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { parseAxieData } from '@src/services/utils/parseAxieData';
import { Axie, scholarSelector } from '../../recoil/scholars';

interface AxieInfoProps {
  axieData: Axie;
}

export const AxieInfo = ({ axieData }: AxieInfoProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(axieData.owner));

  const data = useMemo(() => parseAxieData(axieData), [axieData]);

  return (
    <Stack fontSize="sm" align="center">
      <Text opacity={0.9}>#{data?.id}</Text>
      <Text fontWeight="bold">{scholar?.name}</Text>

      <HStack align="flex-start">
        <Tag>
          <Text textOverflow="ellipsis" overflowX="hidden" whiteSpace="nowrap" maxW="100px">
            {data?.name}
          </Text>
        </Tag>
        <Tag>Breed: {data?.breedCount} / 7</Tag>
        <Tag>{Math.round(data?.quality * 100)}%</Tag>
      </HStack>
    </Stack>
  );
};
