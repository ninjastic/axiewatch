import { Stack, HStack, Tag, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { Axie, scholarSelector } from '../../recoil/scholars';

interface AxieInfoProps {
  axieData: Axie;
}

export const AxieInfo = ({ axieData }: AxieInfoProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(axieData.owner));

  return (
    <Stack fontSize="sm" align="center">
      <Text opacity={0.8}>#{axieData.id}</Text>
      <Text fontWeight="bold">{axieData.name}</Text>

      <HStack align="flex-start">
        <Tag>
          <Text textOverflow="ellipsis" overflowX="hidden" whiteSpace="nowrap" maxW="100px">
            {scholar.name}
          </Text>
        </Tag>
        <Tag>Breed: {axieData.breedCount} / 7</Tag>
        <Tag>{Math.round(axieData.quality * 100)}%</Tag>
      </HStack>
    </Stack>
  );
};
