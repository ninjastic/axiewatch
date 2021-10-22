import { HStack, Stack, Text } from '@chakra-ui/react';

import { APIBattlesResponse } from '@src/types/api';

interface BattlesWinrateProps {
  address: string;
  data: APIBattlesResponse;
}

export const BattlesWinrate = ({ address, data }: BattlesWinrateProps): JSX.Element => {
  const [win, draw, lose, total] = data.items.reduce(
    (rate, battle) => {
      const type = battle.battle_type === 1 ? 'PVE' : 'PVP';
      if (type === 'PVE') return rate;

      const scholarTeamNumber = battle.first_client_id === address ? 0 : 1;
      const scholarResult = battle.winner === scholarTeamNumber ? 'Win' : 'Lose';
      const result = battle.winner === 2 ? 'Draw' : scholarResult;

      if (result === 'Win') return [rate[0] + 1, rate[1], rate[2], rate[3] + 1];
      if (result === 'Draw') return [rate[0], rate[1] + 1, rate[2], rate[3] + 1];
      if (result === 'Lose') return [rate[0], rate[1], rate[2] + 1, rate[3] + 1];
      return rate;
    },
    [0, 0, 0, 0]
  );

  const winRate = Math.round(((win + draw) / total) * 100);

  return (
    <HStack spacing={3}>
      <Text fontWeight="bold" size="lg">
        Arena Winrate:
      </Text>

      <HStack>
        <HStack spacing={0}>
          <Text color="green.200">{win}</Text>
          <Text>/</Text>
          <Text color="gray.200">{draw}</Text>
          <Text>/</Text>
          <Text color="red.200">{lose}</Text>
        </HStack>

        <Text>({winRate}%)</Text>
      </HStack>
    </HStack>
  );
};
