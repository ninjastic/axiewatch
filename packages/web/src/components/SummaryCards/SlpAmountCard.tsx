import { Stat, HStack, StatLabel, Tooltip, Box, StatNumber, Skeleton, StatHelpText } from '@chakra-ui/react';
import { BiInfoCircle } from 'react-icons/bi';

import { formatter } from 'src/services/formatter';
import { usePrice } from 'src/services/hooks/usePrice';
import { Card } from 'components/Card';

interface SlpAmountCardProps {
  label: string;
  amount: number;
  isLoading: boolean;
}

export const SlpAmountCard = ({ label, amount, isLoading }: SlpAmountCardProps): JSX.Element => {
  const price = usePrice();

  const fiatValue = formatter(amount * price.values.slp, price.locale);

  return (
    <Card p={3}>
      <Stat>
        <HStack spacing={1}>
          <StatLabel>{label}</StatLabel>

          <Tooltip label="Only counts scholars that were uploaded to our servers (Sync -> Upload) and after they have been tracked through 2 full days.">
            <Box>
              <BiInfoCircle />
            </Box>
          </Tooltip>
        </HStack>

        <StatNumber>
          <Skeleton isLoaded={!isLoading} h="35px" w="175px">
            {Math.floor(amount)} SLP
          </Skeleton>
        </StatNumber>

        <Skeleton isLoaded={!isLoading} h="20px" w="100px" mt={1}>
          <StatHelpText>{fiatValue}</StatHelpText>
        </Skeleton>
      </Stat>
    </Card>
  );
};
