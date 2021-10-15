export const TabsStyles = {
  parts: ['root', 'tab', 'tabpanels'],
  variants: {
    'soft-rounded': {
      tab: {
        borderRadius: 'full',
        fontWeight: 'semibold',
        color: 'gray.500',
        _selected: {
          color: 'black',
          bg: 'white',
        },
      },
    },
  },
};
