import { Tag, HStack, chakra } from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';

import { ScholarFields } from '../../../../recoil/scholars';

interface ScholarDraggableFieldsProps {
  fields: ScholarFields[];
  fixedFields?: ScholarFields[];
}

export function ScholarDraggableFields({ fields, fixedFields }: ScholarDraggableFieldsProps) {
  const fieldsList = {
    name: <Tag>Name</Tag>,
    slp: <Tag>SLP</Tag>,
    scholarShare: <Tag>Scholar Share</Tag>,
    managerShare: <Tag>Manager Share</Tag>,
    investorShare: <Tag>Investor Share</Tag>,
    arenaElo: <Tag>Arena Elo</Tag>,
    yesterdaySlp: <Tag>Yesterday Slp</Tag>,
    todaySlp: <Tag>Today Slp</Tag>,
    slpDay: <Tag>Slp per Day</Tag>,
    adventureSlp: <Tag>Adventure Slp</Tag>,
    lastClaim: <Tag>Last Claim</Tag>,
    nextClaim: <Tag>Next Claim</Tag>,
  } as { [key: string]: JSX.Element };

  return (
    <HStack>
      {fields.map((key, index) => (
        <Draggable key={key} draggableId={key} index={index} isDragDisabled={fixedFields && fixedFields.includes(key)}>
          {provided => (
            <chakra.div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              {fieldsList[key]}
            </chakra.div>
          )}
        </Draggable>
      ))}
    </HStack>
  );
}
