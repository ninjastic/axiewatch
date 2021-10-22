import { Stat, StatLabel, StatNumber, StatHelpText, Spinner, Grid, HStack, GridItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import Image from 'next/image';

import { formatter } from '../../services/formatter';
import { scholarsMap } from '../../recoil/scholars';
import { usePrice } from '../../services/hooks/usePrice';
import { useBatchWallet } from '../../services/hooks/useBatchWallet';

export const WalletOverview = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);
  const price = usePrice();

  const addresses = scholars.map(scholar => scholar.address);
  const { isLoading, results } = useBatchWallet(addresses);

  const amount = useMemo(
    () => ({
      slp: Math.round(results.reduce((t, curr) => t + curr.data.slp, 0)),
      axs: Math.round(results.reduce((t, curr) => t + curr.data.axs, 0) * 1000) / 1000,
      eth: Math.round(results.reduce((t, curr) => t + curr.data.eth, 0) * 1000) / 1000,
    }),
    [results]
  );

  const prices = useMemo(
    () => ({
      slp: formatter(price.values.slp * amount.slp, price.locale),
      axs: formatter(price.values.axs * amount.axs, price.locale),
      eth: formatter(price.values.eth * amount.eth, price.locale),
    }),
    [amount.axs, amount.eth, amount.slp, price.locale, price.values.axs, price.values.eth, price.values.slp]
  );

  const totalWorth = formatter(
    price.values.slp * amount.slp + price.values.axs * amount.axs + price.values.eth * amount.eth,
    price.locale
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Grid templateColumns="repeat(5, 1fr)" alignItems="center" gap={3}>
      <GridItem colSpan={{ base: 5, lg: 2 }} mb={{ base: 5, lg: 0 }}>
        <Stat>
          <StatLabel>Total Worth</StatLabel>
          <StatNumber>~{totalWorth}</StatNumber>
        </Stat>
      </GridItem>

      <Stat w="120px">
        <StatLabel>SLP</StatLabel>

        <HStack>
          <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />
          <StatNumber>{amount.slp}</StatNumber>
        </HStack>

        <StatHelpText>{prices.slp}</StatHelpText>
      </Stat>

      <Stat w="120px">
        <StatLabel>AXS</StatLabel>

        <HStack>
          <Image src="/images/axies/axs.png" width="18px" height="18px" alt="axs" />
          <StatNumber>{amount.axs}</StatNumber>
        </HStack>

        <StatHelpText>{prices.axs}</StatHelpText>
      </Stat>

      <Stat w="120px">
        <StatLabel>ETH</StatLabel>

        <HStack>
          <Image src="/images/axies/eth.png" width="20px" height="20px" alt="eth" />
          <StatNumber>{amount.eth}</StatNumber>
        </HStack>

        <StatHelpText>{prices.eth}</StatHelpText>
      </Stat>
    </Grid>
  );
};
