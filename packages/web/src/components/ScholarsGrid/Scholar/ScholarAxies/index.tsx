import {
  Box,
  SkeletonCircle,
  Image,
  HStack,
  Link,
  Tooltip,
  Stack,
  Tag,
  SimpleGrid,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { preferencesAtom } from 'src/recoil/preferences';
import { useScholarAxie } from 'src/services/hooks/useScholarAxie';
import { useCreateModal } from 'src/services/hooks/useCreateModal';
import { AxieInfo } from '../../../AxieInfo';
import { AxieTraits } from '../../../AxieTraits';
import { Axie } from 'src/recoil/scholars';
import { AxieCard } from 'src/components/AxieCard';

interface OtherScholarAxiesModalProps {
  data: Axie[];
}

const OtherScholarAxiesModal = ({ data }: OtherScholarAxiesModalProps): JSX.Element => {
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  return (
    <Box overflow="auto" p={3}>
      <Flex overflow="auto" my={3} justify="flex-end">
        <Checkbox
          defaultChecked={preferences.hideAxieTraits}
          onChange={e =>
            setPreferences(prev => ({
              ...prev,
              hideAxieTraits: e.target.checked,
            }))
          }
        >
          Hide Traits
        </Checkbox>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gridGap={3}>
        {data.map(axie => (
          <AxieCard key={axie.id} axie={axie} />
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
    id: `otherAxiesModal:${address}`,
    title: 'Other axies',
    content: <OtherScholarAxiesModal data={hasMoreAxies ? data?.results.slice(3) : []} />,
    size: '6xl',
  });

  return (
    <Flex justify="center">
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

      {!isLoading && firstThreeAxies?.length > 0 && (
        <HStack>
          {firstThreeAxies?.map(axie => (
            <Link
              href={`https://marketplace.axieinfinity.com/axie/${axie.id}/?referrer=axie.watch`}
              target="_blank"
              key={axie.id}
            >
              <Tooltip
                label={
                  <Box w="300px">
                    <Stack>
                      <AxieInfo axieData={axie} />
                      <AxieTraits axieData={axie} />
                    </Stack>
                  </Box>
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
        </HStack>
      )}

      {!isLoading && data?.results.length > 3 && (
        <Box cursor="pointer" onClick={otherAxiesModal.onOpen}>
          <Tag rounded="3xl">+{data.results.length - 3}</Tag>
        </Box>
      )}

      {!isLoading && data?.results.length === 0 && (
        <Box>
          <Tag rounded="3xl" opacity={0.9}>
            No axies
          </Tag>
        </Box>
      )}
    </Flex>
  );
};
