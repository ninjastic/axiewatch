import { Box, Button, Text } from '@chakra-ui/react';
import Router from 'next/router';
import { useRecoilValue } from 'recoil';

import { modalSelector } from '../../recoil/modal';

interface Step {
  name: 'Claim' | 'Manager' | 'Scholar';
  message?: string;
  status?: string;
  icon?: React.ReactElement;
  hash?: string;
  amount?: number;
}

interface Status {
  address: string;
  steps: Step[];
}

interface PaymentsOverviewProps {
  status: Status[];
}

export const PaymentsOverview = ({ status }: PaymentsOverviewProps): JSX.Element => {
  const modal = useRecoilValue(modalSelector('finishOverviewModal'));

  const handleBackToStart = () => {
    modal.onClose();

    Router.push({
      pathname: '/payments',
    });
  };

  const statusInfo = {
    claimed: status.reduce(
      (prev, curr) =>
        prev +
        curr.steps.reduce((prevStep, currStep) => {
          if (currStep.name === 'Claim' && currStep.amount) {
            return prevStep + currStep.amount;
          }
          return prevStep;
        }, 0),
      0
    ),
    transferedManager: status.reduce(
      (prev, curr) =>
        prev +
        curr.steps.reduce((prevStep, currStep) => {
          if (currStep.name === 'Manager' && currStep.amount) {
            return prevStep + currStep.amount;
          }
          return prevStep;
        }, 0),
      0
    ),
    transferedScholar: status.reduce(
      (prev, curr) =>
        prev +
        curr.steps.reduce((prevStep, currStep) => {
          if (currStep.name === 'Scholar' && currStep.amount) {
            return prevStep + currStep.amount;
          }
          return prevStep;
        }, 0),
      0
    ),
  };

  const minutesSaved = status.length * 2;

  return (
    <Box p={5}>
      <Text fontWeight="bold" fontSize="2xl">
        Here is an overview about your payment session!
      </Text>

      <Text fontSize="lg" mt={3}>
        - You claimed a total of{' '}
        <Text opacity={0.9} as="span" fontWeight="bold">
          {statusInfo.claimed} SLP
        </Text>{' '}
        from{' '}
        <Text opacity={0.9} as="span" fontWeight="bold">
          {status.length}
        </Text>{' '}
        scholars.
      </Text>

      <Text fontSize="lg">
        - You transfered{' '}
        <Text opacity={0.9} as="span" fontWeight="bold">
          {statusInfo.transferedManager} SLP
        </Text>{' '}
        to the manager address.
      </Text>

      <Text fontSize="lg">
        - You transfered{' '}
        <Text opacity={0.9} as="span" fontWeight="bold">
          {statusInfo.transferedScholar} SLP
        </Text>{' '}
        to your scholars.
      </Text>

      <Text fontSize="lg">
        - You saved approximately{' '}
        <Text opacity={0.9} as="span" fontWeight="bold">
          {minutesSaved} minutes
        </Text>{' '}
        by using our automatic payment tool.
      </Text>

      <Button onClick={handleBackToStart} mt={5}>
        Go back to the start!
      </Button>
    </Box>
  );
};
