import {
  Box,
  Image,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  HStack,
  SkeletonText,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { AiOutlineTrophy } from 'react-icons/ai';
import { RiSwordLine } from 'react-icons/ri';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import { serverApi } from '../../services/api';
import { useBatchScholar } from '../../services/hooks/useBatchScholar';
import { Card } from '../../components/Card';
import { LoadingScreen } from '../../components/MainLayout/LoadingScreen';
import { BallScaleLoading } from 'src/components/BallScaleLoading';

export const DashboardSlug = (): JSX.Element => {
  const slug = window.location.pathname.replace('/dashboard/', '');

  const [email, setEmail] = useState<string | null>(null);
  const [emailIsLoading, setEmailIsLoading] = useState<boolean>(false);

  const { data, isLoading } = useQuery(
    ['dashboard', slug, email],
    async () => {
      const response = await serverApi.get('/dashboard', {
        params: {
          slug,
          email,
        },
      });

      return response.data;
    },
    { staleTime: 1000 * 60 * 15 }
  );

  const addresses = data?.scholars ? data.scholars.map(scholar => scholar.address) : [];

  const { data: scholarsData, isLoading: isLoadingScholars } = useBatchScholar({
    addresses,
    enabled: data && !isLoading,
  });

  const scholars = useMemo(
    () =>
      scholarsData.map((result, index) => ({
        name: data.scholars[index].name,
        inactive: data.scholars[index].inactive,
        ...result,
      })),
    [data?.scholars, scholarsData]
  );

  const filteredScholars = useMemo(() => scholars.filter(scholar => !scholar.inactive), [scholars]);

  const sortedScholars = useMemo(
    () =>
      !isLoadingScholars
        ? filteredScholars.sort((a, b) => {
            if (a.pvpElo > b.pvpElo) return -1;
            if (a.pvpElo < b.pvpElo) return 1;
            return 0;
          })
        : [],
    [filteredScholars, isLoadingScholars]
  );

  const getIndexWeight = useCallback((index: number) => (index < 3 ? 'bold' : 'normal'), []);

  const getNamePrefix = useCallback(
    (index: number) => {
      if (sortedScholars.length > 20 && index < 10) {
        return '🔥 ';
      }

      if (sortedScholars.length > 10 && index < 3) {
        return '🔥 ';
      }

      return '';
    },
    [sortedScholars.length]
  );

  const handleAuthenticate = async (formData: { email: string }) => {
    if (!formData.email) {
      toast('Email can not be empty', {
        type: 'error',
      });
      return;
    }

    setEmailIsLoading(true);

    serverApi
      .get('/dashboard', {
        params: {
          slug,
          email: formData.email,
        },
      })
      .then(response => {
        if (response.data.scholars) {
          setEmail(formData.email);
        }
        setEmailIsLoading(false);
      })
      .catch(error => {
        toast(error.response.data.error || error.message, {
          type: 'error',
        });
        setEmailIsLoading(false);
      });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (data && !data.scholars && data.dashboard.whitelist) {
    return (
      <Flex h="full" maxW="450px" margin="auto" align="center" justify="center" p={5}>
        <Box w="100%" mt={5}>
          <Formik initialValues={{ email: '' }} onSubmit={handleAuthenticate}>
            {({ values, handleChange }) => (
              <Form>
                <Stack spacing={3}>
                  <Text textAlign="center" fontWeight="bold" fontSize="2xl">
                    Authenticate
                  </Text>

                  <FormControl id="email" pt={3}>
                    <FormLabel>Email</FormLabel>

                    <Input placeholder="jiho@example.com" name="email" value={values.email} onChange={handleChange} />
                  </FormControl>

                  <Flex justify="right">
                    <Button isLoading={emailIsLoading} type="submit">
                      Continue
                    </Button>
                  </Flex>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <NextSeo title="Leaderboard" />

      <Box align="center" py={5} px={3}>
        <Image src={data.dashboard?.logo || '/images/logo2.png'} maxH="125px" alt="logo" />

        <Box mt={5}>
          <Text fontWeight="bold" fontSize="lg" my={8}>
            Leaderboard
          </Text>

          <Box maxW="1450px" margin="auto">
            <Card p={5} overflowX="auto">
              {isLoadingScholars ? (
                <Stack spacing={3} my={5} align="center">
                  <BallScaleLoading />

                  <Text fontWeight="bold">Loading scholars...</Text>
                </Stack>
              ) : (
                <Table variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Name</Th>
                      <Th>Elo</Th>
                      <Th>Rank</Th>
                      <Th>SLP</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {sortedScholars.map((scholar, index) => {
                      return (
                        <Tr key={`${scholar.address}-${scholar.name}`}>
                          <Td fontWeight={getIndexWeight(index)}>{index + 1}</Td>

                          <Td>
                            <SkeletonText isLoaded={scholar.loaded} noOfLines={1} w="200px">
                              <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxW="200px">
                                {getNamePrefix(index)}
                                {scholar.name}
                              </Text>
                            </SkeletonText>
                          </Td>

                          <Td>
                            <SkeletonText isLoaded={scholar.loaded} noOfLines={1} width="100px">
                              <HStack>
                                <RiSwordLine />
                                <Text>{scholar.pvpElo}</Text>
                              </HStack>
                            </SkeletonText>
                          </Td>

                          <Td>
                            <SkeletonText isLoaded={scholar.loaded} noOfLines={1} width="100px">
                              <HStack>
                                <AiOutlineTrophy />
                                <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                                  {scholar.pvpRank}
                                </Text>
                              </HStack>
                            </SkeletonText>
                          </Td>

                          <Td>
                            <SkeletonText isLoaded={scholar.loaded} noOfLines={1} width="100px">
                              <HStack>
                                <Image src="/images/axies/slp.png" height="16px" alt="slp" />
                                <Text>{scholar.slp}</Text>
                              </HStack>
                            </SkeletonText>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </Card>

            <Text textAlign="right" fontSize="sm" color="gray.400" mt={2}>
              Data is cached for 15 minutes.
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default dynamic(() => Promise.resolve(DashboardSlug), { ssr: false });
