import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import { WalletTransaction } from 'src/services/hooks/useBatchWalletTransactions';
import { Card } from '../Card';
import { TransactionTableEntry } from './TransactionTableEntry';

interface TransactionsTableProps {
  transactions: WalletTransaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps): JSX.Element => {
  return (
    <Card overflowX="auto" p={3} borderWidth={1}>
      <Table>
        <Thead>
          <Tr>
            <Th>Wallet</Th>
            <Th>Tx Hash</Th>
            <Th>Age</Th>
            <Th>Action</Th>
            <Th>Value</Th>
            <Th>Direction</Th>
            <Th w={3} />
          </Tr>
        </Thead>

        <Tbody>
          {transactions.map(transaction => (
            <TransactionTableEntry key={transaction.hash} transaction={transaction} />
          ))}

          {!transactions.length && (
            <Tr>
              <Td colSpan={8} h="75px" textAlign="center">
                No results...
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Card>
  );
};
