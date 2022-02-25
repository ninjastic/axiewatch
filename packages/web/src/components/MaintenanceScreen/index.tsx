import { Flex, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import dayjs from '../../services/dayjs';
import { useGameStatus } from 'src/services/hooks/useGameStatus';

const MaintenanceScreenComponent = (): JSX.Element => {
  const { data } = useGameStatus();
  const [timer, setTimer] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsLeft = dayjs.unix(data.to).diff(dayjs(), 'seconds');

      const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((secondsLeft / 60) % 60)).padStart(2, '0');
      const seconds = String(secondsLeft % 60).padStart(2, '0');

      if (secondsLeft <= 0) {
        setTimer('00h 00m 00s');
        return;
      }

      setTimer(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [data.to]);

  return (
    <Flex align="center" direction="column" w="100%" px={{ base: 1, lg: 0 }}>
      <Image src="/images/axies/confused.png" alt="Confused Axie" opacity={0.9} height={{ base: 'xs', lg: 'sm' }} />

      <Stack align="center" spacing={0} mt={3}>
        <Text fontWeight="bold" fontSize="lg" textAlign="center">
          Looks like the game is under maintenance
        </Text>
        <Text fontSize="sm" variant="faded" textAlign="center">
          This page requires the game API to work properly.
        </Text>
      </Stack>

      <Stack align="center" spacing={0} mt={10}>
        <Text fontWeight="bold">Time Left:</Text>
        <Text fontSize="2xl" color={useColorModeValue('orange.400', 'yellow.400')} fontWeight="bold">
          {timer}
        </Text>
        <Text variant="faded" fontSize="sm">
          (~{dayjs.unix(data.to).format('DD MMMM HH:mm:ss')})
        </Text>
      </Stack>
    </Flex>
  );
};

export const MaintenanceScreen = dynamic(() => Promise.resolve(MaintenanceScreenComponent), { ssr: false });
