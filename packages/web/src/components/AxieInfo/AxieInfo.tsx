import { Stack, HStack, Tag, Text, Icon } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { parseAxieData } from 'src/services/utils/parseAxieData';
import { Axie, scholarSelector } from '../../recoil/scholars';
import {
  AquaticIcon,
  BeastIcon,
  BirdIcon,
  BugIcon,
  DawnIcon,
  DuskIcon,
  MechIcon,
  PlantIcon,
  ReptileIcon,
} from '../Icons/AxieIcon';

interface AxieInfoProps {
  axieData: Axie;
}

export const AxieInfo = ({ axieData }: AxieInfoProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(axieData.owner));

  const data = useMemo(() => parseAxieData(axieData), [axieData]);

  const icons = {
    Beast: BeastIcon,
    Plant: PlantIcon,
    Bug: BugIcon,
    Mech: MechIcon,
    Dusk: DuskIcon,
    Aquatic: AquaticIcon,
    Bird: BirdIcon,
    Reptile: ReptileIcon,
    Dawn: DawnIcon,
  };

  return (
    <Stack fontSize="sm" align="center">
      <Text opacity={0.9}>#{data?.id}</Text>
      <HStack>
        <Icon as={icons[data.class]} />
        <Text fontWeight="bold">{data?.name}</Text>
      </HStack>

      <HStack align="flex-start">
        {scholar?.name && (
          <Tag>
            <Text textOverflow="ellipsis" overflowX="hidden" whiteSpace="nowrap" maxW="100px">
              {scholar?.name}
            </Text>
          </Tag>
        )}
        <Tag>{data?.breedCount} / 7 breeds</Tag>
        <Tag>{Math.round(data?.quality * 100)}%</Tag>
      </HStack>
    </Stack>
  );
};
