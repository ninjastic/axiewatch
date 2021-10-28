import { Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import dayjs from '../../services/dayjs';
import { useGameStatus } from '@src/services/hooks/useGameStatus';

const MaintenanceScreenComponent = (): JSX.Element => {
  const { data } = useGameStatus();
  const [timer, setTimer] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsLeft = dayjs.unix(data.to).diff(dayjs(), 'seconds');

      const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((secondsLeft / 60) % 60)).padStart(2, '0');
      const seconds = String(secondsLeft % 60).padStart(2, '0');

      setTimer(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [data.to]);

  console.log(timer);

  return (
    <Flex align="center" direction="column" w="100%">
      <Image
        src="https://lh3.googleusercontent.com/5JAB2gVEtstrHg-tA55FXdPM1P8onQe6JZV-AVU04eJoeoX7Ghh-ein9s35acs4qPdhuonXuG9Pzp1HdEBIV8Uhz87goXcbzS66hyQ=w600"
        alt="Confused Axie"
        opacity={0.8}
        height="sm"
      />

      <Stack align="center" spacing={0} mt={3}>
        <Text fontWeight="bold" fontSize="lg">
          Looks like the game is under maintenance
        </Text>
        <Text fontSize="sm" variant="faded">
          This page requires the game API to work properly.
        </Text>
      </Stack>

      <Stack align="center" spacing={0} mt={10}>
        <Text fontWeight="bold">Time Left:</Text>
        <Text fontSize="2xl" color="yellow.400" fontWeight="bold">
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
