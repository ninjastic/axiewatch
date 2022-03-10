import { Box, Stack, HStack, Text, Image, Flex, Tooltip, SimpleGrid, SkeletonText, Icon } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { RiSwordLine } from 'react-icons/ri';
import { useCallback, useMemo } from 'react';

import dayjs from '../../../../services/dayjs';
import { formatter } from '../../../../services/formatter';
import { priceAtom } from '../../../../recoil/price';
import { scholarSelector } from '../../../../recoil/scholars';
import { averageRangeAtom, preferencesAtom } from '../../../../recoil/preferences';

interface ScholarOverviewProps {
  address: string;
  isLoading?: boolean;
}

export const ScholarOverview = ({ address, isLoading }: ScholarOverviewProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const preferences = useRecoilValue(preferencesAtom);
  const price = useRecoilValue(priceAtom);
  const averageRange = useRecoilValue(averageRangeAtom);

  const { name, slp, roninSlp, todaySlp, shares, slpDay, lastClaim, nextClaim } = scholar || {};

  const slpAmount = preferences.includeRoninBalance ? slp + roninSlp : slp;

  const fiatValues = useMemo(
    () => ({
      total: formatter(slpAmount * price.values.slp, price.locale),
      scholar: formatter((slpAmount * price.values.slp * shares?.scholar) / 100, price.locale),
      manager: formatter((slpAmount * price.values.slp * shares?.manager) / 100, price.locale),
    }),
    [slpAmount, price, shares]
  );

  const slpValues = useMemo(
    () => ({
      scholar: Math.floor((slpAmount * shares?.scholar) / 100),
      manager: Math.floor((slpAmount * shares?.manager) / 100),
    }),
    [slpAmount, shares]
  );

  const datesFormatted = useMemo(
    () => ({
      lastClaim: dayjs.unix(lastClaim).format('DD MMM YYYY, HH:mm:ss'),
      nextClaim: dayjs.unix(nextClaim).format('DD MMM YYYY, HH:mm:ss'),
    }),
    [lastClaim, nextClaim]
  );

  const slpDayValueText = useMemo(
    () => formatter(slpDay * price.values.slp, price.locale),
    [price.locale, price.values.slp, slpDay]
  );

  const getSlpDayColor = useCallback(() => {
    if (scholar.slpDay >= (averageRange?.top ?? 120)) return 'green.200';
    if (scholar.slpDay >= (averageRange?.bottom ?? 120) && scholar.slpDay < (averageRange?.top ?? 120))
      return 'red.200';
    if (scholar.slpDay < (averageRange?.bottom ?? 120)) return 'red.300';
    return 'white';
  }, [averageRange?.bottom, averageRange?.top, scholar.slpDay]);

  const lastClaimText = useMemo(() => (lastClaim === 0 ? 'never' : dayjs.unix(lastClaim).fromNow()), [lastClaim]);

  const nextClaimIsBeforeText = lastClaim === 0 ? '-' : 'now ✨';
  const nextClaimText = useMemo(
    () => (dayjs.unix(nextClaim).isBefore(dayjs()) ? nextClaimIsBeforeText : dayjs.unix(nextClaim).fromNow()),
    [nextClaim, nextClaimIsBeforeText]
  );

  return (
    <Stack p={5}>
      <Flex justify="space-between" align="center">
        <Stack spacing={0}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            maxW="145px"
          >
            {name}
          </Text>

          <Text opacity={0.9} fontSize="xs">
            {address.substr(0, 5)}...{address.substr(address.length - 5)}
          </Text>
        </Stack>

        <SkeletonText isLoaded={!isLoading} noOfLines={2}>
          <Text opacity={0.9} fontSize="xs">
            Arena
          </Text>

          <HStack>
            <Icon as={RiSwordLine} />
            {scholar.pvpErrored && <Text color={isLoading ? 'inherit' : 'red.300'}>Error</Text>}

            {!scholar.pvpErrored && <Text>{scholar.pvpElo}</Text>}
          </HStack>
        </SkeletonText>

        <HStack>
          <SkeletonText isLoaded={!isLoading} noOfLines={2}>
            <Text color={getSlpDayColor as any} fontWeight="bold" fontSize="sm">
              {slpDay} / day
            </Text>

            <Text opacity={0.9} fontSize="xs">
              (≈{slpDayValueText})
            </Text>
          </SkeletonText>
        </HStack>
      </Flex>

      <SkeletonText isLoaded={!isLoading} noOfLines={1} py={3}>
        <Flex justify="space-between">
          <HStack>
            <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />
            <Text>{slp}</Text>

            <Text opacity={0.9} fontSize="xs">
              (≈{fiatValues.total})
            </Text>
          </HStack>

          <Text opacity={0.9} fontSize="xs">
            {todaySlp ?? '-'} @ today
          </Text>
        </Flex>
      </SkeletonText>

      <SimpleGrid columns={2} gap={isLoading ? 12 : 8}>
        <SkeletonText isLoaded={!isLoading} noOfLines={2} w={32}>
          <Box>
            <HStack spacing={0}>
              <Text opacity={0.9} fontSize="xs" mr={1}>
                Scholar
              </Text>
              <Text opacity={0.9} fontSize="xs">
                ({shares?.scholar}%)
              </Text>
            </HStack>

            <HStack>
              <Text>{slpValues.scholar}</Text>
              <Text opacity={0.9} fontSize="xs">
                (≈{fiatValues.scholar})
              </Text>
            </HStack>
          </Box>
        </SkeletonText>

        <SkeletonText isLoaded={!isLoading} noOfLines={2} w={32}>
          <Box>
            <HStack spacing={0}>
              <Text opacity={0.9} fontSize="xs" mr={1}>
                Manager
              </Text>
              <Text opacity={0.9} fontSize="xs">
                ({shares?.manager}%)
              </Text>
            </HStack>

            <HStack>
              <Text>{slpValues.manager}</Text>
              <Text opacity={0.9} fontSize="xs">
                (≈{fiatValues.manager})
              </Text>
            </HStack>
          </Box>
        </SkeletonText>

        <SkeletonText isLoaded={!isLoading} noOfLines={2} w={32}>
          <Box>
            <Tooltip label={datesFormatted.lastClaim} isDisabled={lastClaim === 0}>
              <Flex direction="column" align="flex-start">
                <Text opacity={0.9} fontSize="xs">
                  Last claim
                </Text>
                <Text fontSize="sm">{lastClaimText}</Text>
              </Flex>
            </Tooltip>
          </Box>
        </SkeletonText>

        <SkeletonText isLoaded={!isLoading} noOfLines={2} w={32}>
          <Box>
            <Tooltip label={datesFormatted.nextClaim} isDisabled={lastClaim === 0}>
              <Flex direction="column" align="flex-start">
                <Text opacity={0.9} fontSize="xs">
                  Next claim
                </Text>
                <Text fontSize="sm">{nextClaimText}</Text>
              </Flex>
            </Tooltip>
          </Box>
        </SkeletonText>
      </SimpleGrid>
    </Stack>
  );
};
