import { Flex } from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';

import { ScholarFields } from '../../../../recoil/scholars';
import { Card } from '../../../Card';
import { ScholarDraggableFields } from './ScholarDraggableFields';

interface ScholarDroppableCardProps {
  fields: ScholarFields[];
  fixedFields?: ScholarFields[];
}

export const ScholarDroppableCard = ({ fields, fixedFields }: ScholarDroppableCardProps): JSX.Element => {
  return (
    <Card w="100%">
      <Droppable droppableId="active" direction="horizontal">
        {provided => (
          <Flex align="center" ref={provided.innerRef} {...provided.droppableProps} p={3} minH="50px">
            <ScholarDraggableFields fields={fields} fixedFields={fixedFields} />
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Card>
  );
};
