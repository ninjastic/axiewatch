import {
  Box,
  Text,
  Flex,
  Stack,
  HStack,
  SkeletonCircle,
  Image,
  Divider,
  Link,
  Tag,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import { MdChildFriendly } from 'react-icons/md';
import { SiGooglescholar } from 'react-icons/si';
import { useRecoilValue } from 'recoil';
import { Fragment } from 'react';
import { HiPlus } from 'react-icons/hi';

import { breedingStateAtom } from '@src/recoil/breeding';
import { getTraitProbabilities } from '@src/services/utils/axieUtils';
import { AxiePartIcon, AxiePartIconType } from '../Icons/AxiePartIcon';
import bodyParts from '../../constants/body-parts.json';
import { AxieIcon } from '../Icons/AxieIcon';
import { Card } from '../Card';
import { AxieClass } from '@src/types/api';
import { AxieTraits } from '../AxieTraits';
import { scholarsMap } from '@src/recoil/scholars';
import { preferencesAtom } from '@src/recoil/preferences';

export const BreedingResultCard = (): JSX.Element => {
  const breedingState = useRecoilValue(breedingStateAtom);
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const result = getTraitProbabilities(breedingState[0].traits, breedingState[1].traits);

  const parts = Object.entries(result).reduce((_parts, [key, value]) => {
    const draft = { ..._parts };
    const part = key.match(/^(\w+)-/)[1];
    if (draft[part]) {
      draft[part][key] = value;
    } else {
      draft[part] = { [key]: value };
    }
    return draft;
  }, {} as Record<string, Record<string, number>>);

  return (
    <Box>
      <HStack align="center" justify="center" spacing={10}>
        {breedingState.map((axie, index) => {
          const scholarOwner = scholars.find(scholar => scholar.address.toLowerCase() === axie?.owner.toLowerCase());
          const managerWithoutRonin = preferences?.managerAddress.replace('ronin:', '0x');
          const isManager = axie.owner.toLowerCase() === managerWithoutRonin.toLowerCase();

          return (
            <Fragment key={axie.id}>
              <HStack spacing={5}>
                <Flex flexDirection="column" align="center" justify="center">
                  <Text variant="faded" fontSize="sm">
                    #{axie.id}
                  </Text>

                  <Tooltip
                    label={
                      <Box w="300px">
                        <AxieTraits axieData={axie} />
                      </Box>
                    }
                  >
                    <Image
                      src={axie.image}
                      alt={`Axie ${axie.id}`}
                      fallback={<SkeletonCircle size="64px" />}
                      maxW="128px"
                    />
                  </Tooltip>

                  <HStack>
                    <AxieIcon type={axie.class.toLowerCase() as AxieClass} />
                    <Link
                      href={`https://marketplace.axieinfinity.com/axie/${axie.id}/?referrer=axie.watch`}
                      target="_blank"
                    >
                      <Text>{axie.name || axie.id}</Text>
                    </Link>
                  </HStack>

                  <HStack mt={1}>
                    <Tag>
                      <HStack spacing={1}>
                        <MdChildFriendly />
                        <Text>{axie.breedCount}</Text>
                      </HStack>
                    </Tag>

                    {scholarOwner && (
                      <Tag>
                        <HStack spacing={1}>
                          <SiGooglescholar />
                          <Link
                            href={`https://marketplace.axieinfinity.com/profile/ronin:${axie.owner.replace(
                              '0x',
                              ''
                            )}/axie`}
                            target="_blank"
                          >
                            <Text textOverflow="ellipsis" overflowX="hidden" whiteSpace="nowrap" maxW="100px">
                              {scholarOwner?.name ?? (isManager ? 'Manager' : null)}
                            </Text>
                          </Link>
                        </HStack>
                      </Tag>
                    )}
                  </HStack>
                </Flex>
              </HStack>

              {index === 0 && <HiPlus fontSize="32px" />}
            </Fragment>
          );
        })}
      </HStack>

      <Flex mt={8} mb={5} flexDirection="column">
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={3} w="100%">
          {Object.entries(parts).map(([part, partChances]) => {
            return (
              <Card key={part} p={3}>
                <HStack>
                  <AxiePartIcon type={part as AxiePartIconType} />
                  <Text fontWeight="bold">{part.toUpperCase()}</Text>
                </HStack>

                <Divider my={2} />

                <Stack spacing={0}>
                  {Object.entries(partChances)
                    .sort((a, b) => {
                      if (a[1] > b[1]) return -1;
                      if (a[1] < b[1]) return 1;
                      return 0;
                    })
                    .map(([partKey, partPercentage]) => {
                      const { name, class: partClass } = bodyParts.find(bodyPart => partKey === bodyPart.partId);

                      return (
                        <Box key={partKey}>
                          <HStack>
                            <AxieIcon type={partClass as AxieClass} />
                            <Text color={partClass}>
                              {name}: {partPercentage * 100}%
                            </Text>
                          </HStack>
                        </Box>
                      );
                    })}
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        {/* <Box my={5}>
          <Stack>
            <Text>Potential Results</Text>

            <Card p={3} minH="100px">
            </Card>
          </Stack>
        </Box> */}
      </Flex>
    </Box>
  );
};
