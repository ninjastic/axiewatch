import { Table, Thead, Tr, Th, Tbody, Flex, Button, Text, Box, HStack, Tooltip } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { APIBattlesResponseItem } from '../../types/api';
import { BattleTableEntry } from './BattleTableEntry';

interface BattlesTableProps {
  data: APIBattlesResponseItem[];
  address: string;
  type: 'All' | 'PVP' | 'PVE';
  perPage: number;
}

export const BattlesTable = ({ data, address, type, perPage }: BattlesTableProps): JSX.Element => {
  const [page, setPage] = useState(0);

  const filteredData = useMemo(
    () =>
      data.filter(battle => {
        if (type === 'PVE') {
          if (battle.battle_type === 1) return true;
          return false;
        }

        if (type === 'PVP') {
          if (battle.battle_type === 0) return true;
          return false;
        }

        return true;
      }),
    [type, data]
  );

  useEffect(() => {
    setPage(0);
  }, [type, perPage]);

  const pageData = filteredData.slice(page * perPage, (page + 1) * perPage);

  const numberOfPages = Math.ceil(filteredData.length / perPage);

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Result</Th>
            <Th>Opponent</Th>
            <Th>
              <HStack>
                <Text>Replay</Text>

                <Tooltip label="This feature will be removed in a near future due to a incoming game update.">
                  <Box>
                    <AiOutlineInfoCircle size={14} />
                  </Box>
                </Tooltip>
              </HStack>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {pageData.map(battle => (
            <BattleTableEntry key={battle.battle_uuid} battle={battle} address={address} />
          ))}
        </Tbody>
      </Table>

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
    </Box>
  );
};
