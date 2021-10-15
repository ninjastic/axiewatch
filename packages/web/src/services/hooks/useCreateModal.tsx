import { useDisclosure, ThemeTypings } from '@chakra-ui/react';
import { useState, useEffect, ReactNode } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { modalSelector, ModalState } from '../../recoil/modal';

export interface UseCreateModalProps {
  id: string;
  title: () => ReactNode;
  content: () => ReactNode;
  footer?: () => ReactNode;
  size?: ThemeTypings['sizes'];
  isDialog?: boolean;
  defaultIsOpen?: boolean;
}

export type UseCreateModalData = Pick<ModalState, 'isOpen' | 'onOpen' | 'onClose' | 'setExtra' | 'extra'>;

export const useCreateModal = ({
  id,
  title,
  content,
  size,
  footer,
  defaultIsOpen,
}: UseCreateModalProps): UseCreateModalData => {
  const [extra, setExtra] = useState<any>(null);
  const setModal = useSetRecoilState(modalSelector(id));
  const reset = useResetRecoilState(modalSelector(id));

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen,
  });

  useEffect(() => {
    setModal({
      id,
      title,
      content,
      size,
      footer,
      isOpen,
      onOpen,
      onClose,
      setExtra,
      extra,
    });
  }, [isOpen, onOpen, onClose, setExtra]);

  useEffect(() => () => reset(), [reset]);

  return { isOpen, onOpen, onClose, setExtra, extra };
};
