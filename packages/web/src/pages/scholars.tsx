import {
  Stack,
  Flex,
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  ButtonProps,
} from '@chakra-ui/react';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';

import { useAuth } from '../services/hooks/useAuth';
import { Header } from '../components/Header';
import { ScholarsGrid } from '../components/ScholarsGrid';
import { ScholarsSorter } from '../components/ScholarsSorter';
import { ScholarsFilterButton } from '../components/ScholarsFilter';
import { useCreateModal } from '../services/hooks/useCreateModal';
import { CloudSyncGroupButton } from '../components/CloudSyncGroupButton';
import SignInPage from './signin';
import { scholarFilter } from '@src/recoil/scholars';
import { useDebounce } from '@src/services/hooks/useDebounce';

interface PerPageSelectorSelectorProps {
  value: number;
  onChange(value: number): void;
}

const PerPageSelector = ({ value, onChange }: PerPageSelectorSelectorProps): JSX.Element => {
  const options = [20, 50, 100, 200];

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} maxW="165px" variant="outline" textAlign="left">
        {!value ? 'Scholars per page...' : `${value} rows/page`}
      </MenuButton>

      <MenuList overflow="auto" maxH="250px">
        {options.map(option => (
          <MenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

const SearchInput = (): JSX.Element => {
  const setFilters = useSetRecoilState(scholarFilter);

  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchValue }));
  }, [debouncedSearchValue, setFilters]);

  return (
    <Box maxW="250px">
      <InputGroup>
        <Input placeholder="Search by name" onChange={e => setSearchValue(e.target.value)} value={searchValue} />

        {searchValue !== debouncedSearchValue && (
          <InputRightElement>
            <Spinner size="sm" />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

const SyncModalContent = (): JSX.Element => {
  const { session } = useAuth();

  return <Box p={5}>{session ? <CloudSyncGroupButton /> : <SignInPage />}</Box>;
};

function SyncButton({ variant = 'ghost' }: ButtonProps) {
  const syncModal = useCreateModal({
    id: 'syncModal',
    title: 'Sync Scholars',
    content: <SyncModalContent />,
  });

  return (
    <Button leftIcon={<AiOutlineCloudSync />} variant={variant} onClick={syncModal.onOpen}>
      Sync
    </Button>
  );
}

export const ScholarsPage = (): JSX.Element => {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <Box maxW="1450px" margin="auto">
      <Flex direction="column" justify="space-between" px={3} py={6}>
        <Header />

        <Stack spacing={5} mt={5}>
          <Accordion display={{ md: 'block', lg: 'none' }} allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Text>Options</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Flex align="center" justify="space-between" flexDirection={{ md: 'column', lg: 'row' }}>
                  <SearchInput />

                  <Stack
                    justify="flex-end"
                    spacing={5}
                    mt={{ base: 3, lg: 0 }}
                    direction={{ base: 'column', lg: 'row' }}
                  >
                    <SyncButton variant="solid" />
                    <ScholarsFilterButton variant="solid" />
                    <ScholarsSorter />
                    <PerPageSelector value={perPage} onChange={setPerPage} />
                  </Stack>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Flex
            align="center"
            justify="space-between"
            flexDirection={{ md: 'column', lg: 'row' }}
            display={{ md: 'none', lg: 'flex' }}
          >
            <SearchInput />

            <Stack justify="flex-end" spacing={5} mt={{ base: 3, lg: 0 }} direction={{ md: 'column', lg: 'row' }}>
              <SyncButton variant="solid" />
              <ScholarsFilterButton variant="solid" />
              <ScholarsSorter />
              <PerPageSelector value={perPage} onChange={setPerPage} />
            </Stack>
          </Flex>

          <ScholarsGrid page={page} setPage={setPage} perPage={perPage} />
        </Stack>
      </Flex>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(ScholarsPage), { ssr: false });
