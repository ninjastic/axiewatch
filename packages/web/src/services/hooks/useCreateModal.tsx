import { ThemeTypings } from '@chakra-ui/react';
import { useState, useEffect, ReactNode, useCallback } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

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
  const [modal, setModal] = useRecoilState(modalSelector(id));
  const reset = useResetRecoilState(modalSelector(id));

  const onOpen = useCallback(() => setModal(prev => ({ ...prev, id, isOpen: true })), [id, setModal]);
  const onClose = useCallback(() => setModal(prev => ({ ...prev, id, isOpen: false })), [id, setModal]);

  const { isOpen } = modal;

  useEffect(() => {
    if (!modal.id) {
      setModal({
        id,
        title,
        content,
        size,
        footer,
        isOpen: defaultIsOpen,
        onOpen,
        onClose,
        setExtra,
        extra,
      });
    }
  }, [content, defaultIsOpen, extra, footer, id, isOpen, modal.id, onClose, onOpen, setModal, size, title]);

  useEffect(() => () => reset(), [reset]);

  return { isOpen, onOpen, onClose, setExtra, extra };
};
