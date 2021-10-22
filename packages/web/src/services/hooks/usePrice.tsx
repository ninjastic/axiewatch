import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import axios from 'axios';

import { priceAtom, Price } from '../../recoil/price';
import { preferencesAtom } from '../../recoil/preferences';

type Coins = 'smooth-love-potion' | 'axie-infinity' | 'ethereum';

type PriceResponse = {
  [coin in Coins]: {
    [currency: string]: number;
  };
};

export const usePrice = (): Price => {
  const [price, setPrice] = useRecoilState(priceAtom);
  const preferences = useRecoilValue(preferencesAtom);

  const { data } = useQuery(
    'price',
    async () => {
      const response = await axios.get<PriceResponse>('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'smooth-love-potion,axie-infinity,ethereum',
          vs_currencies: 'usd,brl,eth,php,thb,aud,cad,idr,chf,gbp,mxn,eur,inr,ars,vnd,uah,rub,aed,myr,sgd,jpy,ils',
        },
        timeout: 1000 * 10, // 10 seconds
      });

      return {
        slp: response.data['smooth-love-potion'],
        axs: response.data['axie-infinity'],
        eth: response.data.ethereum,
      };
    },
    {
      staleTime: 1000 * 60 * 3, // 3 minutes
    }
  );

  useEffect(() => {
    if (data) {
      const currency = preferences.currency || 'usd';

      setPrice({
        values: {
          slp: data.slp[currency],
          axs: data.axs[currency],
          eth: data.eth[currency],
        },
        locale: currency,
        lastUpdate: new Date().getTime(),
      });
    }
  }, [preferences.currency, data, setPrice]);

  return price;
};
