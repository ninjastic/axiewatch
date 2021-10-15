import { Box, Text, GridItem, SkeletonText, HStack, Tooltip, Icon, Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { AiOutlineTrophy } from 'react-icons/ai';
import { RiSwordLine } from 'react-icons/ri';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../../recoil/scholars';

interface ScholarFieldArenaEloProps {
  address: string;
  isLoading: boolean;
  refetch(): void;
}

export const ScholarFieldArenaElo = ({ address, isLoading, refetch }: ScholarFieldArenaEloProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  const slpPerWin = useMemo(() => {
    if (scholar.pvpElo >= 2300) return 24;
    if (scholar.pvpElo >= 2200) return 21;
    if (scholar.pvpElo >= 2000) return 18;
    if (scholar.pvpElo >= 1800) return 15;
    if (scholar.pvpElo >= 1500) return 12;
    if (scholar.pvpElo >= 1300) return 9;
    if (scholar.pvpElo >= 1100) return 6;
    if (scholar.pvpElo >= 1000) return 3;
    if (scholar.pvpElo >= 800) return 1;
    return 0;
  }, [scholar.pvpElo]);

  return (
    <GridItem colSpan={3}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Text fontWeight="bold">Arena</Text>

        <Tooltip
          isDisabled={scholar.pvpErrored}
          label={
            <Box>
              <HStack spacing={1}>
                <AiOutlineTrophy /> <Text>Rank {scholar.pvpRank}</Text>
              </HStack>

              <HStack spacing={1}>
                <Image src="/images/axies/slp.png" height="16px" alt="slp" />
                <Text>{slpPerWin} per win</Text>
              </HStack>
            </Box>
          }
        >
          <HStack>
            <Icon as={RiSwordLine} />
            {scholar.pvpErrored && (
              <Text
                onClick={e => {
                  if (isLoading) return;
                  e.stopPropagation();
                  refetch();
                }}
                _hover={{
                  textDecor: isLoading ? 'none' : 'underline',
                }}
                color={isLoading ? 'inherit' : 'red.200'}
              >
                Retry
              </Text>
            )}

            {!scholar.pvpErrored && <Text>{scholar.pvpElo}</Text>}
          </HStack>
        </Tooltip>
      </SkeletonText>
    </GridItem>
  );
};
