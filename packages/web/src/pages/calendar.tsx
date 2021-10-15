import {
  Box,
  Text,
  HStack,
  Stack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Heading,
  UnorderedList,
  ListItem,
  Flex,
  chakra,
  Wrap,
  useMediaQuery,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import dynamic from 'next/dynamic';

import dayjs from '../services/dayjs';
import { formatter } from '../services/formatter';
import { allScholarsSelector, ScholarSelector } from '../recoil/scholars';
import { usePrice } from '../services/hooks/usePrice';
import { useBatchScholar } from '../services/hooks/useBatchScholar';
import { BallScaleLoading } from '../components/BallScaleLoading';
import { PreferencesButton } from '../components/Header/PreferencesButton';
import { PriceTicker } from '../components/Header/PriceTicker';
import { ScholarAddress } from '../components/ScholarsGrid/Scholar/ScholarAddress';

interface ScholarDates {
  month: number;
  days: {
    day: number;
    scholars: ScholarSelector[];
  }[];
}

export const Calendar = (): JSX.Element => {
  const scholars = useRecoilValue(allScholarsSelector).filter(scholar => !scholar.errored);

  const { isLoading } = useBatchScholar({
    addresses: scholars.map(scholar => scholar.address),
  });

  const price = usePrice();
  const [isWideVersion] = useMediaQuery('(min-width: 750px)');

  const dates = scholars
    .filter(scholar => scholar.loaded && scholar.lastClaim !== 0 && !scholar.inactive)
    .sort((a, b) => {
      if (a.nextClaim === 0) return 1;
      if (b.nextClaim === 0) return -1;

      if (dayjs.unix(a.nextClaim).isBefore(dayjs.unix(b.nextClaim))) {
        return -1;
      }

      return 1;
    })
    .reduce((prev, curr) => {
      const nextClaim = dayjs.unix(curr.nextClaim);

      const day = nextClaim.date();
      const month = nextClaim.month() + 1;

      const monthIndex = prev.findIndex(p => p.month === month);

      if (monthIndex !== -1) {
        const dayIndex = prev[monthIndex].days.findIndex(p => p.day === day);

        if (dayIndex !== -1) {
          prev[monthIndex].days[dayIndex].scholars.push(curr);
          return prev;
        }

        prev[monthIndex].days.push({ day, scholars: [curr] });
        return prev;
      }

      prev.push({ month, days: [{ day, scholars: [curr] }] });
      return prev;
    }, [] as ScholarDates[]);

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex justify="space-between">
        <Box>
          <Heading as="h2">Calendar</Heading>

          <Text opacity={0.8}>See when you (manager) will be able to claim your SLP share!</Text>
        </Box>

        <HStack spacing={5}>
          <PriceTicker />
          <PreferencesButton />
        </HStack>
      </Flex>

      {isLoading && (
        <Box h="80%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <BallScaleLoading />

            <Text fontWeight="bold">Loading scholars...</Text>

            <Text>
              {scholars.filter(scholar => scholar.loaded).length}/{scholars.length}
            </Text>
          </Flex>
        </Box>
      )}

      {!isLoading && !!dates.length && (
        <Box mt={5}>
          <Accordion allowToggle allowMultiple>
            {dates.map(date => {
              const monthString = dayjs(date.month.toString(), 'M').format('MMMM');

              const totalMonth = {
                manager: Math.floor(
                  date.days.reduce(
                    (prevDay, currDay) =>
                      prevDay +
                      currDay.scholars.reduce((prev, curr) => prev + (curr.slp * curr.shares.manager) / 100, 0),
                    0
                  )
                ),
                scholar: Math.floor(
                  date.days.reduce(
                    (prevDay, currDay) =>
                      prevDay +
                      currDay.scholars.reduce((prev, curr) => prev + (curr.slp * curr.shares.scholar) / 100, 0),
                    0
                  )
                ),
              };

              const valueMonth = {
                manager: formatter(totalMonth.manager * price.values.slp, price.locale),
                scholar: formatter(totalMonth.scholar * price.values.slp, price.locale),
              };

              return (
                <AccordionItem pb={3} mb={2} w="100%" key={date.month}>
                  <AccordionButton w="100%">
                    <Stack spacing={isWideVersion ? 8 : 3} direction={isWideVersion ? 'row' : 'column'}>
                      <Text fontSize={48}>{monthString}</Text>

                      <HStack spacing={5}>
                        <Stack spacing={0}>
                          <Text fontWeight="bold">Manager</Text>
                          <Text>{totalMonth.manager} SLP</Text>

                          <Text opacity={0.8} fontSize="sm">
                            (≈{valueMonth.manager})
                          </Text>
                        </Stack>

                        <Stack spacing={0}>
                          <Text fontWeight="bold">Scholars</Text>

                          <Text>{totalMonth.scholar} SLP</Text>

                          <Text opacity={0.8} fontSize="sm">
                            (≈{valueMonth.scholar})
                          </Text>
                        </Stack>
                      </HStack>
                    </Stack>

                    <AccordionIcon fontSize="xx-large" ml="auto" />
                  </AccordionButton>

                  <AccordionPanel>
                    {date.days.map((day, index) => {
                      const totalDay = {
                        total: day.scholars.reduce((prev, curr) => prev + curr.slp, 0),
                        manager: Math.floor(
                          day.scholars.reduce((prev, curr) => prev + (curr.slp * curr.shares.manager) / 100, 0)
                        ),
                        scholar: Math.floor(
                          day.scholars.reduce((prev, curr) => prev + (curr.slp * curr.shares.scholar) / 100, 0)
                        ),
                      };

                      return (
                        <chakra.div key={day.day}>
                          <Box my={5}>
                            <HStack>
                              <Text fontSize={32}>{day.day}</Text>
                              <Text opacity={0.8}>{monthString}</Text>

                              <Text>|</Text>

                              <HStack>
                                <Text fontWeight="bold">{totalDay.total} SLP</Text>

                                <Text fontSize="sm" opacity={0.8}>
                                  {totalDay.manager} (M) / {totalDay.scholar} (S)
                                </Text>
                              </HStack>
                            </HStack>

                            <UnorderedList>
                              {day.scholars.map(scholar => {
                                const slpScholar = {
                                  manager: Math.floor((scholar.slp * scholar.shares.manager) / 100),
                                  scholar: Math.floor((scholar.slp * scholar.shares.scholar) / 100),
                                };

                                return (
                                  <ListItem key={scholar.address} ml={6}>
                                    <Wrap align="center">
                                      <Text opacity={0.8}>{dayjs.unix(scholar.nextClaim).format('HH:mm:ss')}</Text>

                                      <Text fontWeight="bold">{scholar.slp} SLP</Text>

                                      <Text fontSize="sm" opacity={0.8}>
                                        {slpScholar.manager} (M){' / '}
                                        {slpScholar.scholar} (S)
                                      </Text>

                                      <HStack spacing={2}>
                                        <Text
                                          fontWeight="bold"
                                          fontSize="18px"
                                          textOverflow="ellipsis"
                                          whiteSpace="nowrap"
                                          overflow="hidden"
                                          maxW="250px"
                                        >
                                          {scholar.name}
                                        </Text>

                                        <ScholarAddress address={scholar.address} />
                                      </HStack>
                                    </Wrap>
                                  </ListItem>
                                );
                              })}
                            </UnorderedList>
                          </Box>
                          {index !== date.days.length - 1 && <Divider />}
                        </chakra.div>
                      );
                    })}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
      )}

      {!scholars.length && (
        <Box h="80%">
          <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize="lg">No scholars with claim available.</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default dynamic(() => Promise.resolve(Calendar), { ssr: false });
