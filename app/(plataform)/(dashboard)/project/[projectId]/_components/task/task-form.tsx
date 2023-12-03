'use client';

import { Plus, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

import { createTask } from '@/actions/create-task';
import { FormSubmit } from '@/components/form/form-submit';
import { FormTextarea } from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';

interface TaskFormProps {
  taskColumnId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

export const TaskForm = forwardRef<HTMLTextAreaElement, TaskFormProps>(
  ({ taskColumnId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<'form'>>(null);

    const { execute, fieldErrors } = useAction(createTask, {
      onSuccess: (data) => {
        toast.success(`Tarefa "${data.title}" criada`);
        formRef.current?.reset();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener('keydown', onKeyDown);

    const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get('title') as string;
      const taskColumnId = formData.get('taskColumnId') as string;
      const projectId = params.projectId as string;

      execute({ title, taskColumnId, projectId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareakeyDown}
            ref={ref}
            placeholder="Insira um título para tarefa..."
            errors={fieldErrors}
          />
          <input
            hidden
            id="taskColumnId"
            name="taskColumnId"
            value={taskColumnId}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Adicionar</FormSubmit>

            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar tarefa
        </Button>
      </div>
    );
  }
);

TaskForm.displayName = 'TaskForm';
