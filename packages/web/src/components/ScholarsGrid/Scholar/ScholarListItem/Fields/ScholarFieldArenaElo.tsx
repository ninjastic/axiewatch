import { Box, Text, SkeletonText, Stack, HStack, Tooltip, Icon, Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { AiOutlineTrophy } from 'react-icons/ai';
import { RiSwordLine } from 'react-icons/ri';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../../recoil/scholars';

interface TooltipComponentProps {
  elo: number;
  rank: number;
}

const TooltipComponent = ({ elo, rank }: TooltipComponentProps): JSX.Element => {
  const slpPerWin = useMemo(() => {
    if (elo >= 2300) return 24;
    if (elo >= 2200) return 21;
    if (elo >= 2000) return 18;
    if (elo >= 1800) return 15;
    if (elo >= 1500) return 12;
    if (elo >= 1300) return 9;
    if (elo >= 1100) return 6;
    if (elo >= 1000) return 3;
    if (elo >= 800) return 1;
    return 0;
  }, [elo]);

  return (
    <Box>
      <HStack spacing={1}>
        <AiOutlineTrophy /> <Text>Rank {rank}</Text>
      </HStack>

      <HStack spacing={1}>
        <Image src="/images/axies/slp.png" height="16px" alt="slp" />
        <Text>{slpPerWin} per win</Text>
      </HStack>
    </Box>
  );
};

interface ScholarFieldArenaEloProps {
  address: string;
  isLoading: boolean;
}

export const ScholarFieldArenaElo = ({ address, isLoading }: ScholarFieldArenaEloProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <SkeletonText isLoaded={!isLoading} noOfLines={2}>
      <Tooltip isDisabled={scholar.pvpErrored} label={<TooltipComponent elo={scholar.pvpElo} rank={scholar.pvpRank} />}>
        <Stack spacing={0}>
          <Text opacity={0.9} fontSize="xs">
            Arena
          </Text>

          <HStack>
            <Icon as={RiSwordLine} />
            {scholar.pvpErrored && <Text color={isLoading ? 'inherit' : 'red.300'}>Error</Text>}

            {!scholar.pvpErrored && <Text>{scholar.pvpElo}</Text>}
          </HStack>
        </Stack>
      </Tooltip>
    </SkeletonText>
  );
};
