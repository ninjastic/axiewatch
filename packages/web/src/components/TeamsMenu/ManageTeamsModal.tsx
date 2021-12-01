import { Box, Button, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { BiAddToQueue } from 'react-icons/bi';
import { useMemo } from 'react';

import { teamsMapAtom, teamStateAtomFamily } from '@src/recoil/teams';
import { Card } from '../Card';
import { useCreateModal } from '@src/services/hooks/useCreateModal';
import { CreateTeamModal } from './CreateTeamModal';
import { ManageTeamModal } from './ManageTeamModal';
import { scholarsMap } from '@src/recoil/scholars';

interface TeamCardProps {
  id: string;
}

const TeamCard = ({ id }: TeamCardProps): JSX.Element => {
  const team = useRecoilValue(teamStateAtomFamily(id));
  const scholars = useRecoilValue(scholarsMap);

  const teamScholars = useMemo(
    () => scholars.filter(scholar => team.scholarsMap.includes(scholar.address)),
    [scholars, team.scholarsMap]
  );

  const manageTeamModal = useCreateModal({
    id: 'manageTeamModal',
    title: () => team.name,
    content: () => <ManageTeamModal id={id} />,
    size: '6xl',
  });

  return (
    <Card
      key={id}
      p={3}
      borderWidth={1}
      onClick={manageTeamModal.onOpen}
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg', borderColor: 'gray.400', cursor: 'pointer' }}
      transition="all 0.05s ease"
    >
      <Stack>
        <Text fontWeight="bold">{team.name}</Text>

        <Text>{teamScholars.length} scholars</Text>
      </Stack>
    </Card>
  );
};

export const ManageTeamsModal = (): JSX.Element => {
  const teams = useRecoilValue(teamsMapAtom);

  const createTeamModal = useCreateModal({
    id: 'createTeamModal',
    title: () => 'Create Team',
    content: () => <CreateTeamModal />,
    size: '3xl',
  });

  return (
    <Box py={3} px={2}>
      <Button onClick={createTeamModal.onOpen} leftIcon={<BiAddToQueue />}>
        Create
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 3, xl: 5 }} gap={3} mt={5}>
        {teams.map(id => (
          <TeamCard key={id} id={id} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
