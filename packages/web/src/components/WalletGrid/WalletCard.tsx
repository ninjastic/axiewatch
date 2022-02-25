import { Stack, Text, HStack, Button, Image, SimpleGrid, GridItem, SkeletonText } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../services/formatter';
import { scholarSelector } from '../../recoil/scholars';
import { usePrice } from '../../services/hooks/usePrice';
import { Card } from '../Card';
import { ScholarAddress } from '../ScholarsGrid/Scholar/ScholarAddress';
import { useWallet } from 'src/services/hooks/useWallet';

interface WalletCardProps {
  address: string;
}

export const WalletCard = ({ address }: WalletCardProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const price = usePrice();

  const { data, isLoading, isError, refetch } = useWallet({ address });

  const amounts = useMemo(
    () =>
      !isLoading && !isError
        ? {
            slp: Math.round(data.slp),
            axs: Math.round(data.axs * 1000) / 1000,
            eth: Math.round(data.eth * 1000) / 1000,
          }
        : {},
    [data, isLoading, isError]
  );

  const values = useMemo(
    () =>
      !isLoading && !isError
        ? {
            slp: formatter(price.values.slp * data.slp, price.locale),
            axs: formatter(price.values.axs * data.axs, price.locale),
            eth: formatter(price.values.eth * data.eth, price.locale),
          }
        : {},
    [data, price, isLoading, isError]
  );

  const totalWorth = useMemo(
    () =>
      !isLoading && !isError
        ? formatter(
            price.values.slp * data.slp + price.values.axs * data.axs + price.values.eth * data.eth,
            price.locale
          )
        : null,
    [data, price, isLoading, isError]
  );

  const profileUrl = `https://marketplace.axieinfinity.com/profile/${address.replace('0x', 'ronin:')}/axie`;
  const explorerUrl = `https://explorer.roninchain.com/address/${address.replace('0x', 'ronin:')}`;

  if (isError) {
    return (
      <Card
        py={3}
        px={5}
        rounded="md"
        key={address}
        minW={{ base: 'auto', xl: '440px' }}
        h={{ base: '230px', lg: '175px' }}
      >
        <Stack>
          <Text>Something went wrong...</Text>
          <Button onClick={() => refetch()}>Retry</Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      py={3}
      px={5}
      rounded="md"
      key={address}
      minW={{ base: 'auto', xl: '440px' }}
      h={{ base: '230px', lg: '175px' }}
    >
      <HStack justify="space-between">
        <SkeletonText isLoaded={!isLoading} noOfLines={2}>
          <Stack spacing={0}>
            <Text maxW="200px" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" fontWeight="bold">
              {scholar.name || 'Manager'}
            </Text>

            <ScholarAddress address={address} />
          </Stack>
        </SkeletonText>

        <Stack spacing={0}>
          <Button
            onClick={() => window.open(profileUrl, '_blank')}
            leftIcon={<Image src="/images/axies/mavis.ico" width="18px" alt="mavis" />}
            variant="ghost"
            isDisabled={isLoading}
          >
            Profile
          </Button>

          <Button
            onClick={() => window.open(explorerUrl, '_blank')}
            leftIcon={<Image src="/images/axies/ronin.png" width="24px" alt="ronin" />}
            variant="ghost"
            isDisabled={isLoading}
          >
            Explorer
          </Button>
        </Stack>
      </HStack>

      <SimpleGrid mt={{ base: 0, xl: 3 }} columns={4}>
        <GridItem colSpan={{ base: 4, lg: 1 }}>
          <SkeletonText isLoaded={!isLoading} noOfLines={2} w={isLoading ? '75px' : '100px'}>
            <Stack spacing={0}>
              <Text fontWeight="bold">Worth</Text>
              <Text opacity={0.9} fontSize="sm">
                ~{totalWorth}
              </Text>
            </Stack>
          </SkeletonText>
        </GridItem>

        <GridItem colSpan={3}>
          <SimpleGrid mt={{ base: 5, xl: 0 }} columns={3} gap={2}>
            <SkeletonText isLoaded={!isLoading} noOfLines={2} w={isLoading ? '75px' : '100px'}>
              <Stack spacing={0}>
                <HStack>
                  <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />
                  <Text>{amounts.slp}</Text>
                </HStack>

                <Text opacity={0.9} fontSize="sm">
                  ({values.slp})
                </Text>
              </Stack>
            </SkeletonText>

            <SkeletonText isLoaded={!isLoading} noOfLines={2} w={isLoading ? '75px' : '100px'}>
              <Stack spacing={0}>
                <HStack>
                  <Image src="/images/axies/axs.png" width="18px" height="18px" alt="axs" />
                  <Text>{amounts.axs}</Text>
                </HStack>

                <Text opacity={0.9} fontSize="sm">
                  ({values.axs})
                </Text>
              </Stack>
            </SkeletonText>

            <SkeletonText isLoaded={!isLoading} noOfLines={2} w={isLoading ? '75px' : '100px'}>
              <Stack spacing={0}>
                <HStack>
                  <Image src="/images/axies/eth.png" width="18px" height="18px" alt="eth" />
                  <Text>{amounts.eth}</Text>
                </HStack>

                <Text opacity={0.9} fontSize="sm">
                  ({values.eth})
                </Text>
              </Stack>
            </SkeletonText>
          </SimpleGrid>
        </GridItem>
      </SimpleGrid>
    </Card>
  );
};
