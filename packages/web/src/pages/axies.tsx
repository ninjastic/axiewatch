import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Checkbox,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import lodash from 'lodash';
import { FiChevronDown } from 'react-icons/fi';

import { scholarAxiesFilter, scholarsMap, ScholarAxiesFilter, Axie, axiePartsAtom } from '../recoil/scholars';
import { preferencesAtom } from '../recoil/preferences';
import { useBatchScholarAxie } from '../services/hooks/useBatchScholarAxie';
import { BallScaleLoading } from '../components/BallScaleLoading';
import { AxiesFilterButton } from '../components/AxiesFilterButton';
import { AxieCard } from '@src/components/AxieCard';
import { PreferencesButton } from '@src/components/Header/PreferencesButton';

interface PerPageSelectorSelectorProps {
  value: number;
  onChange(value: number): void;
}

const PerPageSelector = ({ value, onChange }: PerPageSelectorSelectorProps): JSX.Element => {
  const options = [10, 25, 50, 100];

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w="175px" variant="outline" textAlign="left">
        {!value ? 'Axies per page...' : `${value} Axies/page`}
      </MenuButton>

      <MenuList overflow="auto" maxH="250px">
        {options.map(option => (
          <MenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

const filterAxies = (scholarAxies: Axie[], filters: ScholarAxiesFilter) =>
  scholarAxies.filter(axie => {
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
  });

export const Axies = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const filters = useRecoilValue(scholarAxiesFilter);
  const resetFilters = useResetRecoilState(scholarAxiesFilter);
  const setAxieParts = useSetRecoilState(axiePartsAtom);
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');
  const addresses = scholars.map(scholar => scholar.address);
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

  const { scholarAxies, isLoading } = useBatchScholarAxie({ addresses: addressesWithManager, size: 200 });

  const axiesClasses = useMemo(
    () =>
      scholarAxies.reduce((classes, axie) => {
        const obj = { ...classes };

        if (obj[axie.class] >= 1) {
          obj[axie.class] += 1;
        } else {
          obj[axie.class] = 1;
        }

        return obj;
      }, {} as any),
    [scholarAxies]
  );

  const axiesFavoriteClass = useMemo(
    () => Object.keys(axiesClasses).reduce((a, b) => (axiesClasses[a] > axiesClasses[b] ? a : b), ''),
    [axiesClasses]
  );

  const filteredAxies = useMemo(() => filterAxies(scholarAxies, filters), [scholarAxies, filters]);

  const numberOfPages = Math.ceil(filteredAxies.length / perPage);

  const pageData = useMemo(
    () => filteredAxies.slice(page * perPage, (page + 1) * perPage),
    [filteredAxies, page, perPage]
  );

  useEffect(() => {
    if (!isLoading) {
      const uniqueParts = scholarAxies.reduce((parts, axie) => {
        axie.parts.forEach(part => {
          if (!parts.includes(part.id)) {
            parts.push(part.id);
          }
        });

        return parts;
      }, [] as string[]);

      setAxieParts(uniqueParts);
    }
  }, [setAxieParts, scholarAxies, isLoading]);

  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  useEffect(() => {
    setPage(0);
  }, [filters, perPage]);

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex justify="space-between">
        <Box>
          <Heading as="h2">Axies</Heading>
          <Text opacity={0.9}>See all your scholar axies.</Text>
        </Box>

        <PreferencesButton />
      </Flex>

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
                <StatNumber>{scholarAxies.length}</StatNumber>
              </Stat>

              <Stat w="200px">
                <StatLabel>Favorite class</StatLabel>
                <StatNumber>
                  {axiesClasses[axiesFavoriteClass] ?? '?'}{' '}
                  {pluralize(axiesFavoriteClass, axiesClasses[axiesFavoriteClass])}
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

              <PerPageSelector value={perPage} onChange={setPerPage} />
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} gap={3} pb={5}>
            {pageData.map(axie => (
              <AxieCard key={axie.id} axie={axie} />
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {!isLoading && !!scholars.length && !filteredAxies.length && (
        <Box h="70%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg" variant="faded">
              No sign of axie life here.
            </Text>
          </Flex>
        </Box>
      )}

      {!isLoading && !scholars.length && (
        <Box h="80%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg" variant="faded">
              No scholars were found.
            </Text>
          </Flex>
        </Box>
      )}

      {!isLoading && !!filteredAxies.length && (
        <Flex align="center" justify="space-between" py={5}>
          <Button onClick={() => setPage(p => p - 1)} isDisabled={page <= 0}>
            Prev
          </Button>

          <Text>
            Page {page + 1} of {Math.max(numberOfPages, 1)}
          </Text>

          <Button onClick={() => setPage(p => p + 1)} isDisabled={page + 1 >= numberOfPages}>
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default dynamic(() => Promise.resolve(Axies), { ssr: false });
