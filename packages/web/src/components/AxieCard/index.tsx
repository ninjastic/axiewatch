import {
  Stack,
  Progress,
  Image,
  Box,
  SkeletonCircle,
  Skeleton,
  Avatar,
  Text,
  Tooltip,
  Tag,
  Link,
  Flex,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useMemo } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import lodash from 'lodash';

import dayjs from '../../services/dayjs';
import { Axie, AxieClass, scholarSelector } from 'src/recoil/scholars';
import { preferencesAtom } from 'src/recoil/preferences';
import { AxieIcon } from '../Icons/AxieIcon';
import { StatusIcon, StatusIconType } from '../Icons/StatusIcon';
import { AxieTraits } from '../AxieTraits';
import { Card } from '../Card';
import { breedingStateAtom, isBreedingModeAtom } from 'src/recoil/breeding';

export const AxieCardSkeleton = (): JSX.Element => {
  return (
    <Card h="419px" w="100%" px={3} py={5}>
      <Flex align="center" justify="space-between">
        <HStack>
          <SkeletonCircle />
          <Skeleton w="100px" h="20px" />
        </HStack>

        <Stack align="flex-end">
          <Skeleton w="50px" h="10px" />
          <Skeleton w="60px" h="10px" />
        </Stack>
      </Flex>

      <Flex mx={8} my={12} justify="space-between">
        <SkeletonCircle w="64px" h="64px" />

        <Stack>
          <Skeleton w="130px" h="10px" />
          <Skeleton w="130px" h="10px" />
          <Skeleton w="130px" h="10px" />
          <Skeleton w="130px" h="10px" />
        </Stack>
      </Flex>

      {lodash.times(6).map(x => (
        <Flex mx={3} my={2} key={x}>
          <SkeletonCircle w="18px" h="18px" />

          <HStack ml={3}>
            <Skeleton w="80px" h="10px" />
            <Skeleton w="80px" h="10px" />
            <Skeleton w="80px" h="10px" />
          </HStack>
        </Flex>
      ))}

      <Flex justify="flex-end" mt={8}>
        <Skeleton w="70px" h="10px" />
      </Flex>
    </Card>
  );
};

interface AxieCardProps {
  axie: Axie;
}

export const AxieCard = ({ axie }: AxieCardProps): JSX.Element => {
  const preferences = useRecoilValue(preferencesAtom);
  const scholar = useRecoilValue(scholarSelector(axie.owner));
  const isBreedingMode = useRecoilValue(isBreedingModeAtom);
  const setBreedingState = useSetRecoilState(breedingStateAtom);

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

  const findSimilarUrl =
    axie.class && `https://market.elitebreeders.club/?parts=${axieParts.join(',')}&classes=${axie.class.toLowerCase()}`;

  const addAxieToBreeding = () => {
    setBreedingState(prev => {
      if (prev[0]) {
        return [prev[0], axie];
      }
      return [axie];
    });
  };

  const traitsBackground = useColorModeValue('white', 'gray.900');

  return (
    <Card
      px={3}
      py={1}
      position="relative"
      overflow="hidden"
      borderWidth={1}
      bg={useColorModeValue('light.card', '#282b39')}
      cursor={isBreedingMode && axie.class ? 'pointer' : 'default'}
      _hover={{ ...(isBreedingMode && axie.class ? { borderColor: 'white', transform: 'scale(1.02)' } : {}) }}
      onClick={isBreedingMode && axie.class ? addAxieToBreeding : undefined}
      opacity={isBreedingMode && !axie.class ? 0.5 : 1}
    >
      <Box py={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box width="80%" display="flex" alignItems="center" overflow="hidden">
          <Avatar
            width="8"
            height="8"
            bg={axie.class?.toLowerCase()}
            icon={<AxieIcon type={(axie.class?.toLowerCase() as AxieClass) ?? 'egg'} fill="white" />}
          />

          <Stack spacing={1} ml="3">
            <Link href={`https://marketplace.axieinfinity.com/axie/${axie.id}/?referrer=axie.watch`} target="_blank">
              <Text fontWeight="bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {axie.name}
              </Text>
            </Link>
          </Stack>
        </Box>

        {axie.class && (
          <Box width="30%" color="gray.400" fontSize="xs" display="flex" flexDirection="column" alignItems="flex-end">
            <Text>
              <b>{axie.breedCount}</b> Breeds
            </Text>
            <Text>
              <b>{Math.round(axie.quality * 100)}%</b> Purity
            </Text>
          </Box>
        )}
      </Box>

      <HStack>
        {(scholar || isManager) && (
          <Box>
            <Tag size="sm" fontWeight="bold">
              {scholar?.name ?? (isManager ? 'Manager' : null)}
            </Tag>
          </Box>
        )}

        {axie.battleInfo.banned && (
          <Box>
            <Tag size="sm" fontWeight="bold" bg="red.500">
              Banned
            </Tag>
          </Box>
        )}
      </HStack>

      <Box display="flex" alignItems="center">
        <Tooltip
          label={
            <Box w="300px">
              <AxieTraits axieData={axie} />
            </Box>
          }
          offset={[-4, 1]}
          isDisabled={!preferences.hideAxieTraits || !axie.class}
        >
          <Box display="flex" alignItems="center" justifyContent="center" width="55%" height="125px" overflow="hidden">
            <Image src={axie.image} fallback={<SkeletonCircle size="14" />} alt={`Axie ${axie.id}`} h="125px" />
          </Box>
        </Tooltip>

        {axie.class && (
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
        )}

        {!axie.class && axie.birthDate && (
          <Stack spacing="0" width="65%">
            <Text>
              Hatches <b>{dayjs.unix(axie.birthDate).add(5, 'days').fromNow()}</b>
            </Text>

            <Text fontSize="xs" variant="faded">
              {dayjs.unix(axie.birthDate).add(5, 'days').format('MMMM DD, YYYY, h:MM A')}
            </Text>
          </Stack>
        )}
      </Box>

      {!preferences.hideAxieTraits && (
        <Box py={2}>
          {axie.class ? (
            <AxieTraits axieData={axie} />
          ) : (
            <Box bg={traitsBackground} py={2} px={2} borderRadius={8} overflow="hidden">
              <Text variant="faded" textAlign="center">
                No traits
              </Text>
            </Box>
          )}
        </Box>
      )}

      {axie.class && (
        <Flex justify="flex-end" align="center">
          <Tag size="sm" fontWeight="bold" bg="transparent">
            <HStack spacing={1}>
              <Link href={findSimilarUrl} target="_blank">
                Find similar
              </Link>
              <BiLinkExternal />
            </HStack>
          </Tag>
        </Flex>
      )}
    </Card>
  );
};
