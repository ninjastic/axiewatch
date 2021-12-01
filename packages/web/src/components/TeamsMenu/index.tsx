import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  Box,
  MenuItem,
  MenuDivider,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiChevronDown, FiEdit3 } from 'react-icons/fi';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { useState } from 'react';

import { selectedTeamAtom, teamsMapAtom, teamStateAtomFamily } from '@src/recoil/teams';
import { useCreateModal } from '@src/services/hooks/useCreateModal';
import { ManageTeamsModal } from './ManageTeamsModal';
import { scholarsMap } from '@src/recoil/scholars';

interface TeamMenuItemProps {
  id: string | null;
}

const TeamMenuItem = ({ id }: TeamMenuItemProps): JSX.Element => {
  const team = useRecoilValue(teamStateAtomFamily(id));
  const setSelected = useSetRecoilState(selectedTeamAtom);
  const scholars = useRecoilValue(scholarsMap);

  if (!id) {
    return (
      <MenuItem onClick={() => setSelected('')} command={String(scholars.length)} fontWeight="bold">
        All scholars
      </MenuItem>
    );
  }

  return (
    <MenuItem
      key={id}
      onClick={() => setSelected(id)}
      command={team.scholarsMap.length > 0 ? String(team.scholarsMap.length) : undefined}
    >
      {team.name}
    </MenuItem>
  );
};

export const TeamsMenu = (): JSX.Element => {
  const [searchFilter, setSearchFilter] = useState('');

  const teams = useRecoilValue(teamsMapAtom);
  const selected = useRecoilValue(selectedTeamAtom);

  const findTeamByName = useRecoilCallback(({ snapshot }) => (filter: string) => {
    return snapshot
      .getLoadable(teamsMapAtom)
      .getValue()
      .filter(id => {
        const teamState = snapshot.getLoadable(teamStateAtomFamily(id)).getValue();
        return teamState.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      });
  });

  const filteredTeams = searchFilter ? findTeamByName(searchFilter) : teams;

  const manageTeamsModal = useCreateModal({
    id: 'manageTeamsModal',
    title: () => 'Manage Teams',
    content: () => <ManageTeamsModal />,
    size: '6xl',
  });

  const getTeamState = useRecoilCallback(({ snapshot }) => (id: string) => {
    return snapshot.getLoadable(teamStateAtomFamily(id)).getValue();
  });

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w={{ base: '100%', lg: 'auto' }}>
        {getTeamState(selected).name || 'Teams'}
      </MenuButton>

      <MenuList>
        <Box p={2}>
          <Input placeholder="Search..." onChange={e => setSearchFilter(e.target.value)} value={searchFilter} />
        </Box>

        <MenuDivider color={useColorModeValue('gray.200', 'gray.700')} />

        <MenuItem onClick={manageTeamsModal.onOpen} icon={<FiEdit3 />} fontWeight="bold">
          Manage Teams
        </MenuItem>

        <MenuDivider color={useColorModeValue('gray.200', 'gray.700')} />

        <Box overflowY="auto" maxH="300px">
          <TeamMenuItem id={null} />

          {filteredTeams.map(id => (
            <TeamMenuItem key={id} id={id} />
          ))}

          {searchFilter && !filteredTeams.length && (
            <Box textAlign="center" py={2}>
              <Text variant="faded">No results...</Text>
            </Box>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
};
