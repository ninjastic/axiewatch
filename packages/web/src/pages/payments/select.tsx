import { Box, Stack, Text, Flex, Heading, Button, ButtonGroup, HStack, Tooltip } from '@chakra-ui/react';
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import { useRecoilState, useRecoilValue } from 'recoil';
import Router from 'next/router';
import dynamic from 'next/dynamic';

import dayjs from '../../services/dayjs';
import { preferencesAtom } from '../../recoil/preferences';
import { passwordAtom, walletMapAtom } from '../../recoil/wallets';
import { scholarsMap } from '../../recoil/scholars';
import { selectedPaymentsAtom } from '../../recoil/payments';
import { BallScaleLoading } from '../../components/BallScaleLoading';
import { PaymentsRiskWarning } from '../../components/PaymentsRiskWarning';
import { SetPassword } from '../../components/SetPassword';
import { ManagerAddressInput } from '../../components/ManagerAddressInput';
import { ScholarClaimCard } from '../../components/ScholarClaimCard';
import { useBatchScholar } from '../../services/hooks/useBatchScholar';

export const SelectPaymentsPage = (): JSX.Element => {
  const scholars = useRecoilValue(scholarsMap);

  const addresses = scholars.map(scholar => scholar.address);
  const { isLoading, data } = useBatchScholar({ addresses });

  const walletMap = useRecoilValue(walletMapAtom);
  const preferences = useRecoilValue(preferencesAtom);
  const password = useRecoilValue(passwordAtom);
  const [selected, setSelected] = useRecoilState(selectedPaymentsAtom);

  const handlePrevPage = () => {
    Router.push({
      pathname: '/payments',
    });
  };

  const handleNextPage = () => {
    Router.push({
      pathname: '/payments/start',
    });
  };

  const scholarsClaimable = data
    .filter(scholar => scholar.lastClaim !== 0 && dayjs.unix(scholar.nextClaim).isBefore(dayjs()))
    .map(scholar => {
      const scholarMap = scholars.find(map => map.address === scholar.address);
      return {
        ...scholarMap,
        ...scholar,
        hasPrivateKey: walletMap.includes(scholar.address),
        isConfigured: walletMap.includes(scholar.address) && !!scholarMap.paymentAddress,
      };
    });

  const totalSlpClaimable = scholarsClaimable.reduce((prev, curr) => prev + curr.slp, 0);

  const handleToggleSelect = (address: string) => {
    setSelected(old => {
      const newSelected = [...old];
      const itemIndex = old.findIndex(sel => sel === address);

      if (itemIndex === -1) {
        newSelected.push(address);
        return newSelected;
      }

      newSelected.splice(itemIndex, 1);
      return newSelected;
    });
  };

  const handleToggleAll = () => {
    const hasSelected = selected.length;

    const newSelected = hasSelected
      ? []
      : scholarsClaimable.filter(scholar => scholar.isConfigured).map(scholar => scholar.address);

    setSelected(newSelected);
  };

  const getIsSelected = (address: string): boolean => {
    return !!selected.find(sel => sel === address);
  };

  if (!preferences.doNotShowPaymentsRiskWarning) {
    return <PaymentsRiskWarning />;
  }

  if (!preferences.managerAddress) {
    return <ManagerAddressInput />;
  }

  if (!password) {
    return <SetPassword />;
  }

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      {isLoading && (
        <Stack d="flex" flexDir="column" justifyContent="center" alignItems="center" w="100%" h="90%">
          <BallScaleLoading />

          <Text fontWeight="bold">Loading scholars...</Text>
        </Stack>
      )}

      {!isLoading && (
        <>
          <Flex>
            <Heading>1) Select which scholars to claim</Heading>

            <ButtonGroup ml="auto">
              <Button leftIcon={<AiFillCaretLeft />} onClick={handlePrevPage}>
                Previous
              </Button>
              <Button disabled={!selected.length} rightIcon={<AiFillCaretRight />} onClick={handleNextPage}>
                Next
              </Button>
            </ButtonGroup>
          </Flex>

          <Box py={5} mt={5} fontSize="xl">
            <HStack spacing={3}>
              <Text>You can claim</Text>
              <Text fontWeight="bold" fontSize="2xl">
                {totalSlpClaimable} SLP
              </Text>

              <Text>from</Text>
              <Text fontWeight="bold" fontSize="2xl">
                {scholarsClaimable.length} scholars.
              </Text>
            </HStack>
          </Box>

          <Stack spacing={5}>
            <Flex align="center">
              <Button
                variant="ghost"
                onClick={handleToggleAll}
                disabled={!scholarsClaimable.length || !scholarsClaimable.some(s => s.isConfigured)}
              >
                {selected.length ? 'Unselect all' : 'Select all'}
              </Button>

              <Box ml="auto" textAlign="center">
                <Tooltip label={preferences.managerAddress} width="56">
                  <div>
                    <Text fontWeight="bold">Manager Address</Text>
                    <Text opacity={0.9}>
                      {preferences.managerAddress.substr(0, 12)}...
                      {preferences.managerAddress.substr(preferences.managerAddress.length - 6)}
                    </Text>
                  </div>
                </Tooltip>
              </Box>
            </Flex>

            {scholarsClaimable.length && (
              <Stack spacing={3} pb={3}>
                {scholarsClaimable.map(scholar => (
                  <ScholarClaimCard
                    key={scholar.address}
                    scholarData={scholar}
                    isSelected={getIsSelected(scholar.address)}
                    toggleSelect={() => handleToggleSelect(scholar.address)}
                  />
                ))}
              </Stack>
            )}

            {!scholarsClaimable.length && (
              <Box textAlign="center">
                <Text fontSize="lg">No scholars with claim available.</Text>
              </Box>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default dynamic(() => Promise.resolve(SelectPaymentsPage), {
  ssr: false,
});
