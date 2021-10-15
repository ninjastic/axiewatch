import { useRecoilValue } from 'recoil';

import { openModalsSelector } from '../../recoil/modal';
import { ModalTemplate } from './ModalTemplate';

export const ModalController = (): JSX.Element => {
  const modals = useRecoilValue(openModalsSelector);

  if (modals.length) {
    return (
      <>
        {modals.map(modal => (
          <ModalTemplate key={modal.id} id={modal.id} />
        ))}
      </>
    );
  }

  return null;
};
