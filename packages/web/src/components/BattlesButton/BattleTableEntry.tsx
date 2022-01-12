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
  const date = dayjs.utc(battle.game_started);
  const formattedDate = date.format('DD MMM YYYY, HH:mm:ss');
  const relativeDate = date.fromNow();

  const type = battle.eloAndItem === undefined ? 'PVE' : 'PVP';

  const oponentAxies = battle.first_client_id === address ? battle.second_team_fighters : battle.first_team_fighters;

  const isWin = battle.winner === address;
  const isLose =
    battle.winner !== address &&
    (battle.winner === battle.first_client_id || battle.winner === battle.second_client_id);
  const isDraw = !isWin && !isLose;

  const getResultColor = () => {
    if (isWin) return 'green.300';
    if (isDraw) return 'gray.400';
    if (isLose) return 'red.300';
    return '';
  };

  const getResult = () => {
    if (isWin) return 'Win';
    if (isDraw) return 'Draw';
    if (isLose) return 'Lose';
    return '';
  };

  const getEloChanges = () => {
    if (type === 'PVP') {
      const result = battle.eloAndItem.find(eloAndItem => eloAndItem.player_id === address);

      if (result && result.new_elo > result.old_elo) {
        return (
          <Text fontSize="sm">
            {result.old_elo} -&gt; {result.new_elo} (+{result.new_elo - result.old_elo})
          </Text>
        );
      }

      if (result && result.new_elo < result.old_elo) {
        return (
          <Text fontSize="sm">
            {result.old_elo} -&gt; {result.new_elo} ({result.new_elo - result.old_elo})
          </Text>
        );
      }
    }

    return null;
  };

  const getSlpChanges = () => {
    if (type === 'PVP' && isWin) {
      const result = battle.eloAndItem.find(eloAndItem => eloAndItem.player_id === address);
      if (result?._items?.length) return <Text>+{result._items[0].amount} SLP</Text>;
    }

    if (type === 'PVE' && battle._items?.length) {
      return <Text>+{battle._items[0].amount} SLP</Text>;
    }

    return null;
  };

  const getAxieImage = (id: number) =>
    `https://storage.googleapis.com/assets.axieinfinity.com/axies/${id}/axie/axie-full-transparent.png`;

  const pveRuinLevel = battle.stage_index;

  const replayUrl = `https://cdn.axieinfinity.com/game/deeplink.html?f=rpl&q=${battle.battle_uuid}`;

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
          {getResult()}
        </Text>
      </Td>

      <Td>
        <Text color={getResultColor()} fontWeight="bold">
          {getEloChanges()}
        </Text>
      </Td>

      <Td>
        <Text color={getResultColor()} fontWeight="bold">
          {getSlpChanges()}
        </Text>
      </Td>

      <Td w="30">
        <HStack h="30px" w="50">
          {type === 'PVP' ? (
            oponentAxies.map(oponentAxie => (
              <Link href={`https://marketplace.axieinfinity.com/axie/${oponentAxie}`} target="_blank" key={oponentAxie}>
                <Image
                  src={getAxieImage(oponentAxie)}
                  w="60px"
                  h="45px"
                  cursor="pointer"
                  alt={`Axie ${oponentAxie}`}
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
        <Button onClick={() => window.open(replayUrl, '_blank')}>Watch</Button>
      </Td>
    </Tr>
  );
};
