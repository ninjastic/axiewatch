import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { modalSelector } from '../../recoil/modal';

interface ModalTemplateProps {
  id: string;
}

export const ModalTemplate = ({ id }: ModalTemplateProps): JSX.Element => {
  const modal = useRecoilValue(modalSelector(id));

  const { isOpen, onClose, title, content, footer, size } = modal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>{content}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
