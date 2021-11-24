import { Text, Tr, Td, HStack, Image, Box, SkeletonCircle, Link, Tooltip, Button } from '@chakra-ui/react';
import { GiBattleGear } from 'react-icons/gi';
import { FaPaw } from 'react-icons/fa';

import { APIBattlesResponseItem } from '../../types/api';
import dayjs from '../../services/dayjs';

interface BattleCardProps {
  battle: APIBattlesResponseItem;
  address: string;
}

export const BattleTableEntry = ({ battle, address }: BattleCardProps): JSX.Element => {
  const date = dayjs.utc(battle.created_at);
  const formattedDate = date.format('DD MMM YYYY, HH:mm:ss');
  const relativeDate = date.fromNow();

  const type = battle.battle_type === 1 ? 'PVE' : 'PVP';

  const scholarTeamNumber = battle.first_client_id === address ? 0 : 1;
  const oponentStartIndex = scholarTeamNumber === 0 ? 3 : 0;

  const oponentAxies = [
    battle.fighters[oponentStartIndex],
    battle.fighters[oponentStartIndex + 1],
    battle.fighters[oponentStartIndex + 2],
  ];

  const scholarResult = battle.winner === scholarTeamNumber ? 'Win' : 'Lose';
  const result = battle.winner === 2 ? 'Draw' : scholarResult;

  const getResultColor = () => {
    if (result === 'Win') return 'green.300';
    if (result === 'Lose') return 'red.300';
    if (result === 'Draw') return 'gray.400';
    return '';
  };

  const getAxieImage = (id: number) =>
    `https://storage.googleapis.com/assets.axieinfinity.com/axies/${id}/axie/axie-full-transparent.png`;

  const pveRuinLevel = battle.second_client_id.match(/chimera-\d+-(\d+)/)?.splice(1) ?? '-';

  const replayUrl = `axie://?f=rpl&q=${battle.battle_uuid}`;

  return (
    <Tr>
      <Td>
        <Tooltip label={formattedDate}>
          <Text>{relativeDate}</Text>
        </Tooltip>
      </Td>

      <Td>
        <HStack>
          {type === 'PVP' && <GiBattleGear />}
          {type === 'PVE' && <FaPaw />}
          <Text>{type}</Text>
        </HStack>
      </Td>

      <Td>
        <Text color={getResultColor()} fontWeight="bold">
          {result}
        </Text>
      </Td>

      <Td w="40">
        <HStack h="30px" w="80">
          {type === 'PVP' ? (
            oponentAxies.map(oponentAxie => (
              <Link
                href={`https://marketplace.axieinfinity.com/axie/${oponentAxie.fighter_id}`}
                target="_blank"
                key={oponentAxie.fighter_id}
              >
                <Image
                  src={getAxieImage(oponentAxie.fighter_id)}
                  w="60px"
                  h="45px"
                  cursor="pointer"
                  alt={`Axie ${oponentAxie.fighter_id}`}
                  fallback={
                    <Box d="flex" alignItems="center" justifyContent="center" w="60px" h="45px">
                      <SkeletonCircle />
                    </Box>
                  }
                  transition="all .2s ease-out"
                  _hover={{ transform: 'translateY(-4px)', opacity: 0.9 }}
                />
              </Link>
            ))
          ) : (
            <Text>Lunacia Ruin {pveRuinLevel}</Text>
          )}
        </HStack>
      </Td>

      <Td>
        <Button onClick={() => window.open(replayUrl, '_blank')} isDisabled>
          Watch
        </Button>
      </Td>
    </Tr>
  );
};
