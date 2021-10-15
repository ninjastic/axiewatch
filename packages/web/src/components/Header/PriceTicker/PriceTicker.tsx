import { HStack, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import dayjs from '../../../services/dayjs';
import { formatter } from '../../../services/formatter';
import { priceAtom } from '../../../recoil/price';

type Coins = 'axs' | 'eth' | 'slp';

interface PriceTickerProps {
  coins?: Array<Coins>;
}

export const PriceTicker = ({ coins = ['slp'] }: PriceTickerProps): JSX.Element => {
  const price = useRecoilValue(priceAtom);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const coinFractions = {
    slp: 4,
    axs: 2,
  } as { [coin in Coins]: number };

  useEffect(() => {
    const interval = setInterval(() => {
      const last = price.lastUpdate ? dayjs(price.lastUpdate).fromNow() : null;

      setLastUpdated(last);
    }, 1000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <HStack spacing={3}>
      {coins.map(coin => (
        <HStack key={coin}>
          <Image src={`/images/axies/${coin}.png`} width="18px" alt={coin} />

          <Tooltip label={`Last updated: ${lastUpdated}`} isDisabled={!lastUpdated}>
            <Flex align="center">
              <Text>
                {formatter(price.values[coin], price.locale, {
                  minimumFractionDigits: coinFractions[coin],
                  style: 'currency',
                })}
              </Text>
            </Flex>
          </Tooltip>
        </HStack>
      ))}
    </HStack>
  );
};
