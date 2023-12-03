'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ElementRef, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { TaskColumWithTasks } from '@/types';

import { TaskForm, TaskItem } from '../task';
import { TaskColumnHeader } from './task-column-header';

interface TaskColumnItemProps {
  data: TaskColumWithTasks;
  index: number;
}

export const TaskColumnItem = ({ data, index }: TaskColumnItemProps) => {
  const textareaRef = useRef<ElementRef<'textarea'>>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <TaskColumnHeader onAddTask={enableEditing} data={data} />

            <Droppable droppableId={data.id} type="task">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
                    data.tasks.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.tasks.map((task, index) => (
                    <TaskItem index={index} key={task.id} data={task} />
                  ))}

                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <TaskForm
              taskColumnId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
