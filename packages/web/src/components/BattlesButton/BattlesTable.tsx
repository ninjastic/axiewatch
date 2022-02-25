import { Table, Thead, Tr, Th, Tbody, Text, Box, HStack, Tooltip } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { APIBattlesResponseItem } from '../../types/api';
import { BattleTableEntry } from './BattleTableEntry';
import { Pagination } from 'src/components/Pagination';

interface BattlesTableProps {
  data: APIBattlesResponseItem[];
  address: string;
  type: 'All' | 'PVP' | 'PVE';
  perPage: number;
}

export const BattlesTable = ({ data, address, type, perPage }: BattlesTableProps): JSX.Element => {
  const [page, setPage] = useState(1);

  const filteredData = useMemo(
    () =>
      data.filter(battle => {
        if (type === 'PVE') {
          if (battle.eloAndItem === undefined) return true;
          return false;
        }

        if (type === 'PVP') {
          if (battle.eloAndItem !== undefined) return true;
          return false;
        }

        return true;
      }),
    [type, data]
  );

  useEffect(() => {
    setPage(1);
  }, [type, perPage]);

  const pageData = filteredData.slice((page - 1) * perPage, page * perPage);
  const numberOfPages = Math.ceil(filteredData.length / perPage);

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Result</Th>
            <Th>ELO</Th>
            <Th>SLP</Th>
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

      <Pagination page={page} setPage={setPage} numberOfPages={numberOfPages} />
    </Box>
  );
};
