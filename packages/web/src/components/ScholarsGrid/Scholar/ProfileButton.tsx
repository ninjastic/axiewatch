import { Button } from '@chakra-ui/react';
import { BsPeopleCircle } from 'react-icons/bs';

interface ProfileButtonProps {
  address: string;
}

export const ProfileButton = ({ address }: ProfileButtonProps): JSX.Element => {
  const addressWithoutPrefix = address.replace('0x', '');

  return (
    <Button
      leftIcon={<BsPeopleCircle />}
      onClick={() =>
        window.open(`https://marketplace.axieinfinity.com/profile/ronin:${addressWithoutPrefix}/axie`, '_blank')
      }
    >
      Profile
    </Button>
  );
};
