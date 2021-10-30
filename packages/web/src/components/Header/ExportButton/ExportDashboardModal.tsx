import {
  Box,
  HStack,
  Stack,
  Text,
  Checkbox,
  Button,
  Textarea,
  Input,
  Divider,
  Link as ChakraLink,
  Spinner,
  IconButton,
  useClipboard,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { Formik, Form } from 'formik';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Select } from 'chakra-react-select';

import { serverApi } from '../../../services/api';
import { useAuth } from '../../../services/hooks/useAuth';

export const ExportDashboardModal = (): JSX.Element => {
  const auth = useAuth();

  const [isWhitelistedEmails, setIsWhitelistedEmail] = useState(false);
  const [isCustomLogo, setIsCustomLogo] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [slug, setSlug] = useState('');

  const dashboardUrl = process.browser ? `${window.location.origin}/dashboard/${slug}` : undefined;

  const { onCopy } = useClipboard(dashboardUrl ?? '');

  const { data, isLoading: dashboardIsLoading } = useQuery(
    'dashboard',
    async () => {
      return serverApi
        .get('/dashboard', {
          params: {
            user_id: auth?.user?.id,
          },
        })
        .then(response => response.data)
        .catch(err => {
          if (err.response.status) return {};
          throw new Error('Something went wrong');
        });
    },
    {
      enabled: !!auth.user,
      staleTime: Infinity,
      refetchOnMount: 'always',
      onError: error => toast(error, { type: 'error' }),
    }
  );

  const exportDashboard = async (formData: any) => {
    setIsLoading(true);

    serverApi
      .post(
        '/dashboard',
        {
          whitelist: isWhitelistedEmails && formData.whitelist ? formData.whitelist.split('\n') : '',
          customLogo: isCustomLogo ? formData.customLogo : '',
        },
        {
          headers: { authorization: auth.session?.access_token },
        }
      )
      .then(response => {
        setSlug(response.data.slug);
        toast('Shared dashboard updated', {
          type: 'success',
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (data) {
      if (data.logo) {
        setIsCustomLogo(true);
      }

      if (data.whitelist && JSON.parse(data.whitelist).length) {
        setIsWhitelistedEmail(true);
      }

      if (data.slug) {
        setSlug(data.slug);
      }
    }
  }, [data]);

  if (!auth.user) {
    return (
      <Box pb={5}>
        <Text color="gray.100">
          You need to be logged in to use this feature. Go to the{' '}
          <Text fontWeight="bold" as="span">
            <Link href="/signin">Sign In</Link>
          </Text>{' '}
          page.
        </Text>
      </Box>
    );
  }

  if (dashboardIsLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Formik
      initialValues={{
        whitelist: data?.whitelist
          ? JSON.parse(data?.whitelist || '[]')
              .join('\n')
              .trim()
          : '',
        customLogo: data?.logo,
      }}
      onSubmit={exportDashboard}
    >
      {({ values, handleChange }) => (
        <Form>
          <Stack pb={5} px={2} spacing={5}>
            <Text opacity={0.9}>
              P.S: The dashboard will use the data on our servers through CloudSync. Make sure to keep them up to date
              whenever you make a change (Sync {'->'} Upload)
            </Text>

            <Stack>
              <Text fontWeight="bold">Settings</Text>

              <Stack>
                <Checkbox isChecked={isWhitelistedEmails} onChange={e => setIsWhitelistedEmail(e.target.checked)}>
                  Only whitelisted emails
                </Checkbox>

                {isWhitelistedEmails && (
                  <Textarea
                    name="whitelist"
                    placeholder="jiho@example.com"
                    onChange={handleChange}
                    value={values.whitelist}
                  />
                )}

                <Checkbox isChecked={isCustomLogo} onChange={e => setIsCustomLogo(e.target.checked)}>
                  Custom logo
                </Checkbox>

                {isCustomLogo && (
                  <Input
                    name="customLogo"
                    placeholder="https://i.imgur.com/bHCSag4.png"
                    onChange={handleChange}
                    value={values.customLogo}
                  />
                )}
              </Stack>
            </Stack>

            <Divider />

            <Stack>
              <Text fontWeight="bold">Dashboard type</Text>

              <Stack spacing={3}>
                <Select
                  options={[{ label: 'PVP and SLP', value: 'pvpAndSlp ' }]}
                  defaultValue={{
                    label: 'PVP and SLP',
                    value: 'pvpAndSlp ',
                  }}
                />
              </Stack>
            </Stack>

            <Box>
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>

              {slug && (
                <HStack mt={5}>
                  <Text fontWeight="bold">URL:</Text>

                  <Text>
                    <ChakraLink target="_blank" href={dashboardUrl}>
                      {dashboardUrl}
                    </ChakraLink>
                  </Text>

                  <IconButton
                    aria-label="Copy dashboard url"
                    minW="25px"
                    icon={<MdContentCopy />}
                    variant="link"
                    onClick={onCopy}
                  />
                </HStack>
              )}
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
