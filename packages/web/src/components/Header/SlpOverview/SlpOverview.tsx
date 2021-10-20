import { Stat, StatLabel, StatNumber, StatHelpText, Stack, HStack, Image, Tooltip } from '@chakra-ui/react';
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

  const getValue = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getLoadable(totalSlpSelector).getValue(),
    []
  );

  const timeout = setTimeout(() => {
    setValues(getValue());
  }, 500);

  useEffect(() => () => clearInterval(timeout), [timeout]);

  return (
    <Stack direction={{ sm: 'column', lg: 'row' }} spacing={5}>
      <HStack spacing={{ sm: 10, lg: 5 }}>
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

      <HStack spacing={{ sm: 10, lg: 5 }}>
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
