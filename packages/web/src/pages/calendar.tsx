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
  Wrap,
  Tag,
  chakra,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import dayjs from '../services/dayjs';
import { formatter } from '../services/formatter';
import { ScholarSelector, scholarsMap } from '../recoil/scholars';
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
  const price = usePrice();

  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.map(scholar => scholar.address);
  const { isLoading, data } = useBatchScholar({ addresses });

  const dates = useMemo(
    () =>
      !isLoading
        ? data
            .filter(result => !scholars.find(scholar => scholar.address === result.address).inactive)
            .sort((a, b) => {
              if (a.lastClaim === 0) return 1;
              if (b.lastClaim === 0) return -1;

              if (dayjs.unix(a.lastClaim).isBefore(dayjs.unix(b.lastClaim))) {
                return -1;
              }

              return 1;
            })
            .reduce((prev, curr) => {
              const scholar = scholars.find(({ address }) => address === curr.address);
              const state = { ...scholar, ...curr };

              const nextClaim = dayjs.unix(curr.nextClaim);

              const day = nextClaim.date();
              const month = nextClaim.month() + 1;

              const monthIndex = prev.findIndex(p => p.month === month);

              if (monthIndex !== -1) {
                const dayIndex = prev[monthIndex].days.findIndex(p => p.day === day);

                if (dayIndex !== -1) {
                  prev[monthIndex].days[dayIndex].scholars.push(state);
                  return prev;
                }

                prev[monthIndex].days.push({ day, scholars: [state] });
                return prev;
              }

              prev.push({ month, days: [{ day, scholars: [state] }] });
              return prev;
            }, [] as ScholarDates[])
        : [],
    [data, isLoading, scholars]
  );

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex justify="space-between">
        <Box>
          <Heading as="h2">Calendar</Heading>

          <Text opacity={0.9}>See when you (manager) will be able to claim your SLP share!</Text>
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
                investor: Math.floor(
                  date.days.reduce(
                    (prevDay, currDay) =>
                      prevDay +
                      currDay.scholars.reduce((prev, curr) => prev + (curr.slp * (curr.shares.investor ?? 0)) / 100, 0),
                    0
                  )
                ),
              };

              const valueMonth = {
                manager: formatter(totalMonth.manager * price.values.slp, price.locale),
                scholar: formatter(totalMonth.scholar * price.values.slp, price.locale),
                investor: formatter(totalMonth.investor * price.values.slp, price.locale),
              };

              return (
                <AccordionItem pb={3} mb={2} w="100%" key={date.month}>
                  <AccordionButton w="100%">
                    <Stack spacing={{ base: 3, lg: 8 }} direction={{ base: 'column', lg: 'row' }}>
                      <Text fontSize={48}>{monthString}</Text>

                      <HStack spacing={5}>
                        <Stack spacing={0}>
                          <Text fontWeight="bold">Manager</Text>
                          <Text>{totalMonth.manager} SLP</Text>

                          <Text opacity={0.9} fontSize="sm">
                            (≈{valueMonth.manager})
                          </Text>
                        </Stack>

                        <Stack spacing={0}>
                          <Text fontWeight="bold">Scholars</Text>

                          <Text>{totalMonth.scholar} SLP</Text>

                          <Text opacity={0.9} fontSize="sm">
                            (≈{valueMonth.scholar})
                          </Text>
                        </Stack>

                        <Stack spacing={0}>
                          <Text fontWeight="bold">Investor</Text>

                          <Text>{totalMonth.investor} SLP</Text>

                          <Text opacity={0.9} fontSize="sm">
                            (≈{valueMonth.investor})
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
                        investor: Math.floor(
                          day.scholars.reduce((prev, curr) => prev + (curr.slp * (curr.shares.investor ?? 0)) / 100, 0)
                        ),
                      };

                      return (
                        <chakra.div key={day.day}>
                          <Box my={5}>
                            <HStack>
                              <Text fontSize={32}>{day.day}</Text>
                              <Text opacity={0.9}>{monthString}</Text>

                              <Text>|</Text>

                              <HStack>
                                <Text fontWeight="bold">{totalDay.total} SLP</Text>

                                <HStack>
                                  <Text>{totalDay.manager} (M)</Text>
                                  <Text>{totalDay.scholar} (S)</Text>
                                  {totalDay.investor > 0 && <Text>{totalDay.investor} (I)</Text>}
                                </HStack>
                              </HStack>
                            </HStack>

                            <UnorderedList>
                              {day.scholars.map(scholar => {
                                const slpScholar = {
                                  manager: Math.floor((scholar.slp * scholar.shares.manager) / 100),
                                  scholar: Math.floor((scholar.slp * scholar.shares.scholar) / 100),
                                  investor: Math.floor((scholar.slp * (scholar.shares.investor ?? 0)) / 100),
                                };

                                return (
                                  <ListItem key={scholar.address} ml={6}>
                                    <Wrap align="center">
                                      <Text opacity={0.9}>{dayjs.unix(scholar.nextClaim).format('HH:mm:ss')}</Text>

                                      <Text fontWeight="bold">{scholar.slp} SLP</Text>

                                      <HStack>
                                        <Tag>{slpScholar.manager} (M)</Tag>
                                        <Tag>{slpScholar.scholar} (S)</Tag>
                                        {slpScholar.investor > 0 && <Tag>{slpScholar.investor} (I)</Tag>}
                                      </HStack>

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
