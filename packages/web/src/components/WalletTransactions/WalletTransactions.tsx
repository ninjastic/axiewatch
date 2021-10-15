import { Box, Text, Spinner, Flex, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { scholarsMap } from '../../recoil/scholars';
import { useBatchWalletTransactions } from '../../services/hooks/useBatchWalletTransactions';
import { TransactionsTable } from './TransactionsTable';

export const WalletTransactions = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);

  const [page, setPage] = useState(0);

  const addresses = scholars.map(scholar => scholar.address);
  const { isLoading, results } = useBatchWalletTransactions(addresses);

  const transactions = results.reduce(
    (prev, curr) => [...prev, ...(curr.data?.transactions?.results ?? [])],
    [] as any[]
  );

  const sortedTransactions = transactions.sort((a, b) => {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;
    return 0;
  });

  const amountPerPage = 20;

  const pagedTransactions = sortedTransactions.slice(page * amountPerPage, (page + 1) * amountPerPage);

  const numberOfPages = Math.ceil(sortedTransactions.length / amountPerPage);

  if (isLoading) {
    return (
      <Box align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="lg" mb={3}>
        Total of {sortedTransactions.length} transactions.
      </Text>

      <TransactionsTable transactions={pagedTransactions} />

      <Flex align="center" justify="space-between" mt={5}>
        <Button onClick={() => setPage(p => p - 1)} isDisabled={page <= 0}>
          Prev
        </Button>

        <Text>
          Page {page + 1} of {numberOfPages}
        </Text>

        <Button onClick={() => setPage(p => p + 1)} isDisabled={page + 1 === numberOfPages}>
          Next
        </Button>
      </Flex>
    </Box>
  );
};
