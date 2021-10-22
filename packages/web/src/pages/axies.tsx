import {
  Box,
  Heading,
  Image,
  Text,
  Stack,
  Flex,
  SkeletonCircle,
  Link,
  SimpleGrid,
  useBreakpointValue,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Checkbox,
  Tooltip,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import dynamic from 'next/dynamic';
import { useMemo, useEffect } from 'react';
import pluralize from 'pluralize';

import { scholarAxiesFilter, scholarsMap, ScholarAxiesFilter, Axie, axiePartsAtom } from '../recoil/scholars';
import { preferencesAtom } from '../recoil/preferences';
import { useBatchScholarAxie } from '../services/hooks/useBatchScholarAxie';
import { BallScaleLoading } from '../components/BallScaleLoading';
import { AxieInfo } from '../components/AxieInfo';
import { AxieTraits } from '../components/AxieTraits';
import { AxiesFilterButton } from '../components/AxiesFilterButton';
import { Card } from '../components/Card';

const filterAxies = (scholarAxies: Axie[][], filters: ScholarAxiesFilter) =>
  scholarAxies.map(axies =>
    axies.filter(axie => {
      if (filters.breed.above && axie.breedCount < filters.breed.above) return false;
      if (filters.breed.under && axie.breedCount > filters.breed.under) return false;

      if (filters.quality.above && Math.ceil(axie.quality * 100) < filters.quality.above) return false;

      if (filters.quality.under && Math.ceil(axie.quality * 100) > filters.quality.under) return false;

      if (filters.owner && axie.owner !== filters.owner) return false;

      if (filters.class && axie.class !== filters.class) return false;

      if (filters.parts.length) {
        const partExists = filters.parts.every(partId => axie.parts.find(axiePart => axiePart.id === partId));

        if (!partExists) return false;
      }

      return true;
    })
  );

export const Axies = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const filters = useRecoilValue(scholarAxiesFilter);
  const resetFilters = useResetRecoilState(scholarAxiesFilter);
  const setAxieParts = useSetRecoilState(axiePartsAtom);
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const addresses = useMemo(() => scholars.map(scholar => scholar.address), [scholars]);
  const { scholarAxies, isLoading } = useBatchScholarAxie(addresses);

  const axiesCount = useMemo(() => scholarAxies.reduce((count, axies) => count + axies.length, 0), [scholarAxies]);

  const axiesClasses = useMemo(
    () =>
      scholarAxies.reduce((classes, axies) => {
        const obj = { ...classes };

        axies.forEach(axie => {
          if (obj[axie.class] >= 1) {
            obj[axie.class] += 1;
          } else {
            obj[axie.class] = 1;
          }
        });

        return obj;
      }, {} as any),
    [scholarAxies]
  );

  const axiesFavoriteClass = useMemo(
    () => Object.keys(axiesClasses).reduce((a, b) => (axiesClasses[a] > axiesClasses[b] ? a : b), ''),
    [axiesClasses]
  );

  const filteredAxies = useMemo(() => filterAxies(scholarAxies, filters), [scholarAxies, filters]);

  const filteredAxiesCount = useMemo(
    () =>
      Object.values(filteredAxies)
        .map(axies => !!axies.length)
        .filter(v => v).length,
    [filteredAxies]
  );

  useEffect(() => {
    if (!isLoading) {
      const uniqueParts = scholarAxies.reduce((parts, axies) => {
        axies.forEach(axie => {
          axie.parts.forEach(part => {
            if (!parts.includes(part.id)) {
              parts.push(part.id);
            }
          });
        });

        return parts;
      }, [] as string[]);

      setAxieParts(uniqueParts);
    }
  }, [setAxieParts, scholarAxies, isLoading]);

  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Box>
        <Heading as="h2">Axies</Heading>
        <Text opacity={0.8}>See all your scholar axies.</Text>
      </Box>

      {isLoading && scholars.length && (
        <Stack d="flex" flexDir="column" justifyContent="center" alignItems="center" h="80%">
          <BallScaleLoading />

          <Text fontWeight="bold">Loading axies...</Text>
        </Stack>
      )}

      {!isLoading && !!scholarAxies.length && (
        <Stack spacing={10} mt={5}>
          <Flex justify="space-between" align="center" direction={{ base: 'column', lg: 'row' }}>
            <HStack mb={{ base: 5, lg: 0 }}>
              <Stat>
                <StatLabel>N° of Axies</StatLabel>
                <StatNumber>{axiesCount}</StatNumber>
              </Stat>

              <Stat w="200px">
                <StatLabel>Favorite class</StatLabel>
                <StatNumber>
                  {axiesClasses[axiesFavoriteClass]} {pluralize(axiesFavoriteClass, axiesClasses[axiesFavoriteClass])}
                </StatNumber>
              </Stat>
            </HStack>

            <HStack spacing={5}>
              <Checkbox
                defaultChecked={preferences.hideAxieTraits}
                onChange={e =>
                  setPreferences(prev => ({
                    ...prev,
                    hideAxieTraits: e.target.checked,
                  }))
                }
              >
                Hide Traits
              </Checkbox>
              <AxiesFilterButton />
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} gap={3} pb={5}>
            {filteredAxies.map(axies =>
              axies.map(axie => (
                <Card py={5} px={3} key={axie.id}>
                  <Stack align="center" spacing={3}>
                    <AxieInfo axieData={axie} />

                    <Tooltip label={<AxieTraits axieData={axie} />} isDisabled={!preferences.hideAxieTraits} p={3}>
                      <Link
                        href={`https://marketplace.axieinfinity.com/axie/${axie.id}?referrer=axie.watch`}
                        target="_blank"
                      >
                        <Image
                          src={axie.image}
                          w="144px"
                          h="108px"
                          cursor="pointer"
                          alt={`Axie ${axie.id}`}
                          fallback={
                            <Box d="flex" w="144px" h="108px" alignItems="center" justifyContent="center">
                              <SkeletonCircle />
                            </Box>
                          }
                          transition="all .2s ease-out"
                          _hover={{ transform: 'translateY(-5px)', opacity: 1 }}
                        />
                      </Link>
                    </Tooltip>

                    {!preferences.hideAxieTraits && <AxieTraits axieData={axie} />}
                  </Stack>
                </Card>
              ))
            )}
          </SimpleGrid>
        </Stack>
      )}

      {!isLoading && !!scholars.length && !filteredAxiesCount && (
        <Box h="70%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg">No sign of axie life here.</Text>
          </Flex>
        </Box>
      )}

      {!isLoading && !scholars.length && (
        <Box h="80%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg">No scholars were found.</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default dynamic(() => Promise.resolve(Axies), { ssr: false });
