'use client';

import { TaskColumn } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useEventListener } from 'usehooks-ts';

import { updateTaskColumn } from '@/actions/update-task-column';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';

import { TaskColumnOptions } from './task-column-options';

interface TaskColumnHeaderProps {
  data: TaskColumn;
  onAddTask: () => void;
}

export const TaskColumnHeader = ({
  data,
  onAddTask,
}: TaskColumnHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateTaskColumn, {
    onSuccess: (data) => {
      toast.success(`Renomeado para "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const id = formData.get('id') as string;
    const projectId = formData.get('projectId') as string;

    if (title === data.title) {
      return disableEditing();
    }

    execute({
      title,
      id,
      projectId,
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start- gap-x-2">
      {isEditing ? (
        <form ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" value={data.id} />
          <input
            hidden
            id="projectId"
            name="projectId"
            value={data.projectId}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Insira o título da lista..."
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <TaskColumnOptions onAddTask={onAddTask} data={data} />
    </div>
  );
};
