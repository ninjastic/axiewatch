import { Stat, StatLabel, StatNumber, StatHelpText, Stack, HStack, Image, Tooltip } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { formatter } from '../../../services/formatter';
import { usePrice } from '../../../services/hooks/usePrice';
import { totalSlpSelector } from '../../../recoil/scholars';
import { TooltipPredictionSlp } from '../TooltipPredictionSlp';

export const SlpOverview = (): JSX.Element => {
  const price = usePrice();

  const values = useRecoilValue(totalSlpSelector);

  return (
    <Stack direction={{ base: 'column', lg: 'row' }} spacing={5}>
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
