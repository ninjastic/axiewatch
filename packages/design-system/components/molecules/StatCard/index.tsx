import { useColorModeValue, ThemingProps, useTheme } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { transparentize } from '@chakra-ui/theme-tools';

import Card, { CardProps } from '../../atoms/Card';

export interface StatCardProps extends CardProps {
  cardColor?: ThemingProps['colorScheme'];
  accentColor?: ThemingProps['colorScheme'];
  darkNoColor?: boolean;
}

const StatCard = ({
  children,
  cardColor,
  accentColor = cardColor,
  darkNoColor,
  ...props
}: StatCardProps): JSX.Element => {
  const cardRef = useRef(null);
  const theme = useTheme();
  const defaultBg = useColorModeValue('light.bgLevel1', 'dark.bgLevel2');
  const colorBg = useColorModeValue(`${cardColor}.600`, darkNoColor ? 'dark.bgLevel2' : `${cardColor}.600`);
  const color = useColorModeValue('black', 'white');

  const bg = cardColor ? colorBg : defaultBg;

  const sphereColor = useColorModeValue(
    cardColor ? `${accentColor}.100` : `${accentColor}.600`,
    cardColor && !darkNoColor ? `${accentColor}.100` : `${accentColor}.500`
  );

  const [sx, setSx] = useState({
    _after: {
      content: '""',
      position: 'absolute',
      width: '210px',
      height: '210px',
      borderRadius: '50%',
      zIndex: 1,
      top: '-85px',
      right: '-95px',
      background: `linear-gradient(210.04deg, ${transparentize(
        `${sphereColor}`,
        1
      )(theme)} -50.94%, rgb(144 202 249 / 0%) 95.49%)`,
    },
    _before: {
      opacity: 0.5,
      content: '""',
      position: 'absolute',
      width: '210px',
      height: '210px',
      borderRadius: '50%',
      zIndex: 1,
      top: '-125px',
      right: '-15px',
      background: `linear-gradient(140.9deg, ${transparentize(
        `${sphereColor}`,
        1
      )(theme)} -50.94%, rgb(144 202 249 / 0%) 82.5%)`,
    },
  });

  useEffect(() => {
    const height = cardRef?.current?.offsetHeight;

    if (height < 150) {
      setSx(s => ({
        ...s,
        _after: {
          ...s._after,
          top: '-30px',
          right: '-180px',
          bg: `linear-gradient(210.04deg, ${transparentize(
            `${sphereColor}`,
            1
          )(theme)} -50.94%, rgb(144 202 249 / 0%) 83.49%)`,
        },
        _before: {
          ...s._before,
          top: '-160px',
          right: '-130px',
          bg: `linear-gradient(140.9deg, ${transparentize(
            `${sphereColor}`,
            1
          )(theme)} -14.02%, rgb(144 202 249 / 0%) 77.58%)`,
        },
      }));
    }
  }, [accentColor, cardRef, sphereColor, theme]);

  return (
    <Card
      ref={cardRef}
      bg={bg}
      color={cardColor ? 'white' : color}
      position="relative"
      overflow="hidden"
      sx={accentColor ? sx : null}
      {...props}
    >
      {children}
    </Card>
  );
};

export default StatCard;
