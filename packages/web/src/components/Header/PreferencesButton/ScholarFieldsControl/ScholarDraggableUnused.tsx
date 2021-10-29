import { Box } from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';

import { ScholarFields } from '../../../../recoil/scholars';
import { ScholarDraggableFields } from './ScholarDraggableFields';

interface ScholarDraggableUnusedProps {
  fields: ScholarFields[];
}

export const ScholarDraggableUnused = ({ fields }: ScholarDraggableUnusedProps): JSX.Element => {
  return (
    <Droppable droppableId="unused" direction="horizontal">
      {provided => (
        <Box
          p={3}
          borderWidth={2}
          borderStyle="dotted"
          borderRadius="md"
          h="90px"
          w="100%"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <ScholarDraggableFields fields={fields} />
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};
