import { Stack, Text, HStack, Button, Image, SimpleGrid, GridItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../services/formatter';
import { scholarSelector } from '../../recoil/scholars';
import { usePrice } from '../../services/hooks/usePrice';
import { Card } from '../Card';
import { ScholarAddress } from '../ScholarsGrid/Scholar/ScholarAddress';

interface Data {
  address: string;
  slp: number;
  axs: number;
  eth: number;
}

interface WalletCardProps {
  address: string;
  data: Data;
}

export const WalletCard = ({ address, data }: WalletCardProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const price = usePrice();

  const amounts = useMemo(
    () => ({
      slp: Math.round(data.slp),
      axs: Math.round(data.axs * 1000) / 1000,
      eth: Math.round(data.eth * 1000) / 1000,
    }),
    [data.axs, data.eth, data.slp]
  );

  const values = useMemo(
    () => ({
      slp: formatter(price.values.slp * data.slp, price.locale),
      axs: formatter(price.values.axs * data.axs, price.locale),
      eth: formatter(price.values.eth * data.eth, price.locale),
    }),
    [data.axs, data.eth, data.slp, price.locale, price.values.axs, price.values.eth, price.values.slp]
  );

  const totalWorth = useMemo(
    () =>
      formatter(price.values.slp * data.slp + price.values.axs * data.axs + price.values.eth * data.eth, price.locale),
    [data.axs, data.eth, data.slp, price.locale, price.values.axs, price.values.eth, price.values.slp]
  );

  const profileUrl = `https://marketplace.axieinfinity.com/profile/${address.replace('0x', 'ronin:')}/axie`;
  const explorerUrl = `https://explorer.roninchain.com/address/${address.replace('0x', 'ronin:')}`;

  return (
    <Card py={3} px={5} rounded="md" key={data.address} minW={{ base: 'auto', xl: '440px' }}>
      <HStack justify="space-between">
        <Stack spacing={0}>
          <Text maxW="200px" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" fontWeight="bold">
            {scholar.name || 'Manager'}
          </Text>

          <ScholarAddress address={address} />
        </Stack>

        <Stack spacing={0}>
          <Button
            onClick={() => window.open(profileUrl, '_blank')}
            leftIcon={<Image src="/images/axies/mavis.ico" width="18px" alt="mavis" />}
            variant="ghost"
          >
            Profile
          </Button>

          <Button
            onClick={() => window.open(explorerUrl, '_blank')}
            leftIcon={<Image src="/images/axies/ronin.png" width="24px" alt="ronin" />}
            variant="ghost"
          >
            Explorer
          </Button>
        </Stack>
      </HStack>

      <SimpleGrid mt={{ base: 0, xl: 3 }} columns={4}>
        <GridItem colSpan={{ base: 4, lg: 1 }}>
          <Stack spacing={0}>
            <Text fontWeight="bold">Worth</Text>
            <Text opacity={0.9}>~{totalWorth}</Text>
          </Stack>
        </GridItem>

        <GridItem colSpan={3}>
          <SimpleGrid mt={{ base: 5, xl: 0 }} columns={3} gap={2}>
            <Stack spacing={0}>
              <HStack>
                <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />
                <Text>{amounts.slp}</Text>
              </HStack>

              <Text opacity={0.9} fontSize="sm">
                ({values.slp})
              </Text>
            </Stack>

            <Stack spacing={0}>
              <HStack>
                <Image src="/images/axies/axs.png" width="18px" height="18px" alt="axs" />
                <Text>{amounts.axs}</Text>
              </HStack>

              <Text opacity={0.9} fontSize="sm">
                ({values.axs})
              </Text>
            </Stack>

            <Stack spacing={0}>
              <HStack>
                <Image src="/images/axies/eth.png" width="18px" height="18px" alt="eth" />
                <Text>{amounts.eth}</Text>
              </HStack>

              <Text opacity={0.9} fontSize="sm">
                ({values.eth})
              </Text>
            </Stack>
          </SimpleGrid>
        </GridItem>
      </SimpleGrid>
    </Card>
  );
};
