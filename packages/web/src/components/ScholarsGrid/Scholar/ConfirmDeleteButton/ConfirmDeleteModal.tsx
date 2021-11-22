import { Button, Text, Table, Thead, Tr, Th, Tbody, Td, chakra } from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import { modalSelector } from '../../../../recoil/modal';
import { scholarSelector, scholarsMap } from '../../../../recoil/scholars';

interface ConfirmDeleteModalProps {
  scholarAddress: string;
}

export const ConfirmDeleteModalBody = ({ scholarAddress }: ConfirmDeleteModalProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(scholarAddress));

  return (
    <>
      <Text>Are you sure you want to delete this scholar?</Text>

      <chakra.div mt={5}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td wordBreak="break-all">{scholar.name}</Td>
              <Td wordBreak="break-all">{scholar.address}</Td>
            </Tr>
          </Tbody>
        </Table>
      </chakra.div>
    </>
  );
};

export const ConfirmDeleteModalFooter = ({ scholarAddress }: ConfirmDeleteModalProps): JSX.Element => {
  const setScholars = useSetRecoilState(scholarsMap);

  const editScholarModal = useRecoilValue(modalSelector(`editScholarModal:${scholarAddress}`));
  const confirmDeleteModal = useRecoilValue(modalSelector(`confirmDeleteModal:${scholarAddress}`));

  const handleDelete = () => {
    setScholars(old => old.filter(s => s.address !== scholarAddress));

    if (editScholarModal.isOpen) {
      editScholarModal.onClose();
    }

    toast(`Scholar ${scholarAddress.substr(0, 5)} deleted.`, {
      type: 'success',
    });

    confirmDeleteModal.onClose();
  };

  return (
    <>
      <Button onClick={confirmDeleteModal.onClose}>No</Button>

      <Button colorScheme="red" ml={3} onClick={handleDelete}>
        Yes
      </Button>
    </>
  );
};
