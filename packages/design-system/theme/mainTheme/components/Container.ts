import { mode, SystemStyleFunction } from '@chakra-ui/theme-tools';

const body: SystemStyleFunction = props => {
  return {
    maxW: 'auto',
    w: 'auto',
    background: mode('light.bgLevel2', 'dark.bgLevel3')(props),
    borderTopRadius: 'xl',
    padding: 5,
    marginRight: 5,
  };
};

const content: SystemStyleFunction = props => {
  return {
    maxW: 'auto',
    background: mode('light.bgLevel1', 'dark.bgLevel2')(props),
  };
};

const variants = {
  body,
  content,
};

export default {
  variants,
};
