import { useCallback, useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { ScholarFields } from '../../../../recoil/scholars';
import { ScholarDroppableCard } from './ScholarDroppableCard';
import { ScholarDraggableUnused } from './ScholarDraggableUnused';

interface ScholarFieldsControlListProps {
  fields: ScholarFields[];
  onChange: (fields: ScholarFields[]) => void;
}

export const ScholarFieldsControlList = ({ fields, onChange }: ScholarFieldsControlListProps): JSX.Element => {
  const fieldsList = [
    'name',
    'slp',
    'scholarShare',
    'managerShare',
    'investorShare',
    'arenaElo',
    'yesterdaySlp',
    'todaySlp',
    'slpDay',
    'adventureSlp',
    'lastClaim',
    'nextClaim',
  ] as ScholarFields[];

  const [activeFields, setActiveFields] = useState(fields);
  const [unusedFields, setUnusedFields] = useState(fieldsList.filter(field => !fields.includes(field)));

  const fixedFields = ['name', 'slp'] as ScholarFields[];

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;

      const columns = {
        active: Array.from(activeFields),
        unused: Array.from(unusedFields),
      } as { [key: string]: ScholarFields[] };

      columns[source.droppableId].splice(source.index, 1);
      columns[destination.droppableId].splice(destination.index, 0, draggableId as ScholarFields);

      setActiveFields(columns.active);
      setUnusedFields(columns.unused);

      onChange(columns.active);
    },
    [activeFields, onChange, unusedFields]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack>
        <ScholarDroppableCard fields={activeFields} fixedFields={fixedFields} />
        <ScholarDraggableUnused fields={unusedFields} />
      </Stack>
    </DragDropContext>
  );
};
