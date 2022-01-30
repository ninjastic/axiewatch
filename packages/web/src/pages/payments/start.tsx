import {
  Box,
  Text,
  Stack,
  Button,
  HStack,
  Flex,
  Heading,
  GridItem,
  Grid,
  Link,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useEffect, useState, Fragment } from 'react';
import { AiFillCaretLeft, AiFillPlayCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import Router from 'next/router';
import Image from 'next/image';
import produce from 'immer';
import throat from 'throat';
import dayjs from 'dayjs';

import { preferencesAtom } from '../../recoil/preferences';
import { paymentsHistoryAtom, selectedPaymentsAtom } from '../../recoil/payments';
import { allScholarsSelector, ScholarSelector } from '../../recoil/scholars';
import { allWalletsSelector } from '../../recoil/wallets';
import { ClaimTransaction } from '../../services/transactions/ClaimTransaction';
import { TransferTransaction } from '../../services/transactions/TransferTransaction';
import { useCreateModal } from '../../services/hooks/useCreateModal';
import { PaymentsOverview } from '../../components/PaymentsOverview';

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

const StartPaymentsPage = (): JSX.Element => {
  const preferences = useRecoilValue(preferencesAtom);
  const selected = useRecoilValue(selectedPaymentsAtom);
  const allWallets = useRecoilValue(allWalletsSelector);

  const setPaymentsHistory = useSetRecoilState(paymentsHistoryAtom);

  const [selectedScholars, setSelectedScholars] = useState([] as ScholarSelector[]);

  const [status, setStatus] = useState<Status[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const finishOverviewModal = useCreateModal({
    id: 'finishOverviewModal',
    title: 'Ahoy, we are done here!',
    content: <PaymentsOverview status={status} />,
    size: '3xl',
  });

  const totalSlpClaimable = selectedScholars.reduce((prev, curr) => prev + curr.slp, 0);

  const handlePrevPage = () => {
    Router.push({
      pathname: '/payments/select',
    });
  };

  const getScholars = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getLoadable(allScholarsSelector).getValue(),
    [allScholarsSelector]
  );

  useEffect(() => {
    const callGetScholars = async () => {
      const loaded = getScholars();
      const filtered = loaded.filter(loadedScholar => selected.includes(loadedScholar.address));
      setSelectedScholars(filtered);
    };

    if (!selected.length) {
      Router.push('/payments/select');
    }

    if (selected.length) {
      callGetScholars();
    }
  }, [getScholars, selected]);

  useEffect(() => {
    const scholarsStatus = selectedScholars.map(scholar => ({
      address: scholar.address,
      steps: [
        {
          name: 'Claim',
          message: 'Waiting...',
        },
        {
          name: 'Manager',
          message: 'Waiting...',
        },
        {
          name: 'Scholar',
          message: 'Waiting...',
        },
      ],
    })) as Status[];

    setStatus(scholarsStatus);
  }, [selectedScholars]);

  const handleStart = async () => {
    setHasStarted(true);

    await Promise.all(
      selectedScholars.map(
        throat(2, async (scholar, index) => {
          const scholarWallet = allWallets.find(wallet => wallet.address === scholar.address);

          const scholarStatus = status.find(stat => stat.address === scholar.address);

          if (!scholar || !scholarStatus) {
            return Promise.reject(new Error('Scholar not found'));
          }

          if (!scholarWallet?.walletKey) {
            return Promise.reject(new Error('Corrupted wallet key.'));
          }

          const claim = await ClaimTransaction({
            privateKey: scholarWallet.walletKey,
            statusIndex: index,
            setStatus,
          });

          setPaymentsHistory(paymentHistory =>
            produce(paymentHistory, draft => {
              draft.push({
                address: scholar.address,
                name: scholar.name,
                created_at: dayjs().unix(),
                claim: {
                  amount: claim.amount,
                  hash: claim.tx.hash,
                  created_at: dayjs().unix(),
                },
                managerTransfer: null,
                scholarTransfer: null,
              });
            })
          );

          const scholarAmount = Math.floor((claim.amount * scholar.shares.scholar) / 100);
          const managerAmount = claim.amount - scholarAmount;

          const managerAddress = preferences.managerAddress?.replace('ronin:', '0x').toLowerCase();
          const paymentAddress = scholar.paymentAddress?.replace('ronin:', '0x').toLowerCase();
          const scholarAddress = scholar.address?.replace('ronin:', '0x').toLowerCase();

          if (managerAddress === paymentAddress && paymentAddress === scholarAddress) {
            console.log('skipping transfers: managerAddress === paymentAddress  === scholarAddress');

            setStatus(oldStatus =>
              produce(oldStatus, draft => {
                draft[index].steps[1].status = 'info';
                draft[index].steps[1].icon = <AiOutlineInfoCircle />;
                draft[index].steps[1].message = 'Skipping...';

                draft[index].steps[2].status = 'info';
                draft[index].steps[2].icon = <AiOutlineInfoCircle />;
                draft[index].steps[2].message = 'Skipping...';
              })
            );

            return Promise.resolve(status[index]);
          }

          if (managerAddress === paymentAddress) {
            console.log('sending all: managerAddress === paymentAddress');

            const managerTransfer = await TransferTransaction({
              statusIndex: index,
              statusType: 'Manager',
              setStatus,
              privateKey: scholarWallet.walletKey,
              to: preferences.managerAddress.replace('ronin:', '0x'),
              amount: claim.amount,
            });

            setPaymentsHistory(paymentHistory =>
              produce(paymentHistory, draft => {
                const paymentIndex = draft.reverse().findIndex(p => p.address === scholar.address);

                if (index !== -1) {
                  draft[paymentIndex].managerTransfer = {
                    amount: managerTransfer.amount,
                    hash: managerTransfer.tx.hash,
                    created_at: dayjs().unix(),
                  };
                }
              })
            );

            setStatus(oldStatus =>
              produce(oldStatus, draft => {
                draft[index].steps[2].status = 'info';
                draft[index].steps[2].icon = <AiOutlineInfoCircle />;
                draft[index].steps[2].message = 'Skipping...';
              })
            );

            return Promise.resolve(status[index]);
          }

          if (managerAmount === 0) {
            console.log('skipping tranfer: managerAmount === 0');

            setStatus(oldStatus =>
              produce(oldStatus, draft => {
                draft[index].steps[1].status = 'info';
                draft[index].steps[1].icon = <AiOutlineInfoCircle />;
                draft[index].steps[1].message = 'Skipping...';
              })
            );
          } else {
            const managerTransfer = await TransferTransaction({
              statusIndex: index,
              statusType: 'Manager',
              setStatus,
              privateKey: scholarWallet.walletKey,
              to: preferences.managerAddress.replace('ronin:', '0x'),
              amount: managerAmount,
            });

            setPaymentsHistory(paymentHistory =>
              produce(paymentHistory, draft => {
                const paymentIndex = draft.reverse().findIndex(p => p.address === scholar.address);

                if (index !== -1) {
                  draft[paymentIndex].managerTransfer = {
                    amount: managerTransfer.amount,
                    hash: managerTransfer.tx.hash,
                    created_at: dayjs().unix(),
                  };
                }
              })
            );
          }

          if (scholarAmount === 0) {
            console.log('skipping tranfer: scholarAmount === 0');

            setStatus(oldStatus =>
              produce(oldStatus, draft => {
                draft[index].steps[2].status = 'info';
                draft[index].steps[2].icon = <AiOutlineInfoCircle />;
                draft[index].steps[2].message = 'Skipping...';
              })
            );
          } else {
            const scholarTransfer = await TransferTransaction({
              statusIndex: index,
              statusType: 'Scholar',
              setStatus,
              privateKey: scholarWallet.walletKey,
              to: scholar.paymentAddress.replace('ronin:', '0x'),
              amount: scholarAmount,
            });

            setPaymentsHistory(paymentHistory =>
              produce(paymentHistory, draft => {
                const paymentIndex = draft.reverse().findIndex(p => p.address === scholar.address);

                if (index !== -1) {
                  draft[paymentIndex].scholarTransfer = {
                    amount: scholarTransfer.amount,
                    hash: scholarTransfer.tx.hash,
                    created_at: dayjs().unix(),
                  };
                }
              })
            );
          }

          return Promise.resolve(status[index]);
        })
      )
    ).then(() => finishOverviewModal.onOpen());
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

  if (!selectedScholars.length) {
    return null;
  }

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex>
        <Heading>2) Claim and send shares</Heading>

        <Button ml="auto" leftIcon={<AiFillCaretLeft />} onClick={handlePrevPage}>
          Previous
        </Button>
      </Flex>

      <Box px={3} py={5} mt={5}>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Text fontSize="xl">Ready to claim</Text>
            <Text color="red.200" fontWeight="bold" fontSize="2xl">
              {totalSlpClaimable} SLP
            </Text>

            <Text fontSize="xl">from</Text>
            <Text color="red.200" fontWeight="bold" fontSize="2xl">
              {selectedScholars.length} scholars.
            </Text>
          </HStack>

          <Stack>
            <HStack spacing={5}>
              <Stat textAlign="center">
                <StatLabel>Claimed</StatLabel>
                <StatNumber>{statusInfo.claimed}</StatNumber>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Manager</StatLabel>
                <StatNumber>{statusInfo.transferedManager}</StatNumber>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Scholar</StatLabel>
                <StatNumber>{statusInfo.transferedScholar}</StatNumber>
              </Stat>
            </HStack>
          </Stack>

          <Button leftIcon={<AiFillPlayCircle />} onClick={handleStart} variant="outline" disabled={hasStarted}>
            Start Payments
          </Button>
        </Flex>
      </Box>

      <Stack>
        <Stack spacing={3}>
          {status.length &&
            selectedScholars.map(scholar => {
              const { name, address, shares } = scholar || {};

              const scholarStatus = status.find(stt => stt.address === scholar.address);

              if (!scholarStatus) return null;

              return (
                <Fragment key={address}>
                  <Box py={5} minH="100px" color="white" fontWeight="bold">
                    <Grid templateColumns="repeat(5, 1fr)">
                      <GridItem colSpan={2}>
                        <Stack>
                          <HStack spacing={3}>
                            <Text>{name}</Text>

                            <Text opacity={0.9}>
                              {address.substr(0, 5)}...
                              {address.substr(address.length - 5)}
                            </Text>
                          </HStack>

                          <HStack>
                            <Image src="/images/axies/slp.png" width="18px" height="18px" alt="slp" />

                            <Text>{scholar.slp}</Text>

                            <HStack fontSize="sm">
                              <Text opacity={0.9}>{shares.manager}% manager</Text>

                              <Text opacity={0.9}>/</Text>

                              <Text opacity={0.9}>{shares.scholar}% scholar</Text>
                            </HStack>
                          </HStack>
                        </Stack>
                      </GridItem>

                      {scholarStatus.steps.map(step => {
                        const hashUrl = `https://explorer.roninchain.com/tx/${step.hash}`;

                        return (
                          <GridItem key={`${address}-${step.name}`}>
                            <Stack align="center">
                              <Text>{step.name}</Text>

                              <HStack>
                                {step.icon}

                                <Text color="red.200">
                                  {step.hash ? (
                                    <Link href={hashUrl} target="_blank">
                                      {step.message}
                                    </Link>
                                  ) : (
                                    step.message
                                  )}
                                </Text>
                              </HStack>
                            </Stack>
                          </GridItem>
                        );
                      })}
                    </Grid>
                  </Box>

                  <Divider />
                </Fragment>
              );
            })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default StartPaymentsPage;
