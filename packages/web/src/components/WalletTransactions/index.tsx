import {
  Box,
  Text,
  Spinner,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import lodash from 'lodash';

import { scholarsMap } from '../../recoil/scholars';
import { preferencesAtom } from 'src/recoil/preferences';
import { useBatchWalletTransactions } from '../../services/hooks/useBatchWalletTransactions';
import { TransactionsTable } from './TransactionsTable';
import { Pagination } from '../Pagination';
import { RequestStatusFloatingButton } from '../RequestStatusFloatingButton';

const eth = '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5';
const slp = '0xa8754b9fa15fc18bb59458815510e40a12cd2014';
const axs = '0x97a9107c1793bc407d6f527b77e7fff4d812bece';

const getActionType = (to: string, input: string) => {
  if (input.startsWith('0xa9059cbb') && to === eth) return 'Transfer ETH';
  if (input.startsWith('0xa9059cbb') && to === slp) return 'Transfer SLP';
  if (input.startsWith('0xa9059cbb') && to === axs) return 'Transfer AXS';
  if (input.startsWith('0xd3392ddf')) return 'Claim SLP';
  if (input.startsWith('0xbec24050') && input.includes(eth.replace('0x', ''))) return 'Withdraw ETH';
  if (input.startsWith('0xbec24050') && input.includes(slp.replace('0x', ''))) return 'Withdraw SLP';
  if (input.startsWith('0xbec24050') && input.includes(axs.replace('0x', ''))) return 'Withdraw AXS';
  if (input.startsWith('0x0b830218')) return 'Create Axie Sale';
  if (input.startsWith('0x96b5a755')) return 'Cancel Axie Sale';
  if (input.startsWith('0x4d51bfc4')) return 'Buy Axie';
  if (input.startsWith('0x42842e0e')) return 'Transfer Axie';
  if (input.startsWith('0x8264f2c2')) return 'Breed Axie';
  if (input.startsWith('0x8069cbb6')) return 'Morph Axie';
  if (input.startsWith('0xef509b6b')) return 'Batch Morph Axies';
  if (input.startsWith('0x095ea7b3')) return 'Approve AXS';
  if (input.startsWith('0xa694fc3a')) return 'Stake AXS';
  if (input.startsWith('0x2e17de78')) return 'Unstake AXS';
  if (input.startsWith('0x92bd7b2c')) return 'Claim AXS';
  if (input.startsWith('0x3d8527ba')) return 'Restake Rewards';
  if (input.startsWith('0xe8e337')) return 'Add Liquidity';
  if (input.startsWith('0x38ed1739')) return 'Swap Tokens';
  if (input.startsWith('0xbaa2abde')) return 'Remove Liquidity';
  return '??';
};

interface TransactionsTypeSelectorProps {
  typeFilter: string;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
}

const TransactionsTypeSelector = ({ typeFilter, setTypeFilter }: TransactionsTypeSelectorProps): JSX.Element => {
  const options = [
    'All',
    'Transfer ETH',
    'Transfer SLP',
    'Transfer AXS',
    'Claim SLP',
    'Transfer Axie',
    'Buy Axie',
    'Create Axie Sale',
    'Cancel Axie Sale',
    'Withdraw ETH',
    'Withdraw SLP',
    'Withdraw AXS',
    'Breed Axie',
    'Morph Axie',
    'Batch Morph Axies',
    'Approve AXS',
    'Stake AXS',
    'Unstake AXS',
    'Claim AXS',
    'Restake Rewards',
    'Swap Tokens',
    'Add Liquidity',
    'Remove Liquidity',
  ];

  return (
    <Menu isLazy>
      <MenuButton as={Button} variant="outline" rightIcon={<FiChevronDown />} minW="185px" textAlign="left">
        {typeFilter || 'All'}
      </MenuButton>

      <MenuList overflow="auto" maxH="250px">
        {options.map(option => (
          <MenuItem key={option} onClick={() => setTypeFilter(option)}>
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

interface TransactionsPerPageSelectorProps {
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
}

const TransactionsPerPageSelector = ({ perPage, setPerPage }: TransactionsPerPageSelectorProps): JSX.Element => {
  const options = [10, 20, 50, 75, 100];

  return (
    <Menu>
      <MenuButton as={Button} variant="outline" rightIcon={<FiChevronDown />} minW="160px" textAlign="left">
        {perPage} per page
      </MenuButton>

      <MenuList>
        {options.map(option => (
          <MenuItem key={option} onClick={() => setPerPage(option)}>
            {option} per page
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export const WalletTransactions = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [typeFilter, setTypeFilter] = useState('All');

  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');

  const addresses = scholars.map(scholar => scholar.address);
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

  const { isLoading, isFetching, data } = useBatchWalletTransactions(addressesWithManager);

  const filteredTransactions = useMemo(
    () =>
      typeFilter && typeFilter !== 'All'
        ? data.filter(transaction => {
            const action = getActionType(transaction.to, transaction.input);
            if (action === typeFilter) return true;
            return false;
          })
        : data,
    [data, typeFilter]
  );

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;
    return 0;
  });

  const pagedTransactions = sortedTransactions.slice((page - 1) * perPage, page * perPage);
  const numberOfPages = Math.ceil(sortedTransactions.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, perPage]);

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
          <Text fontSize="lg">Showing {sortedTransactions.length} transactions</Text>

          <Tooltip label="Only the last 50 transactions of each wallet">
            <Box>
              <AiOutlineInfoCircle />
            </Box>
          </Tooltip>
        </HStack>

        <HStack mt={{ base: 3, lg: 0 }}>
          <TransactionsTypeSelector typeFilter={typeFilter} setTypeFilter={setTypeFilter} />
          <TransactionsPerPageSelector perPage={perPage} setPerPage={setPerPage} />
        </HStack>
      </Flex>

      <TransactionsTable transactions={pagedTransactions} />

      <Pagination page={page} setPage={setPage} numberOfPages={numberOfPages} />

      <RequestStatusFloatingButton isFetching={isFetching} />
    </Box>
  );
};
