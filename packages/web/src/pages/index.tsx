import { Box, Flex, Grid, GridItem, Text, HStack, Stack, Tooltip } from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import dynamic from 'next/dynamic';

import { SignInButton } from '../components/SignInButton';
import { SummaryCards } from '../components/SummaryCards';
import { DailySlpChart } from '../components/DailySlpChart';
import { Card } from '../components/Card';
import { PreferencesButton } from '@src/components/Header/PreferencesButton';
import { NotablePerformersTable } from '@src/components/NotablePerformersTable';
import { EarningsProjectionChart } from '@src/components/EarningsProjectionChart';

function DashboardPage() {
  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex justify="space-between" direction={{ base: 'column', lg: 'row' }}>
        <Text fontSize="3xl" fontWeight="bold">
          Dashboard
        </Text>

        <HStack>
          <SignInButton />
          <PreferencesButton variant="solid" />
        </HStack>
      </Flex>

      <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} mt={10} gap={8} pb={5}>
        <GridItem colSpan={1}>
          <SummaryCards />
        </GridItem>

        <GridItem colSpan={1}>
          <Stack>
            <HStack>
              <Text fontWeight="bold" fontSize="lg">
                Earnings Projection
              </Text>

              <Tooltip label="How much should be your total accumulated value assuming your scholars daily average is constant and you make no claims.">
                <Box>
                  <AiOutlineInfoCircle />
                </Box>
              </Tooltip>
            </HStack>

            <Card p={5}>
              <EarningsProjectionChart />
            </Card>
          </Stack>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <NotablePerformersTable />
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Card p={5}>
            <Text fontWeight="bold" fontSize="lg">
              Daily SLP
            </Text>

            <DailySlpChart />
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });
