import { Box, Table, Thead, Tbody, Tr, Th } from '@chakra-ui/react';

import { TransactionTableEntry } from './TransactionTableEntry';

interface TransactionsTableProps {
  transactions: any;
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps): JSX.Element => {
  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Wallet</Th>
            <Th>Tx Hash</Th>
            <Th>Age</Th>
            <Th>Action</Th>
            <Th>Value</Th>
            <Th>From</Th>
            <Th>To</Th>
            <Th w={3}>Status</Th>
          </Tr>
        </Thead>

        <Tbody>
          {transactions.map((transaction: any) => (
            <TransactionTableEntry key={transaction.hash} transaction={transaction} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
