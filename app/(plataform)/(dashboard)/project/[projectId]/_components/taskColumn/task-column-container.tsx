'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { updateTaskColumnOrder } from '@/actions/update-task-column-order';
import { updateTaskOrder } from '@/actions/update-task-order';
import { useAction } from '@/hooks/use-action';
import { TaskColumWithTasks } from '@/types';

import { TaskColumnForm } from './task-column-form';
import { TaskColumnItem } from './task-column-item';

interface TaskColumnContainerProps {
  data: TaskColumWithTasks[];
  projectId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const TaskColumnContainer = ({
  data,
  projectId,
}: TaskColumnContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateTaskColumnOrder, {
    onSuccess: () => {
      toast.success('Coluna reordenada');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateTaskOrder } = useAction(updateTaskOrder, {
    onSuccess: () => {
      toast.success('Tarefa reordenada');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a taskColumn
    if (type === 'taskColumn') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, projectId });
    }

    // User moves a task
    if (type === 'task') {
      let newOrderedData = [...orderedData];

      // Source and destination taskColumn
      const sourceTaskColumn = newOrderedData.find(
        (taskColumn) => taskColumn.id === source.droppableId
      );
      const destTaskColumn = newOrderedData.find(
        (taskColumn) => taskColumn.id === destination.droppableId
      );

      if (!sourceTaskColumn || !destTaskColumn) {
        return;
      }

      // Check if tasks exists on the sourceTaskColumn
      if (!sourceTaskColumn.tasks) {
        sourceTaskColumn.tasks = [];
      }

      // Check if tasks exists on the destTaskColumn
      if (!destTaskColumn.tasks) {
        destTaskColumn.tasks = [];
      }

      // Moving the task in the same taskColumn
      if (source.droppableId === destination.droppableId) {
        const reorderedTasks = reorder(
          sourceTaskColumn.tasks,
          source.index,
          destination.index
        );

        reorderedTasks.forEach((task, idx) => {
          task.order = idx;
        });

        sourceTaskColumn.tasks = reorderedTasks;

        setOrderedData(newOrderedData);
        executeUpdateTaskOrder({
          projectId: projectId,
          items: reorderedTasks,
        });
        // User moves the task to another taskColumn
      } else {
        // Remove task from the source taskColumn
        const [movedTask] = sourceTaskColumn.tasks.splice(source.index, 1);

        // Assign the new taskColumnId to the moved task
        movedTask.taskColumnId = destination.droppableId;

        // Add task to the destination taskColumn
        destTaskColumn.tasks.splice(destination.index, 0, movedTask);

        sourceTaskColumn.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        // Update the order for each task in the destination taskColumn
        destTaskColumn.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateTaskOrder({
          projectId: projectId,
          items: destTaskColumn.tasks,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="taskColumns"
        type="taskColumn"
        direction="horizontal"
      >
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <TaskColumnItem key={list.id} index={index} data={list} />;
            })}

            {provided.placeholder}
            <TaskColumnForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
