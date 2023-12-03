import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

import { TaskColumnContainer } from './_components/taskColumn';

interface ProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect('/select-org');
  }

  const taskColumns = await db.taskColumn.findMany({
    where: {
      projectId: params.projectId,
      project: {
        orgId,
      },
    },
    include: {
      tasks: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <TaskColumnContainer projectId={params.projectId} data={taskColumns} />
    </div>
  );
};

export default ProjectIdPage;
