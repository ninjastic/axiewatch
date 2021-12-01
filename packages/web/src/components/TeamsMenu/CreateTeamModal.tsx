import { Box, FormControl, FormLabel, Stack, Input, Flex, Button, FormErrorMessage } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRecoilTransaction_UNSTABLE, useRecoilValue } from 'recoil';
import * as Yup from 'yup';

import { teamsMapAtom, teamStateAtomFamily } from '@src/recoil/teams';
import { modalSelector } from '@src/recoil/modal';
import { Card } from '@components/Card';

interface TeamFormData {
  name: string;
  scholarsMap: string[];
}

export const CreateTeamModal = (): JSX.Element => {
  const teams = useRecoilValue(teamsMapAtom);
  const modal = useRecoilValue(modalSelector('createTeamModal'));

  const createTeam = useRecoilTransaction_UNSTABLE(({ set }) => (data: TeamFormData) => {
    const id = data.name.replaceAll(' ', '-').toLowerCase();
    set(teamsMapAtom, prev => [...prev, id]);
    set(teamStateAtomFamily(id), { ...data, id });
  });

  const handleSubmit = (data: TeamFormData) => {
    createTeam(data);
    modal.onClose();
  };

  const teamSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Min length is 3')
      .max(25, 'Max length is 25')
      .required('Required')
      .test(
        'is-inexistent',
        'Team already exists',
        value => !teams.includes(value?.replaceAll(' ', '-').toLowerCase())
      ),
  });

  return (
    <Box px={2} py={3}>
      <Card p={5}>
        <Formik initialValues={{ name: '', scholarsMap: [] }} onSubmit={handleSubmit} validationSchema={teamSchema}>
          {({ values, errors, handleChange }) => (
            <Form>
              <Stack spacing={3}>
                <FormControl id="name" isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" value={values.name} onChange={handleChange} placeholder="Team Alfa" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <Flex justify="flex-end">
                  <Button type="submit">Done</Button>
                </Flex>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};
