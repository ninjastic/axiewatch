import {
  Box,
  Text,
  Table,
  Thead,
  Th,
  Td,
  Tbody,
  Tr,
  Checkbox,
  HStack,
  Tooltip,
  Button,
  Flex,
  Divider,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BiExport } from 'react-icons/bi';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useMemo, useState } from 'react';
import produce from 'immer';

import { scholarsMap } from 'src/recoil/scholars';
import { Card } from 'components/Card';
import { EditScholarButton } from 'src/components/ScholarsGrid/Scholar/EditScholarButton';
import { Pagination } from 'src/components/Pagination';
import { useDebounce } from 'src/services/hooks/useDebounce';

const exportBotScholarNameSearchAtom = atom<string>({
  key: 'exportBotScholarNameSearchAtom',
  default: '',
});

const SearchInput = (): JSX.Element => {
  const setSearchName = useSetRecoilState(exportBotScholarNameSearchAtom);

  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    setSearchName(debouncedSearchValue);
  }, [debouncedSearchValue, setSearchName]);

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

export const ExportDiscordBot = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const searchName = useRecoilValue(exportBotScholarNameSearchAtom);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);

  useEffect(() => {
    setPage(1);
  }, [page, perPage]);

  const filteredData = useMemo(
    () =>
      searchName ? scholars.filter(scholar => scholar.name.toLowerCase().includes(searchName.toLowerCase())) : scholars,
    [scholars, searchName]
  );

  const pageData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage]
  );

  const numberOfPages = Math.ceil(scholars.length / perPage);

  const shortAddress = useCallback(
    (address: string) => (address ? `${address.substr(0, 5)}...${address.substr(address.length - 5)}` : null),
    []
  );

  const handleToggle = (address: string) => {
    setSelected(prev =>
      produce(prev, draft => {
        const index = draft.findIndex(draftAddress => draftAddress === address);
        if (index !== -1) draft.splice(index, 1);
        else draft.push(address);
      })
    );
  };

  const selectAll = () => {
    setSelected(scholars.filter(scholar => scholar.discordId).map(scholar => scholar.address));
  };

  const unselectAll = () => {
    setSelected([]);
  };

  const handleExport = () => {
    const preContentText = 'data:text/csv;charset=utf-8,';

    const data = selected.map(selectedAddress => {
      const scholar = scholars.find(schol => schol.address === selectedAddress);
      return {
        accountAddr: scholar.address.replace('ronin:', '0x'),
        discordID: scholar.discordId,
        scholarShare: scholar.shares.scholar / 100,
        payoutAddress: scholar.paymentAddress?.replace('ronin:', '0x'),
      };
    });

    const content = data.reduce((_content, row) => {
      return `${
        _content +
        Object.values(row)
          .filter(r => !!r)
          .join(',')
      }\r\n`;
    }, preContentText);

    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'import.txt');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Box>
      <HStack>
        <Button
          onClick={selected.length ? unselectAll : selectAll}
          isDisabled={!scholars.find(scholar => scholar.discordId)}
        >
          {selected.length ? 'Unselect All' : 'Select All'}
        </Button>

        <SearchInput />
      </HStack>

      <Card my={3} p={3} overflowX="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Scholar %</Th>
              <Th>
                <HStack spacing={1} align="center">
                  <Text>Manager %</Text>

                  <Tooltip label="The bot doesn't support investor share, so its percentage (if any) will be shared with the manager.">
                    <Box>
                      <AiOutlineInfoCircle size={14} />
                    </Box>
                  </Tooltip>
                </HStack>
              </Th>
              <Th>
                <HStack spacing={1}>
                  <Text>Discord ID</Text>
                  <Text color="red">*</Text>
                </HStack>
              </Th>
              <Th>Payment Address</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>

          <Tbody>
            {pageData.map(scholar => {
              const isSelected = selected.find(selectedAddress => selectedAddress === scholar.address);
              return (
                <Tr key={scholar.address}>
                  <Td>
                    <HStack spacing={3}>
                      <Tooltip label="Missing Discord ID, which is required." isDisabled={!!scholar.discordId}>
                        <Box>
                          <Checkbox
                            isChecked={!!isSelected}
                            onChange={() => handleToggle(scholar.address)}
                            isDisabled={!scholar.discordId}
                          >
                            <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" maxW="150px">
                              {scholar.name}
                            </Text>
                          </Checkbox>
                        </Box>
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td>
                    <Link href={`https://marketplace.axieinfinity.com/profile/${scholar.address}`} target="_blank">
                      {shortAddress(scholar.address.replace('ronin:', '0x'))}
                    </Link>
                  </Td>
                  <Td>{scholar.shares.scholar}%</Td>
                  <Td>{scholar.shares.manager + (scholar.shares.investor ?? 0)}%</Td>
                  <Td>{scholar.discordId ?? <Text variant="faded">MISSING ID</Text>}</Td>
                  <Td>{shortAddress(scholar.paymentAddress?.replace('ronin:', '0x'))}</Td>
                  <Td>
                    <EditScholarButton address={scholar.address} size="sm" />
                  </Td>
                </Tr>
              );
            })}

            {searchName && !pageData.length && (
              <Tr>
                <Td colSpan={7}>
                  <Text textAlign="center" variant="faded" p={3}>
                    No results match your filters
                  </Text>
                </Td>
              </Tr>
            )}

            {!searchName && !pageData.length && (
              <Tr>
                <Td colSpan={7}>
                  <Text textAlign="center" variant="faded" p={3}>
                    Nothing to see here
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Card>

      <Pagination numberOfPages={numberOfPages} page={page} setPage={setPage} />

      <Divider />

      <Flex my={3} justify="flex-end">
        <Button onClick={handleExport} isDisabled={!selected.length} rightIcon={<BiExport />}>
          Export
        </Button>
      </Flex>
    </Box>
  );
};
