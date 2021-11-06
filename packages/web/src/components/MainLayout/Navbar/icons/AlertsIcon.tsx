import { Icon, IconProps } from '@chakra-ui/react';

function AlertsIcon(props: IconProps): JSX.Element {
  return (
    <Icon
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <g fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={2} />
        <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14" />
      </g>
    </Icon>
  );
}

export default AlertsIcon;
