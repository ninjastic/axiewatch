import { HStack, Text, Stack, Icon, Tooltip, Flex, chakra, Image } from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { GiReceiveMoney } from 'react-icons/gi';
import { IoSchoolOutline } from 'react-icons/io5';
import { MdBusinessCenter } from 'react-icons/md';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { RiSwordLine } from 'react-icons/ri';
import { useCallback } from 'react';

import { Card } from 'src/components/Card';
import { ScholarFields } from '../../../../recoil/scholars';

const NameFieldPlaceholder = (): JSX.Element => {
  return (
    <Card w="115px" h="100%" p={2} borderWidth={1}>
      <Text fontSize="md" fontWeight="bold" textAlign="center" pt={2}>
        Scholar 1
      </Text>
    </Card>
  );
};

const SlpFieldPlaceholder = (): JSX.Element => {
  return (
    <Card p={2} h="100%" borderWidth={1}>
      <Text opacity={0.9} fontSize="xs">
        $42.69
      </Text>

      <HStack>
        <Image src="/images/axies/slp.png" width="16px" alt="slp" />
        <Text>1050</Text>
      </HStack>
    </Card>
  );
};

const ScholarSharePlaceholder = (): JSX.Element => {
  return (
    <Card p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Scholar
        </Text>

        <HStack>
          <IoSchoolOutline />
          <Text>471</Text>
        </HStack>
      </Stack>
    </Card>
  );
};

const ManagerSharePlaceholder = (): JSX.Element => {
  return (
    <Card p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Manager
        </Text>

        <HStack>
          <MdBusinessCenter />
          <Text>55</Text>
        </HStack>
      </Stack>
    </Card>
  );
};

const InvestorSharePlaceholder = (): JSX.Element => {
  return (
    <Card p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Investor
        </Text>

        <HStack>
          <GiReceiveMoney />
          <Text>526</Text>
        </HStack>
      </Stack>
    </Card>
  );
};

const ArenaEloPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="80px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Arena
        </Text>

        <HStack>
          <Icon as={RiSwordLine} />

          <Text>1449</Text>
        </HStack>
      </Stack>
    </Card>
  );
};

const YesterdaySlpPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="80px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Yesterday
        </Text>

        <Text>120</Text>
      </Stack>
    </Card>
  );
};

const TodaySlpPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="80px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Today
        </Text>

        <Text>75</Text>
      </Stack>
    </Card>
  );
};

const SlpDayPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="80px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Average
        </Text>

        <Text color="red.200" fontWeight="bold" fontSize="sm">
          115 / day
        </Text>
      </Stack>
    </Card>
  );
};

const AdventureSlpPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="80px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Adventure
        </Text>

        <Text>40 / 50</Text>
      </Stack>
    </Card>
  );
};

const LastClaimPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="90px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Last Claim
        </Text>

        <HStack>
          <AiOutlineClockCircle />
          <Text fontSize="sm">5 days</Text>
        </HStack>
      </Stack>
    </Card>
  );
};

const NextClaimPlaceholder = (): JSX.Element => {
  return (
    <Card maxW="110px" p={2} h="100%" borderWidth={1}>
      <Stack spacing={0}>
        <Text opacity={0.9} fontSize="xs">
          Next Claim
        </Text>

        <HStack>
          <AiOutlineClockCircle />
          <Text fontSize="sm">in 9 days</Text>
        </HStack>
      </Stack>
    </Card>
  );
};

interface ScholarDraggableFieldsProps {
  fields: ScholarFields[];
  fixedFields?: ScholarFields[];
}

export const ScholarDraggableFields = ({ fields, fixedFields }: ScholarDraggableFieldsProps): JSX.Element => {
  const fieldsList = {
    name: <NameFieldPlaceholder />,
    slp: <SlpFieldPlaceholder />,
    scholarShare: <ScholarSharePlaceholder />,
    managerShare: <ManagerSharePlaceholder />,
    investorShare: <InvestorSharePlaceholder />,
    arenaElo: <ArenaEloPlaceholder />,
    yesterdaySlp: <YesterdaySlpPlaceholder />,
    todaySlp: <TodaySlpPlaceholder />,
    slpDay: <SlpDayPlaceholder />,
    adventureSlp: <AdventureSlpPlaceholder />,
    lastClaim: <LastClaimPlaceholder />,
    nextClaim: <NextClaimPlaceholder />,
  } as { [key: string]: JSX.Element };

  const isDisabled = useCallback((key: ScholarFields) => fixedFields && fixedFields.includes(key), [fixedFields]);

  return (
    <Flex>
      {fields.map((key, index) => (
        <Draggable key={key} draggableId={key} index={index} isDragDisabled={isDisabled(key)}>
          {provided => (
            <Tooltip label={key}>
              <chakra.div
                mr={2}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                _hover={{ cursor: isDisabled(key) ? 'not-allowed' : 'grab' }}
              >
                {fieldsList[key]}
              </chakra.div>
            </Tooltip>
          )}
        </Draggable>
      ))}
    </Flex>
  );
};
