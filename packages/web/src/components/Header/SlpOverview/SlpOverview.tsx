import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Stack,
  HStack,
  Image,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';

import { formatter } from '../../../services/formatter';
import { usePrice } from '../../../services/hooks/usePrice';
import { allScholarsSelector, totalSlpSelector } from '../../../recoil/scholars';
import { TooltipPredictionSlp } from '../TooltipPredictionSlp';

export const SlpOverview = (): JSX.Element => {
  const price = usePrice();

  useRecoilValue(allScholarsSelector);

  const [values, setValues] = useState({
    total: 0,
    manager: 0,
    scholars: 0,
    investor: 0,
  });

  const [isWideVersion] = useMediaQuery('(min-width: 750px)');

  const getValue = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getLoadable(totalSlpSelector).getValue(),
    []
  );

  const timeout = setTimeout(() => {
    setValues(getValue());
  }, 500);

  useEffect(() => () => clearInterval(timeout), []);

  return (
    <Stack direction={isWideVersion ? 'row' : 'column'} spacing={5}>
      <HStack spacing={isWideVersion ? 5 : 10}>
        <Stat w="120px">
          <StatLabel>Total SLP</StatLabel>

          <Tooltip label={<TooltipPredictionSlp type="total" />}>
            <HStack>
              <Image src="/images/axies/slp.png" width="18px" alt="slp" />
              <StatNumber>{formatter(values.total, price.locale, { style: 'decimal' })}</StatNumber>
            </HStack>
          </Tooltip>

          <StatHelpText>{formatter(values.total * price.values.slp, price.locale)}</StatHelpText>
        </Stat>

        <Stat w="120px">
          <StatLabel>Scholars</StatLabel>

          <Tooltip label={<TooltipPredictionSlp type="scholars" />}>
            <HStack>
              <Image src="/images/axies/slp.png" width="18px" alt="slp" />
              <StatNumber>
                {formatter(Math.floor(values.scholars), price.locale, {
                  style: 'decimal',
                })}
              </StatNumber>
            </HStack>
          </Tooltip>

          <StatHelpText>{formatter(values.scholars * price.values.slp, price.locale)}</StatHelpText>
        </Stat>
      </HStack>

      <HStack spacing={isWideVersion ? 5 : 10}>
        <Stat w="120px">
          <StatLabel>Manager</StatLabel>

          <Tooltip label={<TooltipPredictionSlp type="manager" />}>
            <HStack>
              <Image src="/images/axies/slp.png" width="18px" alt="slp" />
              <StatNumber>
                {formatter(Math.floor(values.manager), price.locale, {
                  style: 'decimal',
                })}
              </StatNumber>
            </HStack>
          </Tooltip>

          <StatHelpText>{formatter(values.manager * price.values.slp, price.locale)}</StatHelpText>
        </Stat>

        {values.investor !== 0 && (
          <Stat w="120px">
            <StatLabel>Investor</StatLabel>

            <Tooltip label={<TooltipPredictionSlp type="investor" />}>
              <HStack>
                <Image src="/images/axies/slp.png" width="18px" alt="slp" />
                <StatNumber>
                  {formatter(Math.floor(values.investor), price.locale, {
                    style: 'decimal',
                  })}
                </StatNumber>
              </HStack>
            </Tooltip>

            <StatHelpText>{formatter(values.investor * price.values.slp, price.locale)}</StatHelpText>
          </Stat>
        )}
      </HStack>
    </Stack>
  );
};
