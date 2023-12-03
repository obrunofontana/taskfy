'use client';

import { TaskColumn } from '@prisma/client';
import { MoreHorizontal, X } from 'lucide-react';
import { ElementRef, useRef } from 'react';
import { toast } from 'sonner';

import { copyTaskColumn } from '@/actions/copy-task-column';
import { deleteTaskColumn } from '@/actions/delete-task-column';
import { FormSubmit } from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAction } from '@/hooks/use-action';

interface TaskColumnOptionsProps {
  data: TaskColumn;
  onAddTask: () => void;
}

export const TaskColumnOptions = ({
  data,
  onAddTask,
}: TaskColumnOptionsProps) => {
  const closeRef = useRef<ElementRef<'button'>>(null);

  const { execute: executeDelete } = useAction(deleteTaskColumn, {
    onSuccess: (data) => {
      toast.success(`Coluna "${data.title}" removida`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyTaskColumn, {
    onSuccess: (data) => {
      toast.success(`Coluna "${data.title}" copiada`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get('id') as string;
    const projectId = formData.get('projectId') as string;

    executeDelete({ id, projectId });
  };

  const onCopy = (formData: FormData) => {
    const id = formData.get('id') as string;
    const projectId = formData.get('projectId') as string;

    executeCopy({ id, projectId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Ações
        </div>

        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          onClick={onAddTask}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Adicionar tarefa...
        </Button>

        <form action={onCopy}>
          <input hidden name="id" id="id" value={data.id} />
          <input
            hidden
            name="projectId"
            id="projectId"
            value={data.projectId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copiar coluna...
          </FormSubmit>
        </form>

        <Separator />

        <form action={onDelete}>
          <input hidden name="id" id="id" value={data.id} />
          <input
            hidden
            name="projectId"
            id="projectId"
            value={data.projectId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Remover esta coluna
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
