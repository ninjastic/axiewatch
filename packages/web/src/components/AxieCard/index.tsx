import {
  Stack,
  Progress,
  Image,
  Box,
  SkeletonCircle,
  Avatar,
  Text,
  Tooltip,
  Tag,
  Link,
  Flex,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import { BiLinkExternal } from 'react-icons/bi';

import { Axie, AxieClass, scholarSelector } from '@src/recoil/scholars';
import { preferencesAtom } from '@src/recoil/preferences';
import { AxieIcon } from '../Icons/AxieIcon';
import { StatusIcon, StatusIconType } from '../Icons/StatusIcon';
import { AxieTraits } from '../AxieTraits';
import { Card } from '../Card';

interface AxieCardProps {
  axie: Axie;
}

export const AxieCard = ({ axie }: AxieCardProps): JSX.Element => {
  const preferences = useRecoilValue(preferencesAtom);
  const scholar = useRecoilValue(scholarSelector(axie.owner));

  const managerWithoutRonin = preferences?.managerAddress.replace('ronin:', '0x');
  const isManager = axie.owner.toLowerCase() === managerWithoutRonin.toLowerCase();

  const marketAllowedParts = useMemo(() => ['mouth', 'horn', 'back', 'tail'], []);

  const axieParts = useMemo(
    () =>
      axie.parts.reduce((parts, part) => {
        return marketAllowedParts.includes(part.type.toLowerCase()) ? [...parts, part.id] : parts;
      }, []),
    [axie.parts, marketAllowedParts]
  );

  const findSimilarUrl = `https://market.elitebreeders.club/?classes=${axie.class.toLowerCase()}&parts=${axieParts.join(
    ','
  )}`;

  return (
    <Card
      px={3}
      py={1}
      position="relative"
      overflow="hidden"
      borderWidth={1}
      bg={useColorModeValue('light.card', '#282b39')}
    >
      <Box py={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box width="80%" display="flex" alignItems="center" overflow="hidden">
          <Avatar
            width="8"
            height="8"
            bg={axie.class.toLowerCase()}
            icon={<AxieIcon type={axie.class.toLowerCase() as AxieClass} fill="white" />}
          />

          <Stack spacing={1} ml="3">
            <Link href={`https://marketplace.axieinfinity.com/axie/${axie.id}/?referrer=axie.watch`} target="_blank">
              <Text fontWeight="bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {axie.name}
              </Text>
            </Link>
          </Stack>
        </Box>
        <Box width="30%" color="gray.400" fontSize="xs" display="flex" flexDirection="column" alignItems="flex-end">
          <Text>
            <b>{axie.breedCount}</b> Breeds
          </Text>
          <Text>
            <b>{Math.round(axie.quality * 100)}%</b> Purity
          </Text>
        </Box>
      </Box>

      {(scholar || isManager) && (
        <Box>
          <Tag size="sm" fontWeight="bold">
            {scholar?.name ?? (isManager ? 'Manager' : null)}
          </Tag>
        </Box>
      )}

      <Box display="flex" alignItems="center">
        <Tooltip
          label={
            <Box w="300px">
              <AxieTraits axieData={axie} />
            </Box>
          }
          offset={[-4, 1]}
          isDisabled={!preferences.hideAxieTraits}
        >
          <Box display="flex" alignItems="center" justifyContent="center" width="55%" height="125px" overflow="hidden">
            <Link href={`https://marketplace.axieinfinity.com/axie/${axie.id}/?referrer=axie.watch`} target="_blank">
              <Image src={axie.image} fallback={<SkeletonCircle size="14" />} alt={`Axie ${axie.id}`} h="125px" />
            </Link>
          </Box>
        </Tooltip>

        <Stack spacing="0" width="45%">
          {Object.entries(axie.stats ?? {}).map(([stat, value]) => (
            <Box key={stat} fontSize="sm" display="flex" alignItems="center">
              <Box display="flex" alignItems="center" width="12" justifyContent="space-between" mr="2">
                <StatusIcon borderRadius="8" type={stat as StatusIconType} />
                <Text fontSize="12px">{axie.stats[stat]}</Text>
              </Box>
              <Progress min={27} max={61} value={value} size="sm" colorScheme={stat} width="100%" borderRadius="md" />
            </Box>
          ))}
        </Stack>
      </Box>

      {!preferences.hideAxieTraits && (
        <Box py={2}>
          <AxieTraits axieData={axie} />
        </Box>
      )}

      <Flex justify="flex-end">
        <Tag size="sm" fontWeight="bold" bg="transparent">
          <HStack spacing={1}>
            <Link href={findSimilarUrl} target="_blank">
              Find similar
            </Link>
            <BiLinkExternal />
          </HStack>
        </Tag>
      </Flex>
    </Card>
  );
};
