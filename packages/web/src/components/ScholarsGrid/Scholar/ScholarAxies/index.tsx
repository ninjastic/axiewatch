import { Box, SkeletonCircle, Image, HStack, Link, Tooltip, Stack, Tag, SimpleGrid } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useScholarAxie } from '@src/services/hooks/useScholarAxie';
import { AxieInfo } from '../../../AxieInfo';
import { AxieTraits } from '../../../AxieTraits';
import { Axie } from '@src/recoil/scholars';
import { useCreateModal } from '@src/services/hooks/useCreateModal';

interface OtherScholarAxiesModalProps {
  data: Axie[];
}

const OtherScholarAxiesModal = ({ data }: OtherScholarAxiesModalProps): JSX.Element => {
  return (
    <Box overflow="auto" p={3}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }}>
        {data.map(axie => (
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
                h={{ lg: '72px' }}
                cursor="pointer"
                alt={`Axie ${axie.id}`}
                fallback={
                  <Box d="flex" alignItems="center" justifyContent="center" w="96px" h={{ lg: '72px' }}>
                    <SkeletonCircle />
                  </Box>
                }
                transition="all .2s ease-out"
                _hover={{ transform: 'translateY(-4px)', opacity: 0.9 }}
              />
            </Tooltip>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

interface ScholarAxiesProps {
  address: string;
  shouldLoad?: boolean;
}

export const ScholarAxies = ({ address, shouldLoad = true }: ScholarAxiesProps): JSX.Element => {
  const { data, isLoading } = useScholarAxie({ address, size: 100, enabled: shouldLoad });
  const firstThreeAxies = useMemo(() => (!isLoading ? data?.results.slice(0, 3) : []), [data?.results, isLoading]);
  const hasMoreAxies = useMemo(() => (!isLoading ? data?.results.length > 3 : []), [data?.results.length, isLoading]);

  const otherAxiesModal = useCreateModal({
    id: 'otherAxiesModal',
    title: () => 'Other axies',
    content: () => <OtherScholarAxiesModal data={hasMoreAxies ? data?.results.slice(3) : []} />,
    size: '4xl',
  });

  return (
    <HStack>
      {isLoading &&
        [...Array(3)].map((value, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            d="flex"
            alignItems="center"
            justifyContent="center"
            w="96px"
            h={{ lg: '72px' }}
          >
            <SkeletonCircle />
          </Box>
        ))}

      {!isLoading &&
        firstThreeAxies?.map(axie => (
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
                h={{ lg: '72px' }}
                cursor="pointer"
                alt={`Axie ${axie.id}`}
                fallback={
                  <Box d="flex" alignItems="center" justifyContent="center" w="96px" h={{ lg: '72px' }}>
                    <SkeletonCircle />
                  </Box>
                }
                transition="all .2s ease-out"
                _hover={{ transform: 'translateY(-4px)', opacity: 0.9 }}
              />
            </Tooltip>
          </Link>
        ))}

      {!isLoading && data?.results.length > 3 && (
        <Box cursor="pointer" onClick={otherAxiesModal.onOpen}>
          <Tag rounded="3xl">+{data.results.length - 3}</Tag>
        </Box>
      )}
    </HStack>
  );
};
