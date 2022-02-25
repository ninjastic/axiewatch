import { HStack, Text } from '@chakra-ui/react';

import { APIBattlesResponse } from 'src/types/api';

interface BattlesWinrateProps {
  address: string;
  data: APIBattlesResponse;
}

export const BattlesWinrate = ({ address, data }: BattlesWinrateProps): JSX.Element => {
  const [win, draw, lose, total] = data.battles.reduce(
    (rate, battle) => {
      if (battle.eloAndItem === undefined) return rate;

      const isWin = battle.winner === address;
      const isLose =
        battle.winner !== address &&
        (battle.winner === battle.first_client_id || battle.winner === battle.second_client_id);
      const isDraw = !isWin && !isLose;

      if (isWin) return [rate[0] + 1, rate[1], rate[2], rate[3] + 1];
      if (isDraw) return [rate[0], rate[1] + 1, rate[2], rate[3] + 1];
      if (isLose) return [rate[0], rate[1], rate[2] + 1, rate[3] + 1];
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
          <Text color="green.300">{win}</Text>
          <Text>/</Text>
          <Text color="gray.400">{draw}</Text>
          <Text>/</Text>
          <Text color="red.300">{lose}</Text>
        </HStack>

        <Text>({winRate}%)</Text>
      </HStack>
    </HStack>
  );
};
