import { Box, Text, Flex, Heading, Button, HStack, Link, Divider, Tag } from '@chakra-ui/react';
import { useState, Fragment, useEffect } from 'react';
import { AiFillCaretRight, AiOutlineLink } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import Router from 'next/router';
import dynamic from 'next/dynamic';

import dayjs from '../../services/dayjs';
import { paymentsHistorySortSelector } from '../../recoil/payments';

export const PaymentsPage = (): JSX.Element => {
  const paymentsHistory = useRecoilValue(paymentsHistorySortSelector);

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  const handleNextPage = () => {
    Router.push({
      pathname: '/payments/select',
    });
  };

  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Flex>
        <Heading>Payments</Heading>

        <Box ml="auto">
          <Button rightIcon={<AiFillCaretRight />} onClick={handleNextPage}>
            Make payments
          </Button>
        </Box>
      </Flex>

      <Box mt={10}>
        {!paymentsHistory.length && <Text>No payment history was found.</Text>}

        {!!paymentsHistory.length && (
          <Box>
            {paymentsHistory.slice((page - 1) * limit, limit * page).map(payment => (
              <Fragment key={`${payment.address}-${payment.created_at}`}>
                <Box p={5} rounded="3xl">
                  <Tag mb={3}>{dayjs.unix(payment.created_at).format('DD/MM/YYYY HH:mm:ss')}</Tag>

                  <HStack>
                    <Text fontWeight="bold" fontSize="lg">
                      {payment.name}
                    </Text>

                    <Text opacity={0.9}>{payment.address}</Text>
                  </HStack>

                  {payment.claim && (
                    <HStack fontSize="sm">
                      <Text fontWeight="bold" color="red.200">
                        - {dayjs.unix(payment.claim?.created_at).format('DD/MM/YYYY HH:mm:ss')}
                      </Text>

                      <Text>Claimed</Text>
                      <Text fontWeight="bold" color="red.200">
                        {payment.claim?.amount} SLP
                      </Text>
                      <Link href={`https://explorer.roninchain.com/tx/${payment.claim.hash}`} target="_blank">
                        <AiOutlineLink />
                      </Link>
                    </HStack>
                  )}

                  {payment.managerTransfer && (
                    <HStack fontSize="sm">
                      <Text fontWeight="bold" color="red.200">
                        - {dayjs.unix(payment.managerTransfer.created_at).format('DD/MM/YYYY HH:mm:ss')}
                      </Text>

                      <Text>Transfered</Text>
                      <Text fontWeight="bold" color="red.200">
                        {payment.managerTransfer.amount} SLP
                      </Text>
                      <Text>to</Text>
                      <Text fontWeight="bold" color="red.200">
                        manager
                      </Text>
                      <Link href={`https://explorer.roninchain.com/tx/${payment.managerTransfer.hash}`} target="_blank">
                        <AiOutlineLink />
                      </Link>
                    </HStack>
                  )}

                  {payment.scholarTransfer && (
                    <HStack fontSize="sm">
                      <Text fontWeight="bold" color="red.200">
                        - {dayjs.unix(payment.scholarTransfer.created_at).format('DD/MM/YYYY HH:mm:ss')}
                      </Text>

                      <Text>Transfered</Text>
                      <Text fontWeight="bold" color="red.200">
                        {payment.scholarTransfer.amount} SLP
                      </Text>
                      <Text>to</Text>
                      <Text fontWeight="bold" color="red.200">
                        scholar
                      </Text>
                      <Link href={`https://explorer.roninchain.com/tx/${payment.scholarTransfer.hash}`} target="_blank">
                        <AiOutlineLink />
                      </Link>
                    </HStack>
                  )}
                </Box>
                <Divider />
              </Fragment>
            ))}

            <Flex align="center" justify="space-between" py={8}>
              <Button onClick={() => setPage(oldPage => oldPage - 1)} disabled={page === 0}>
                Previous page
              </Button>

              <Text opacity={0.9}>
                Page {page} of {Math.ceil(paymentsHistory.length / limit)}
              </Text>

              <Button onClick={() => setPage(oldPage => oldPage + 1)} disabled={limit * page >= paymentsHistory.length}>
                Next page
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(PaymentsPage), { ssr: false });
