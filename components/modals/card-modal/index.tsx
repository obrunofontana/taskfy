'use client';

import { AuditLog } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCardModal } from '@/hooks/use-card-modal';
import { fetcher } from '@/lib/fetcher';
import { TaskWithTaskColumn } from '@/types';

import { Actions } from './actions';
import { Activity } from './activity';
import { Description } from './description';
import { Header } from './header';

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: taskData } = useQuery<TaskWithTaskColumn>({
    queryKey: ['task', id],
    queryFn: () => fetcher(`/api/tasks/${id}`),
  });

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ['task-logs', id],
    queryFn: () => fetcher(`/api/tasks/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!taskData ? <Header.Skeleton /> : <Header data={taskData} />}

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!taskData ? (
                <Description.Skeleton />
              ) : (
                <Description data={taskData} />
              )}

              {!auditLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogsData} />
              )}
            </div>
          </div>

          {!taskData ? <Actions.Skeleton /> : <Actions data={taskData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
