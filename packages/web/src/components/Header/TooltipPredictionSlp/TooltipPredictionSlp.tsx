import { Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { formatter } from '../../../services/formatter';
import { priceAtom } from '../../../recoil/price';
import { totalSlpDaySelector } from '../../../recoil/scholars';

interface TooltipPredictionSlpProps {
  type: 'total' | 'manager' | 'scholars' | 'investor';
}

export const TooltipPredictionSlp = ({ type }: TooltipPredictionSlpProps): JSX.Element => {
  const price = useRecoilValue(priceAtom);
  const totalSlpDay = useRecoilValue(totalSlpDaySelector);

  const slpDay = totalSlpDay[type];

  return (
    <div>
      <Text>
        {slpDay} SLP / day ({formatter(slpDay * price.values.slp, price.locale)})
      </Text>

      <Text>
        {slpDay * 7} SLP / week ({formatter(slpDay * price.values.slp * 7, price.locale)})
      </Text>

      <Text>
        {slpDay * 30} SLP / month ({formatter(slpDay * price.values.slp * 30, price.locale)})
      </Text>

      <Text fontSize="smaller" opacity={0.9} mt={2}>
        Note: Approximated with the SLP/day
      </Text>
    </div>
  );
};
