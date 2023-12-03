'use client';

import { Copy, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { copyTask } from '@/actions/copy-task';
import { deleteTask } from '@/actions/delete-task';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAction } from '@/hooks/use-action';
import { useCardModal } from '@/hooks/use-card-modal';
import { TaskWithTaskColumn } from '@/types';

interface ActionsProps {
  data: TaskWithTaskColumn;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopyTask, isLoading: isLoadingCopy } = useAction(
    copyTask,
    {
      onSuccess: (data) => {
        toast.success(`Tarefa "${data.title}" copiada`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteTask, isLoading: isLoadingDelete } = useAction(
    deleteTask,
    {
      onSuccess: (data) => {
        toast.success(`Tarefa "${data.title}" removida`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const projectId = params.projectId as string;

    executeCopyTask({
      id: data.id,
      projectId,
    });
  };

  const onDelete = () => {
    const projectId = params.projectId as string;

    executeDeleteTask({
      id: data.id,
      projectId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Ações</p>

      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copiar
      </Button>

      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" />
        Remover
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
