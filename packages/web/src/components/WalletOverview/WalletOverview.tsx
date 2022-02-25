import { Stat, StatLabel, StatNumber, StatHelpText, Skeleton, SimpleGrid, HStack, GridItem } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import lodash from 'lodash';
import Image from 'next/image';

import { formatter } from '../../services/formatter';
import { scholarsMap } from '../../recoil/scholars';
import { usePrice } from '../../services/hooks/usePrice';
import { useBatchWallet } from '../../services/hooks/useBatchWallet';
import { preferencesAtom } from 'src/recoil/preferences';
import { RequestStatusFloatingButton } from '../RequestStatusFloatingButton';

export const WalletOverview = (): JSX.Element => {
  const price = usePrice();

  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const managerAddress = preferences.managerAddress.replace('ronin:', '0x');

  const addresses = scholars.map(scholar => scholar.address);
  const addressesWithManager = preferences.managerAddress
    ? lodash.uniqWith([managerAddress, ...addresses], (a, b) => a.toLowerCase() === b.toLowerCase())
    : addresses;

  const { results, isLoading, isFetching } = useBatchWallet(addressesWithManager);

  const amount = useMemo(
    () =>
      !isLoading
        ? {
            slp: Math.round(results.filter(r => r.isSuccess).reduce((t, curr) => t + curr.data.slp, 0)),
            axs: Math.round(results.filter(r => r.isSuccess).reduce((t, curr) => t + curr.data.axs, 0) * 1000) / 1000,
            eth: Math.round(results.filter(r => r.isSuccess).reduce((t, curr) => t + curr.data.eth, 0) * 1000) / 1000,
          }
        : {},
    [results, isLoading]
  );

  const prices = useMemo(
    () =>
      !isLoading
        ? {
            slp: formatter(price.values.slp * amount.slp, price.locale),
            axs: formatter(price.values.axs * amount.axs, price.locale),
            eth: formatter(price.values.eth * amount.eth, price.locale),
          }
        : {},
    [amount, price, isLoading]
  );

  const totalWorth = useMemo(
    () =>
      !isLoading
        ? formatter(
            price.values.slp * amount.slp + price.values.axs * amount.axs + price.values.eth * amount.eth,
            price.locale
          )
        : null,
    [amount, price, isLoading]
  );

  return (
    <>
      <SimpleGrid columns={{ base: 2, lg: 4 }} alignItems="center" gap={5}>
        <GridItem colSpan={1} mb={{ base: 5, lg: 0 }}>
          <Stat>
            <StatLabel>Total Worth</StatLabel>

            <Skeleton maxW="200px" h="30px" isLoaded={!isLoading}>
              <StatNumber>~{totalWorth}</StatNumber>
            </Skeleton>
          </Stat>
        </GridItem>

        <Stat w="120px">
          <StatLabel>SLP</StatLabel>

          <Skeleton maxW="150px" h="30px" isLoaded={!isLoading}>
            <HStack>
              <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />

              <StatNumber>{amount.slp ?? '0000'}</StatNumber>
            </HStack>
          </Skeleton>

          <Skeleton maxW="7 0px" h="20px" isLoaded={!isLoading}>
            <StatHelpText>{prices.slp}</StatHelpText>
          </Skeleton>
        </Stat>

        <Stat w="120px">
          <StatLabel>AXS</StatLabel>

          <Skeleton maxW="150px" h="30px" isLoaded={!isLoading}>
            <HStack>
              <Image src="/images/axies/axs.png" width="18px" height="18px" alt="axs" />

              <StatNumber>{amount.axs ?? '0000'}</StatNumber>
            </HStack>
          </Skeleton>

          <Skeleton maxW="70px" h="20px" isLoaded={!isLoading}>
            <StatHelpText>{prices.axs}</StatHelpText>
          </Skeleton>
        </Stat>

        <Stat w="120px">
          <StatLabel>ETH</StatLabel>

          <Skeleton maxW="150px" h="30px" isLoaded={!isLoading}>
            <HStack>
              <Image src="/images/axies/eth.png" width="20px" height="20px" alt="eth" />

              <StatNumber>{amount.eth}</StatNumber>
            </HStack>
          </Skeleton>

          <Skeleton maxW="70px" h="20px" isLoaded={!isLoading}>
            <StatHelpText>{prices.eth}</StatHelpText>
          </Skeleton>
        </Stat>
      </SimpleGrid>

      <RequestStatusFloatingButton isLoading={isLoading} isFetching={isFetching} />
    </>
  );
};
