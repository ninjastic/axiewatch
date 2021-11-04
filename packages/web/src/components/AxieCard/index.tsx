import { Stack, Tooltip, Link, Image, Box, SkeletonCircle } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { Axie } from '@src/recoil/scholars';
import { Card } from '@src/components/Card';
import { AxieInfo } from '@src/components/AxieInfo';
import { AxieTraits } from '@src/components/AxieTraits';
import { preferencesAtom } from '@src/recoil/preferences';

interface AxieCardProps {
  axie: Axie;
}

export const AxieCard = ({ axie }: AxieCardProps): JSX.Element => {
  const preferences = useRecoilValue(preferencesAtom);

  return (
    <Card py={5} px={3} key={axie.id} borderWidth={1}>
      <Stack align="center" spacing={3}>
        <AxieInfo axieData={axie} />

        <Tooltip label={<AxieTraits axieData={axie} />} isDisabled={!preferences.hideAxieTraits} p={3}>
          <Link href={`https://marketplace.axieinfinity.com/axie/${axie.id}?referrer=axie.watch`} target="_blank">
            <Image
              src={axie.image}
              w="144px"
              h="108px"
              cursor="pointer"
              alt={`Axie ${axie.id}`}
              fallback={
                <Box d="flex" w="144px" h="108px" alignItems="center" justifyContent="center">
                  <SkeletonCircle />
                </Box>
              }
              transition="all .2s ease-out"
              _hover={{ transform: 'translateY(-5px)', opacity: 1 }}
            />
          </Link>
        </Tooltip>

        {!preferences.hideAxieTraits && <AxieTraits axieData={axie} />}
      </Stack>
    </Card>
  );
};
