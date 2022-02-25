import { Box, Text, Button, HStack, SimpleGrid } from '@chakra-ui/react';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { ScholarSelector } from '../../recoil/scholars';
import { ScholarPrivateKeyInput } from '../ScholarsGrid/Scholar/ScholarPaymentsButton/ScholarPrivateKeyInput';
import { ScholarPaymentsAddressInput } from '../ScholarsGrid/Scholar/ScholarPaymentsButton/ScholarPaymentsAddressInput';
import { EditScholarButton } from '../ScholarsGrid/Scholar/EditScholarButton';
import { ScholarAddress } from '../ScholarsGrid/Scholar/ScholarAddress';
import { modalSelector } from 'src/recoil/modal';

interface SetPrivateKeyModalProps {
  address: string;
}

const SetPrivateKeyModal = ({ address }: SetPrivateKeyModalProps): JSX.Element => {
  const modal = useRecoilValue(modalSelector(`setPrivateKeyModal:${address}`));
  return (
    <Box p={3}>
      <ScholarPrivateKeyInput address={address} onSave={modal.onClose} />
    </Box>
  );
};

interface ScholarPaymentsAddressInputModalProps {
  address: string;
}

const ScholarPaymentsAddressInputModal = ({ address }: ScholarPaymentsAddressInputModalProps): JSX.Element => {
  const modal = useRecoilValue(modalSelector(`setPaymentAddress:${address}`));

  return (
    <Box p={3}>
      <ScholarPaymentsAddressInput address={address} onSave={modal.onClose} />
    </Box>
  );
};

interface ScholarData extends ScholarSelector {
  hasPrivateKey: boolean;
  isConfigured: boolean;
}

interface ScholarClaimCardProps {
  scholarData: ScholarData;
  isSelected: boolean;
  toggleSelect: () => void;
}

export const ScholarClaimCard = ({ scholarData, isSelected, toggleSelect }: ScholarClaimCardProps): JSX.Element => {
  const { name, address, slp, shares, paymentAddress, hasPrivateKey, isConfigured } = scholarData || {};

  const setPrivateKeyModal = useCreateModal({
    id: `setPrivateKeyModal:${address}`,
    title: 'Private-key',
    content: <SetPrivateKeyModal address={address} />,
  });

  const setPaymentAddress = useCreateModal({
    id: `setPaymentAddress:${address}`,
    title: 'Ronin payment address',
    content: <ScholarPaymentsAddressInputModal address={address} />,
  });

  const scholarAmount = Math.floor((slp * shares.scholar) / 100);
  const managerAmount = Math.floor((slp * shares.manager) / 100);

  return (
    <Box
      key={address}
      p={5}
      minH="95px"
      rounded="2xl"
      borderWidth={2}
      borderColor={isSelected ? 'red.200' : 'darkGray.500'}
      fontWeight="bold"
      opacity={1}
      cursor={isConfigured ? 'pointer' : 'not-allowed'}
      onClick={() => (isConfigured ? toggleSelect() : {})}
      disabled={!isConfigured}
      transition="all 0.2s ease-out"
      {...(isConfigured && { _hover: { opacity: 0.75 } })}
    >
      <SimpleGrid columns={4}>
        <Box opacity={isConfigured ? 1 : 0.4} spacing={1}>
          <HStack spacing={3}>
            <Text fontWeight="bold">{name}</Text>

            <HStack>
              <Image src="/images/axies/slp.png" width="16px" height="16px" alt="slp" />
              <Text>{slp}</Text>

              <Text fontSize="sm" opacity={0.9}>
                {managerAmount} (M) / {scholarAmount} (S)
              </Text>
            </HStack>
          </HStack>

          <ScholarAddress address={address} showButton={false} />
        </Box>

        <Box textAlign="center" alignSelf="center">
          {!paymentAddress && <Button onClick={setPaymentAddress.onOpen}>Setup payment address</Button>}

          {paymentAddress && (
            <Box>
              <Text>Payment address configured!</Text>
              <Text fontSize={12} opacity={0.9}>
                {paymentAddress}
              </Text>
            </Box>
          )}
        </Box>

        <Box textAlign="center" alignSelf="center">
          {hasPrivateKey && <Text>Private-key configured!</Text>}

          {!hasPrivateKey && <Button onClick={setPrivateKeyModal.onOpen}>Setup private-key</Button>}
        </Box>

        <Box textAlign="center" alignSelf="center">
          <EditScholarButton address={address} />
        </Box>
      </SimpleGrid>
    </Box>
  );
};
