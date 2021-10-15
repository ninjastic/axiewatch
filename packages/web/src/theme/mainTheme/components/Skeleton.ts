import { keyframes } from '@chakra-ui/system';
import { mode, getColor } from '@chakra-ui/theme-tools';

const fade = (startColor: string, endColor: string) =>
  keyframes({
    from: { borderColor: startColor, background: startColor },
    to: { borderColor: endColor, background: endColor },
  });

export const baseStyle = (props: any) => {
  const start = getColor(props.theme, mode('gray.200', 'whiteAlpha.200')(props));
  const end = getColor(props.theme, mode('gray', 'gray')(props));

  return {
    animation: `${props.speed}s linear infinite alternate ${fade(start, end)}`,
  };
};

export const SkeletonStyles = {
  baseStyle,
};
