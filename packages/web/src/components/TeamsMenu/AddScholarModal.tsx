import {
  Box,
  Text,
  SimpleGrid,
  GridItem,
  Stack,
  HStack,
  Button,
  Flex,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Card } from '../Card';
import { scholarSelector, scholarsMap } from '@src/recoil/scholars';
import { ScholarAddress } from '../ScholarsGrid/Scholar/ScholarAddress';
import { teamStateAtomFamily } from '@src/recoil/teams';
import { modalSelector } from '@src/recoil/modal';
import { NewScholarButton } from '../Header/NewScholarButton';
import { useCreateModal } from '@src/services/hooks/useCreateModal';

interface SelectScholarListModalProps {
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectScholarListModal = ({ setSelected }: SelectScholarListModalProps) => {
  const [list, setList] = useState('');
  const scholars = useRecoilValue(scholarsMap);
  const modal = useRecoilValue(modalSelector('selectScholarListModal'));

  const handleSelect = () => {
    const addresses = list
      .replaceAll('"', '')
      .trim()
      .split('\n')
      .filter(address => scholars.find(scholar => scholar.address === address));

    if (!addresses.length) {
      toast('No scholars were found', { type: 'error' });
      return;
    }

    setSelected(prev => {
      return Array.from(new Set(prev.concat(addresses)));
    });

    toast(`Selected ${addresses.length} scholars`);

    modal.onClose();
  };

  return (
    <Card p={{ base: 3, lg: 5 }} my={2}>
      <Stack spacing={5}>
        <Text>
          Paste a list with the addresses of the{' '}
          <Text fontWeight="bold" as="span">
            already added scholars
          </Text>{' '}
          that you want to select.
        </Text>

        <FormControl id="list">
          <FormLabel fontWeight="bold">Addresses (1 per line)</FormLabel>
          <Textarea value={list} onChange={e => setList(e.target.value)} minH={32} placeholder="ronin:Abcdf..." />
        </FormControl>

        <Flex justify="flex-end">
          <Button onClick={handleSelect}>Select</Button>
        </Flex>
      </Stack>
    </Card>
  );
};

interface SelectScholarListButtonProps {
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectScholarListButton = ({ setSelected }: SelectScholarListButtonProps) => {
  const selectScholarListModal = useCreateModal({
    id: 'selectScholarListModal',
    title: () => 'Select from list',
    content: () => <SelectScholarListModal setSelected={setSelected} />,
    size: '3xl',
  });

  return (
    <Button size="sm" onClick={selectScholarListModal.onOpen}>
      Select from list
    </Button>
  );
};

interface ScholarListItemProps {
  address: string;
  isSelected: boolean;
  handleSelect: (address: string) => void;
}

const ScholarListItem = ({ address, isSelected, handleSelect }: ScholarListItemProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const selectedBorderColor = useColorModeValue('light.card', 'dark.card');

  return (
    <Card
      p={3}
      cursor="pointer"
      onClick={() => handleSelect(address)}
      borderWidth={1}
      borderColor={isSelected ? 'darkGray.500' : selectedBorderColor}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} alignItems="center">
        <Stack spacing={0}>
          <Text fontWeight="bold">{scholar.name}</Text>

          <ScholarAddress address={scholar.address} showButton={false} />
        </Stack>

        <Box ml="auto" px={3}>
          {isSelected ? <MdCheckBox size={24} /> : <MdCheckBoxOutlineBlank size={24} />}
        </Box>
      </SimpleGrid>
    </Card>
  );
};

interface AddScholarModalProps {
  teamId: string;
}

export const AddScholarModal = ({ teamId }: AddScholarModalProps): JSX.Element => {
  const [page, setPage] = useState(0);
  const [perPage] = useState(24);

  const [searchFilter, setSearchFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const [team, setTeam] = useRecoilState(teamStateAtomFamily(teamId));
  const modal = useRecoilValue(modalSelector('addScholarModal'));

  const scholars = useRecoilValue(scholarsMap);

  const availableScholars = useMemo(
    () => scholars.filter(scholar => !team.scholarsMap.includes(scholar.address)),
    [scholars, team.scholarsMap]
  );

  const filteredScholars = useMemo(
    () =>
      searchFilter
        ? availableScholars.filter(scholar => {
            return scholar.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1;
          })
        : availableScholars,
    [availableScholars, searchFilter]
  );

  const pageData = useMemo(
    () => filteredScholars.slice(page * perPage, (page + 1) * perPage),
    [filteredScholars, page, perPage]
  );

  const numberOfPages = useMemo(() => Math.ceil(filteredScholars.length / perPage), [filteredScholars.length, perPage]);

  useEffect(() => {
    setPage(0);
  }, [numberOfPages, searchFilter]);

  const handleSelect = (address: string) => {
    setSelected(prev => {
      const draft = Array.from(prev);
      const index = draft.findIndex(selectedAddress => selectedAddress === address);
      if (index !== -1) {
        draft.splice(index, 1);
        return draft;
      }
      draft.push(address);
      return draft;
    });
  };

  const handleAddSelected = () => {
    setTeam(prev => {
      const draft = { ...prev };
      draft.scholarsMap = draft.scholarsMap.concat(selected);
      return draft;
    });
    console.log(team);
    modal.onClose();
  };

  return (
    <Box py={3}>
      <Flex align="center" justify="space-between">
        <Box maxW="lg">
          <Input placeholder="Search..." onChange={e => setSearchFilter(e.target.value)} />
        </Box>

        <HStack>
          <SelectScholarListButton setSelected={setSelected} />

          <Button isDisabled={!selected.length} onClick={handleAddSelected} size="sm">
            Add {selected.length} selected
          </Button>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} gap={3} mt={4}>
        {pageData.map(scholar => (
          <ScholarListItem
            key={scholar.address}
            address={scholar.address}
            isSelected={selected.includes(scholar.address)}
            handleSelect={handleSelect}
          />
        ))}

        {searchFilter && !filteredScholars.length && (
          <GridItem colSpan={{ base: 1, md: 3, lg: 4 }}>
            <Box textAlign="center" p={5}>
              <Text variant="faded">No results...</Text>
            </Box>
          </GridItem>
        )}

        {!searchFilter && !filteredScholars.length && (
          <GridItem colSpan={{ base: 1, md: 3, lg: 4 }}>
            <Box textAlign="center" p={5}>
              <Text variant="faded" mb={3}>
                No scholars remaining... create a new one?
              </Text>

              <NewScholarButton />
            </Box>
          </GridItem>
        )}
      </SimpleGrid>

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
