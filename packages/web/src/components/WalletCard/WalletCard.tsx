import { Stack, Text, HStack, Button, Image } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

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

  const amounts = {
    slp: Math.round(data.slp),
    axs: Math.round(data.axs * 1000) / 1000,
    eth: Math.round(data.eth * 1000) / 1000,
  };

  const values = {
    slp: formatter(price.values.slp * data.slp, price.locale),
    axs: formatter(price.values.axs * data.axs, price.locale),
    eth: formatter(price.values.eth * data.eth, price.locale),
  };

  const totalWorth = formatter(
    price.values.slp * data.slp + price.values.axs * data.axs + price.values.eth * data.eth,
    price.locale
  );

  const profileUrl = `https://marketplace.axieinfinity.com/profile/${address.replace('0x', 'ronin:')}`;
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

      <Stack mt={{ base: 0, xl: 3 }} spacing={{ base: 3, xl: 10 }} direction={{ base: 'column', xl: 'row' }}>
        <Stack spacing={0}>
          <Text fontWeight="bold">Worth</Text>
          <Text opacity={0.8}>~{totalWorth}</Text>
        </Stack>

        <HStack spacing={10}>
          <Stack spacing={0}>
            <HStack>
              <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />
              <Text>{amounts.slp}</Text>
            </HStack>

            <Text opacity={0.8} fontSize="sm">
              ({values.slp})
            </Text>
          </Stack>

          <Stack spacing={0}>
            <HStack>
              <Image src="/images/axies/axs.png" width="18px" height="18px" alt="axs" />
              <Text>{amounts.axs}</Text>
            </HStack>

            <Text opacity={0.8} fontSize="sm">
              ({values.axs})
            </Text>
          </Stack>

          <Stack spacing={0}>
            <HStack>
              <Image src="/images/axies/eth.png" width="18px" height="18px" alt="eth" />
              <Text>{amounts.eth}</Text>
            </HStack>

            <Text opacity={0.8} fontSize="sm">
              ({values.eth})
            </Text>
          </Stack>
        </HStack>
      </Stack>
    </Card>
  );
};
