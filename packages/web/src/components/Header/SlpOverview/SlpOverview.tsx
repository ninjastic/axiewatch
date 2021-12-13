import { Stat, StatLabel, StatNumber, StatHelpText, Stack, HStack, Image, Tooltip } from '@chakra-ui/react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { formatter } from '../../../services/formatter';
import { usePrice } from '../../../services/hooks/usePrice';
import { scholarsMap, scholarState } from '../../../recoil/scholars';
import { TooltipPredictionSlp } from '../TooltipPredictionSlp';
import { preferencesAtom } from '@src/recoil/preferences';

export const SlpOverview = (): JSX.Element => {
  const price = usePrice();
  const scholars = useRecoilValue(scholarsMap);
  const preferences = useRecoilValue(preferencesAtom);

  const getScholarData = useRecoilCallback(
    ({ snapshot }) =>
      (address: string) => {
        return snapshot.getLoadable(scholarState(address)).getValue();
      },
    []
  );

  const values = useMemo(() => {
    return scholars.reduce(
      (prev, scholar) => {
        const newValues = { ...prev };
        const data = getScholarData(scholar.address);

        const value = preferences.includeRoninBalance ? data.slp + data.roninSlp : data.slp;

        newValues.total += value;
        newValues.manager += (value * scholar.shares.manager) / 100;
        newValues.scholars += (value * scholar.shares.scholar) / 100;
        newValues.investor += (value * (scholar.shares.investor ?? 0)) / 100;

        return newValues;
      },
      { total: 0, manager: 0, scholars: 0, investor: 0 }
    );
  }, [getScholarData, preferences.includeRoninBalance, scholars]);

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
