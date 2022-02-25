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
  Tag,
  Tooltip,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import lodash from 'lodash';

import {
  scholarAxiesFilter,
  scholarsMap,
  ScholarAxiesFilter,
  Axie,
  axiePartsAtom,
  AxieClass,
} from '../recoil/scholars';
import { preferencesAtom } from '../recoil/preferences';
import { useBatchScholarAxie } from '../services/hooks/useBatchScholarAxie';
import { AxiesFilterButton } from '../components/AxiesFilterButton';
import { AxieCard, AxieCardSkeleton } from 'src/components/AxieCard';
import { PreferencesButton } from 'src/components/Header/PreferencesButton';
import { Pagination } from 'src/components/Pagination';
import { RequestStatusFloatingButton } from 'src/components/RequestStatusFloatingButton';
import { isBreedingModeAtom } from 'src/recoil/breeding';
import { BreedingFloatingCard } from 'src/components/BreedingFloatingCard';

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
  const [isBreedingMode, setIsBreedingMode] = useRecoilState(isBreedingModeAtom);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');
  const addresses = scholars.map(scholar => scholar.address);
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

  const { scholarAxies, isLoading, isFetching } = useBatchScholarAxie({ addresses: addressesWithManager, size: 200 });

  const axiesClasses = useMemo(
    () =>
      scholarAxies.reduce((classes, axie) => {
        const obj = { ...classes };
        if (!axie.class) return obj;

        if (obj[axie.class] >= 1) {
          obj[axie.class] += 1;
        } else {
          obj[axie.class] = 1;
        }

        return obj;
      }, {} as { [cls in AxieClass]: number }),
    [scholarAxies]
  );

  const axiesFavoriteClass = useMemo(
    () => Object.keys(axiesClasses).reduce((a, b) => (axiesClasses[a] > axiesClasses[b] ? a : b), ''),
    [axiesClasses]
  );

  const bannedAxies = useMemo(() => scholarAxies.filter(axie => axie.battleInfo.banned).length, [scholarAxies]);

  const filteredAxies = useMemo(() => filterAxies(scholarAxies, filters), [scholarAxies, filters]);

  const numberOfPages = Math.ceil(filteredAxies.length / perPage);

  const pageData = useMemo(
    () => filteredAxies.slice((page - 1) * perPage, page * perPage),
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
    setPage(1);
  }, [filters, perPage]);

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex justify="space-between">
        <Box>
          <Heading as="h2">Axies</Heading>
          <Text opacity={0.9}>See all your scholar axies.</Text>
        </Box>

        <PreferencesButton />
      </Flex>

      {isLoading && !!addressesWithManager.length && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={3} pb={5} mt={5}>
          {lodash.times(4).map(x => (
            <AxieCardSkeleton key={x} />
          ))}
        </SimpleGrid>
      )}

      {!isLoading && !!scholarAxies.length && (
        <Stack spacing={5} mt={5}>
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
              <Tooltip label={`${isBreedingMode ? 'Disables' : 'Enables'} the breeding simulator`}>
                <Button leftIcon={<AiFillHeart />} onClick={() => setIsBreedingMode(prev => !prev)}>
                  {isBreedingMode ? 'Disable' : 'Enable'}
                </Button>
              </Tooltip>

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

          {bannedAxies > 0 && (
            <Flex>
              <Tag bg="red.500">
                <Text>
                  There are <b>{bannedAxies}</b> banned axies.
                </Text>
              </Tag>
            </Flex>
          )}

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={3} pb={5}>
            {pageData.map(axie => (
              <AxieCard key={axie.id} axie={axie} />
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {!isLoading && !!addressesWithManager.length && !filteredAxies.length && (
        <Box h="70%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg" variant="faded">
              No sign of axie life here.
            </Text>
          </Flex>
        </Box>
      )}

      {!isLoading && !addressesWithManager.length && (
        <Box h="80%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg" variant="faded">
              No scholars were found.
            </Text>
          </Flex>
        </Box>
      )}

      {!isLoading && !!filteredAxies.length && (
        <Pagination page={page} setPage={setPage} numberOfPages={numberOfPages} />
      )}

      <BreedingFloatingCard />

      <RequestStatusFloatingButton isFetching={isFetching} />
    </Box>
  );
};

export default dynamic(() => Promise.resolve(Axies), { ssr: false });
