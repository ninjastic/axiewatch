import {
  Spinner,
  Table,
  Thead,
  Th,
  Td,
  Tbody,
  Tr,
  HStack,
  Text,
  Image,
  Link,
  Box,
  Flex,
  Tooltip,
  // Menu,
  // MenuButton,
  // MenuList,
  // MenuItem,
  // Button,
} from '@chakra-ui/react';
// import { FiChevronDown } from 'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import lodash from 'lodash';

import dayjs from '../../services/dayjs';
import { preferencesAtom } from 'src/recoil/preferences';
import { useBatchWalletSales, WalletTransactionSale } from 'src/services/hooks/useBatchWalletSales';
import { scholarsMap } from 'src/recoil/scholars';
import { AxieTag } from '../WalletTransactions/AxieTag';
import { Card } from '../Card';
import { Pagination } from '../Pagination';
import { RequestStatusFloatingButton } from '../RequestStatusFloatingButton';
import { usePrice } from 'src/services/hooks/usePrice';
import { formatter } from 'src/services/formatter';

interface SaleEntryProps {
  transaction: WalletTransactionSale;
}

const shortString = (text: string, start = 4, ending = 4): string =>
  `${text.substr(0, start)}...${text.substr(text.length - ending)}`;

interface SalePriceTooltipProps {
  value: number;
}

const SalePriceTooltip = ({ value }: SalePriceTooltipProps): JSX.Element => {
  const price = usePrice();

  return (
    <Table size="sm">
      <Tr>
        <Td>Gross</Td>
        <Td ml={2}>{Math.round(value * 100000) / 100000}</Td>
        <Td>{formatter(value * price.values.eth, price.locale)}</Td>
      </Tr>

      <Tr>
        <Td>Fee</Td>
        <Td>{Math.round(value * 0.0425 * 100000) / 100000}</Td>
        <Td>{formatter(value * 0.0425 * price.values.eth, price.locale)}</Td>
      </Tr>

      <Tr fontWeight="bold">
        <Td>Net</Td>
        <Td ml={2}>{Math.round(value * 0.9575 * 100000) / 100000}</Td>
        <Td>{formatter(value * 0.9575 * price.values.eth, price.locale)}</Td>
      </Tr>
    </Table>
  );
};

const SaleEntry = ({ transaction }: SaleEntryProps): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const scholarContext = scholars.find(scholar => transaction.sellerId.toLowerCase() === scholar.address.toLowerCase());

  const isManager =
    transaction.sellerId.toLowerCase() === preferences.managerAddress.replace('ronin', '0x').toLowerCase();

  return (
    <Tr>
      <Td>
        <Link href={`https://explorer.roninchain.com/address/${transaction.sellerId}`} target="_blank">
          {scholarContext?.name ?? (isManager && 'Manager') ?? transaction.sellerId}
        </Link>
      </Td>
      <Td>
        <Link href={`https://explorer.roninchain.com/tx/${transaction.txHash}`} target="_blank">
          {shortString(transaction.txHash, 8)}
        </Link>
      </Td>
      <Td>
        <Tooltip label={dayjs.unix(transaction.txTimestamp).format('DD MMM YYYY, HH:mm:ss')}>
          {dayjs.unix(transaction.txTimestamp).fromNow()}
        </Tooltip>
      </Td>
      <Td>
        <AxieTag id={Number(transaction.axie.id)} />
      </Td>
      <Td>
        <Tooltip label={<SalePriceTooltip value={transaction.price} />}>
          <HStack spacing={1}>
            <Image src="/images/axies/eth.png" width="18px" height="18px" alt="eth" />
            <Text>{Math.round(transaction.price * 0.9575 * 100000) / 100000}</Text>
          </HStack>
        </Tooltip>
      </Td>
      <Td>
        <Link href={`https://explorer.roninchain.com/address/${transaction.buyerId}`} target="_blank">
          {shortString(transaction.buyerId, 6)}
        </Link>
      </Td>
    </Tr>
  );
};

// interface TransactionsPerPageSelectorProps {
//   perPage: number;
//   setPerPage: React.Dispatch<React.SetStateAction<number>>;
// }

// const TransactionsPerPageSelector = ({ perPage, setPerPage }: TransactionsPerPageSelectorProps): JSX.Element => {
//   const options = [10, 20, 50];

//   return (
//     <Menu>
//       <MenuButton as={Button} variant="outline" rightIcon={<FiChevronDown />} minW="160px" textAlign="left">
//         {perPage} per page
//       </MenuButton>

//       <MenuList>
//         {options.map(option => (
//           <MenuItem key={option} onClick={() => setPerPage(option)}>
//             {option} per page
//           </MenuItem>
//         ))}
//       </MenuList>
//     </Menu>
//   );
// };

export const WalletSales = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const [page, setPage] = useState(1);
  const [perPage] = useState(50);

  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');

  const addresses = scholars.map(scholar => scholar.address);
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

  const { isLoading, isFetching, data } = useBatchWalletSales({
    addresses: addressesWithManager,
    limit: perPage,
    page,
  });

  const sortedTransactions = data.sort((a, b) => {
    if (a.txTimestamp > b.txTimestamp) return -1;
    if (a.txTimestamp < b.txTimestamp) return 1;
    return 0;
  });

  const pagedTransactions = sortedTransactions.slice((page - 1) * perPage, page * perPage);
  const numberOfPages = Math.ceil(sortedTransactions.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  if (isLoading) {
    return (
      <Box align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box>
      <Flex align="center" justify="space-between" mb={3} direction={{ base: 'column', lg: 'row' }}>
        <HStack>
          <Text fontSize="lg">Showing {data.length} transactions</Text>

          <Tooltip label="Data is cached for 30 minutes">
            <Box>
              <AiOutlineInfoCircle />
            </Box>
          </Tooltip>
        </HStack>

        {/* <HStack mt={{ base: 3, lg: 0 }}>
          <TransactionsPerPageSelector perPage={perPage} setPerPage={setPerPage} />
        </HStack> */}
      </Flex>

      <Card overflowX="auto" p={3} borderWidth={1}>
        <Table>
          <Thead>
            <Tr>
              <Th>Wallet</Th>
              <Th>Tx Hash</Th>
              <Th>Age</Th>
              <Th>Axie</Th>
              <Th>Price</Th>
              <Th>Buyer</Th>
            </Tr>
          </Thead>

          <Tbody>
            {pagedTransactions.map(saleTx => (
              <SaleEntry key={saleTx.txHash} transaction={saleTx} />
            ))}

            {!isFetching && !isLoading && !pagedTransactions.length && (
              <Tr>
                <Td colSpan={6}>
                  <Flex align="center" justify="center">
                    <Text variant="faded">Nothing to see here...</Text>
                  </Flex>
                </Td>
              </Tr>
            )}

            {isFetching && (
              <Tr>
                <Td colSpan={6}>
                  <Flex align="center" justify="center">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Card>

      <Pagination
        page={page}
        setPage={setPage}
        numberOfPages={numberOfPages}
        showNumberOfPages={false}
        isNextDisabled={isFetching || pagedTransactions.length % perPage !== 0 || pagedTransactions.length === 0}
      />

      <RequestStatusFloatingButton isFetching={isFetching} />
    </Box>
  );
};
