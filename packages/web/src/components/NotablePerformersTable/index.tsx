import {
  Box,
  Stack,
  Text,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  SkeletonCircle,
  HStack,
  Image,
  SimpleGrid,
  GridItem,
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Tooltip,
} from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';

import dayjs from '../../services/dayjs';
import { scholarsMap } from '@src/recoil/scholars';
import { useBatchScholar } from '@src/services/hooks/useBatchScholar';
import { Card } from '@components/Card';
import { parseScholarData } from '@src/services/utils/parseScholarData';

interface NumberMenuProps {
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
}

const NumberMenu = ({ number, setNumber }: NumberMenuProps): JSX.Element => {
  return (
    <Menu>
      <MenuButton as={Button} size="sm" variant="outline">
        Show {number} scholars
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setNumber(5)}>5 scholars</MenuItem>
        <MenuItem onClick={() => setNumber(10)}>10 scholars</MenuItem>
        <MenuItem onClick={() => setNumber(25)}>25 scholars</MenuItem>
      </MenuList>
    </Menu>
  );
};

export const NotablePerformersTable = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = scholars.map(scholar => scholar.address);

  const [scholarsNumber, setScholarsNumber] = useState(5);

  const { results, isLoading } = useBatchScholar({ addresses });
  const resultsWithSuccess = results
    .filter(result => result.isSuccess)
    .filter(result => {
      const state = scholars.find(scholar => scholar.address === result.data.scholar.client_id);
      return !state.inactive;
    })
    .filter(result => {
      const data = parseScholarData({ data: result.data });
      return data.lastClaim !== 0 && dayjs.utc().isAfter(dayjs.unix(data.lastClaim).add(1, 'day'));
    });

  const sorted = resultsWithSuccess.sort((a, b) => {
    const aData = parseScholarData({ data: a.data });
    const bData = parseScholarData({ data: b.data });

    if (aData.slpDay > bData.slpDay) return -1;
    if (aData.slpDay < bData.slpDay) return 1;
    return 0;
  });

  const topFive = sorted.slice(0, scholarsNumber);
  const bottomFive = sorted.reverse().slice(0, scholarsNumber);

  return (
    <Stack>
      <Flex justify="space-between">
        <HStack>
          <Text fontWeight="bold" fontSize="lg">
            Notable Performers
          </Text>

          <Tooltip label="The top and bottom performers based on their SLP per day average. Disconsiders the scholars that claimed less than 1 full day ago.">
            <Box>
              <AiOutlineInfoCircle />
            </Box>
          </Tooltip>
        </HStack>

        <NumberMenu number={scholarsNumber} setNumber={setScholarsNumber} />
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3}>
        <Card p={3}>
          <GridItem colSpan={1} minH={48}>
            <Text px={3} py={2} fontWeight="bold">
              Top Performers
            </Text>

            {isLoading && (
              <Flex align="center" justify="center" mt={5}>
                <SkeletonCircle />
              </Flex>
            )}

            {!isLoading && !sorted.length && (
              <Flex align="center" justify="center" mt={5}>
                <Text variant="faded">No data...</Text>
              </Flex>
            )}

            {!isLoading && !!sorted.length && (
              <Box maxH="300px" overflow="auto">
                <Table size="sm" variant="unstyled" maxH="200px">
                  <Thead fontWeight="bold">
                    <Tr>
                      <Td>Name</Td>
                      <Td>Yesterday</Td>
                      <Td>per Day</Td>
                      <Td>SLP</Td>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {topFive.map(result => {
                      const address = result.data.scholar.client_id;
                      const state = scholars.find(scholar => scholar.address === address);
                      const data = parseScholarData({ data: result.data });

                      return (
                        <Tr key={address}>
                          <Td>{state.name}</Td>
                          <Td>{data.yesterdaySlp ?? '-'}</Td>
                          <Td>{data.slpDay}</Td>
                          <Td>
                            <HStack spacing={1}>
                              <Image src="/images/axies/slp.png" height="16px" alt="slp" />
                              <Text>{data.slp}</Text>
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
          </GridItem>
        </Card>

        <Card p={3}>
          <GridItem colSpan={1} minH="48">
            <Text px={3} py={2} fontWeight="bold">
              Bottom Performers
            </Text>

            {isLoading && (
              <Flex align="center" justify="center" mt={5}>
                <SkeletonCircle />
              </Flex>
            )}

            {!isLoading && !sorted.length && (
              <Flex align="center" justify="center" mt={5}>
                <Text variant="faded">No data...</Text>
              </Flex>
            )}

            {!isLoading && !!sorted.length && (
              <Box maxH="300px" overflow="auto">
                <Table size="sm" variant="unstyled">
                  <Thead>
                    <Tr fontWeight="bold">
                      <Td>Name</Td>
                      <Td>Yesterday</Td>
                      <Td>per Day</Td>
                      <Td>SLP</Td>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {bottomFive.map(result => {
                      const address = result.data.scholar.client_id;
                      const state = scholars.find(scholar => scholar.address === address);
                      const data = parseScholarData({ data: result.data });

                      return (
                        <Tr key={address}>
                          <Td>{state.name}</Td>
                          <Td>{data.yesterdaySlp ?? '-'}</Td>
                          <Td>{data.slpDay}</Td>
                          <Td>
                            <HStack spacing={1}>
                              <Image src="/images/axies/slp.png" height="16px" alt="slp" />
                              <Text>{data.slp}</Text>
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
          </GridItem>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};
