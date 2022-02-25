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
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';

import { useAuth } from '../services/hooks/useAuth';
import { Header } from '../components/Header';
import { ScholarsGrid } from '../components/ScholarsGrid';
import { ScholarsSorter } from '../components/ScholarsSorter';
import { ScholarsFilterButton } from '../components/ScholarsFilter';
import { useCreateModal } from '../services/hooks/useCreateModal';
import { CloudSyncGroupButton } from '../components/CloudSyncGroupButton';
import { scholarFilter, scholarsPerPageAtom } from 'src/recoil/scholars';
import { useDebounce } from 'src/services/hooks/useDebounce';
import { SignInForm } from 'src/components/SignInForm';

const PerPageSelector = (): JSX.Element => {
  const options = [20, 50, 100, 200];
  const [value, setValue] = useRecoilState(scholarsPerPageAtom);

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} maxW="165px" variant="outline" textAlign="left">
        {value} rows/page
      </MenuButton>

      <MenuList overflow="auto" maxH="250px">
        {options.map(option => (
          <MenuItem key={option} onClick={() => setValue(option)}>
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

  return <Box p={5}>{session ? <CloudSyncGroupButton /> : <SignInForm />}</Box>;
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  return (
    <Box maxW="1450px" margin="auto">
      <Flex direction="column" justify="space-between" px={3} py={6}>
        <Header />

        <Stack spacing={5} mt={5}>
          <Accordion display={{ base: 'block', lg: 'none' }} allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Text>Options</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Flex align="center" justify="space-between" flexDirection={{ base: 'column', md: 'row', lg: 'row' }}>
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
                    <PerPageSelector />
                  </Stack>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Flex align="center" justify="space-between" flexDirection="row" display={{ base: 'none', lg: 'flex' }}>
            <SearchInput />

            <Stack justify="flex-end" spacing={5} mt={{ base: 3, lg: 0 }} direction={{ md: 'column', lg: 'row' }}>
              <SyncButton variant="solid" />
              <ScholarsFilterButton variant="solid" />
              <ScholarsSorter />
              <PerPageSelector />
            </Stack>
          </Flex>

          <ScholarsGrid page={page} setPage={setPage} />
        </Stack>
      </Flex>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(ScholarsPage), { ssr: false });
