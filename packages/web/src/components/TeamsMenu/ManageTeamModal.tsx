import { Box, Flex, HStack, Tag, Button, Text, Table, Thead, Tr, Th, Tbody, Td, IconButton } from '@chakra-ui/react';
import { GoDiffRemoved } from 'react-icons/go';
import { BiTrashAlt } from 'react-icons/bi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useRecoilTransaction_UNSTABLE, useRecoilValue, useSetRecoilState } from 'recoil';
import { useMemo } from 'react';

import { Card } from '@components/Card';
import { selectedTeamAtom, teamsMapAtom, teamStateAtomFamily } from '@src/recoil/teams';
import { scholarSelector, scholarsMap } from '@src/recoil/scholars';
import { useCreateModal } from '@src/services/hooks/useCreateModal';
import { AddScholarModal } from './AddScholarModal';
import { ScholarAddress } from '../ScholarsGrid/Scholar/ScholarAddress';
import { EditScholarButton } from '../ScholarsGrid/Scholar/EditScholarButton';
import { useSimpleConfirmModal } from '@src/services/hooks/useSimpleConfirmModal';

interface RemoveScholarButtonProps {
  address: string;
  size: string;
  teamId: string;
}

const RemoveScholarButton = ({ address, size, teamId }: RemoveScholarButtonProps): JSX.Element => {
  const setTeam = useSetRecoilState(teamStateAtomFamily(teamId));

  const handleRemove = () => {
    setTeam(prev => {
      const draft = Array.from(prev.scholarsMap);
      const index = draft.findIndex(teamScholarAddress => teamScholarAddress === address);
      if (index !== -1) {
        draft.splice(index, 1);
        return { ...prev, scholarsMap: draft };
      }
      return { ...prev, scholarsMap: draft };
    });
  };

  const confirmDialog = useSimpleConfirmModal({
    title: 'Remove Scholar?',
    message: 'Are you sure you want to remove this scholar from the team?',
    onConfirm: handleRemove,
  });

  return (
    <IconButton
      aria-label="Remove Scholar"
      icon={<GoDiffRemoved />}
      onClick={confirmDialog.onOpen}
      size={size || 'lg'}
    />
  );
};

interface TeamScholarTableEntryProps {
  index: number;
  address: string;
  teamId: string;
}

const TeamScholarTableEntry = ({ index, address, teamId }: TeamScholarTableEntryProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <Tr>
      <Td>{index + 1}</Td>
      <Td>{scholar.name}</Td>
      <Td>
        <ScholarAddress address={scholar.address} showButton={false} />
      </Td>
      <Td>{scholar.shares.scholar}%</Td>
      <Td>{scholar.shares.manager}%</Td>
      <Td>{scholar.shares.investor}%</Td>
      <Td>{scholar.paymentAddress && <ScholarAddress address={scholar.paymentAddress} />}</Td>

      <Td>{scholar.inactive && 'Yes'}</Td>

      <Td>
        <HStack>
          <EditScholarButton address={address} onlyIcon size="sm" />
          <RemoveScholarButton address={address} teamId={teamId} size="sm" />
        </HStack>
      </Td>
    </Tr>
  );
};

interface DeleteTeamButtonProps {
  id: string;
}

const DeleteTeamButton = ({ id }: DeleteTeamButtonProps): JSX.Element => {
  const handleDeleteTeam = useRecoilTransaction_UNSTABLE(
    ({ get, set, reset }) =>
      () => {
        const selected = get(selectedTeamAtom);
        const draft = get(teamsMapAtom);
        const index = draft.findIndex(teamId => teamId === id);
        if (index !== -1) {
          draft.splice(index, 1);
          set(teamsMapAtom, draft);
          reset(teamStateAtomFamily(id));

          if (id === selected) {
            reset(selectedTeamAtom);
          }
        }
      },
    [id]
  );

  const confirmDialog = useSimpleConfirmModal({
    title: 'Delete Team?',
    message: 'Are you sure you want to delete this team?',
    onConfirm: handleDeleteTeam,
  });

  return (
    <Button size="sm" onClick={confirmDialog.onOpen} colorScheme="red" leftIcon={<BiTrashAlt />}>
      Delete Team
    </Button>
  );
};

interface ManageTeamModalProps {
  id: string;
}

export const ManageTeamModal = ({ id }: ManageTeamModalProps): JSX.Element => {
  const team = useRecoilValue(teamStateAtomFamily(id));
  const scholars = useRecoilValue(scholarsMap);

  const teamScholars = useMemo(
    () => scholars.filter(scholar => team.scholarsMap.includes(scholar.address)),
    [scholars, team.scholarsMap]
  );

  const addScholarModal = useCreateModal({
    id: 'addScholarModal',
    title: () => 'Add Scholars',
    content: () => <AddScholarModal teamId={id} />,
    size: '6xl',
  });

  return (
    <Box p={{ base: 0, lg: 3 }}>
      <Flex align="center" justify="space-between" direction={{ base: 'column', lg: 'row' }}>
        <HStack>
          <Tag>{team.scholarsMap.length} scholars</Tag>
          <Tag>{team.id}</Tag>
        </HStack>

        <HStack mt={{ base: 5, lg: 0 }} w={{ base: '100%', lg: 'auto' }}>
          <Button size="sm" onClick={addScholarModal.onOpen} leftIcon={<AiOutlineUserAdd />}>
            Add Scholar
          </Button>

          <DeleteTeamButton id={id} />
        </HStack>
      </Flex>

      <Card mt={3} p={3} overflowX="auto" borderWidth={1}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Scholar %</Th>
              <Th>Manager %</Th>
              <Th>Investor %</Th>
              <Th>Payment Address</Th>
              <Th>Inactive?</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {teamScholars.map((scholar, index) => (
              <TeamScholarTableEntry key={scholar.address} index={index} address={scholar.address} teamId={id} />
            ))}

            {!teamScholars.length && (
              <Tr>
                <Td colSpan={8}>
                  <Text variant="faded" textAlign="center" py={3}>
                    No scholars
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Card>
    </Box>
  );
};
