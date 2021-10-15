import { Box, SkeletonCircle, Image, HStack, Link, Tooltip, Stack } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { scholarAxies } from '../../../../recoil/scholars';
import { LoadScholarAxies } from '../../../LoadScholarAxies';
import { AxieInfo } from '../../../AxieInfo';
import { AxieTraits } from '../../../AxieTraits';

interface ScholarAxiesProps {
  address: string;
  shouldLoad?: boolean;
}

export function ScholarAxies({ address, shouldLoad = true }: ScholarAxiesProps) {
  const axies = useRecoilValue(scholarAxies(address));

  return (
    <>
      <HStack>
        {!axies.loaded &&
          [...Array(3)].map((value, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              d="flex"
              alignItems="center"
              justifyContent="center"
              w="96px"
              h="72px"
            >
              <SkeletonCircle />
            </Box>
          ))}

        {axies.loaded &&
          axies.axies.map((axie, index) =>
            index >= 3 ? null : (
              <Link
                href={`https://marketplace.axieinfinity.com/axie/${axie.id}?referrer=axie.watch`}
                target="_blank"
                key={axie.id}
              >
                <Tooltip
                  label={
                    <Stack>
                      <AxieInfo axieData={axie} />
                      <AxieTraits axieData={axie} />
                    </Stack>
                  }
                  p={3}
                >
                  <Image
                    src={axie.image}
                    w="96px"
                    h="72px"
                    cursor="pointer"
                    alt={`Axie ${axie.id}`}
                    fallback={
                      <Box d="flex" alignItems="center" justifyContent="center" w="96px" h="72px">
                        <SkeletonCircle />
                      </Box>
                    }
                    transition="all .2s ease-out"
                    _hover={{ transform: 'translateY(-4px)', opacity: 0.9 }}
                  />
                </Tooltip>
              </Link>
            )
          )}
      </HStack>

      {shouldLoad && <LoadScholarAxies address={address} />}
    </>
  );
}
