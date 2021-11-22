import {
  Box,
  Flex,
  Stack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Input,
  Select,
  Divider,
  SimpleGrid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { formatter } from '../services/formatter';
import { usePrice } from '../services/hooks/usePrice';
import { priceAtom } from '../recoil/price';
import { PreferencesButton } from '../components/Header/PreferencesButton';
import { PriceTicker } from '../components/Header/PriceTicker';

export const Calculator = (): JSX.Element => {
  const price = useRecoilValue(priceAtom);

  const [slpValue, setSlpValue] = useState(150);
  const [period, setPeriod] = useState(1);

  usePrice();

  const columns = useBreakpointValue({
    base: 1,
    lg: 2,
  });

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex p={3}>
        <Stat>
          <StatLabel>Price</StatLabel>
          <StatNumber>
            <PriceTicker />
          </StatNumber>
        </Stat>

        <Box ml="auto">
          <PreferencesButton />
        </Box>
      </Flex>

      <Flex mt={10} flexDirection="column" align="center" fontWeight="bold" fontSize={18} pb={5}>
        <SimpleGrid columns={columns} spacing={12}>
          <Stack spacing={1}>
            <HStack>
              <Text>If I earn</Text>
              <Input
                w="128px"
                placeholder="150"
                variant="filled"
                size="lg"
                value={slpValue}
                onChange={e => setSlpValue(Number(e.target.value))}
              />
              <Text>SLP</Text>
            </HStack>

            <HStack>
              <Text>every</Text>

              <Select
                size="lg"
                w={32}
                variant="filled"
                value={period}
                onChange={e => setPeriod(Number(e.target.value))}
              >
                <option value="1">day</option>
                <option value="7">week</option>
                <option value="30">month</option>
              </Select>
            </HStack>
          </Stack>

          <Stack mt={3} fontSize={14}>
            <HStack>
              <Text as="span" fontSize={24}>
                {formatter((price.values.slp * slpValue) / period, price.locale)}
              </Text>
              <Text>per day</Text>
            </HStack>

            <HStack>
              <Text as="span" fontSize={24}>
                {formatter(((price.values.slp * slpValue) / period) * 7, price.locale)}
              </Text>
              <Text>per week</Text>
            </HStack>

            <HStack>
              <Text as="span" fontSize={24}>
                {formatter(((price.values.slp * slpValue) / period) * 30, price.locale)}
              </Text>
              <Text>per month</Text>
            </HStack>
          </Stack>
        </SimpleGrid>

        <Divider my={8} />

        <SimpleGrid columns={columns} spacing={5} fontSize={16}>
          <GridItem colSpan={columns}>
            <Text fontSize={26} fontWeight="bold">
              Quick values
            </Text>
          </GridItem>

          <Stack spacing={5}>
            <Box mr={10}>
              <HStack>
                <Text fontWeight="bold">Daily Mission (25):</Text>
                <Text>{formatter(price.values.slp * 25, price.locale)}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Daily Adventure (50):</Text>
                <Text>{formatter(price.values.slp * 50, price.locale)}</Text>
              </HStack>
            </Box>
          </Stack>

          <Stack spacing={0}>
            <HStack>
              <Text fontWeight="bold">Arena Win (6):</Text>
              <Text>{formatter(price.values.slp * 6, price.locale)}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="bold">Arena Win (9):</Text>
              <Text>{formatter(price.values.slp * 9, price.locale)}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="bold">Arena Win (12):</Text>
              <Text>{formatter(price.values.slp * 12, price.locale)}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="bold">Arena Win (15):</Text>
              <Text>{formatter(price.values.slp * 15, price.locale)}</Text>
            </HStack>
          </Stack>
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default Calculator;
