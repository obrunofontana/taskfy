import { auth } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';

import { db } from '@/lib/db';

import { ProjectNavbar } from './_components/project';

export async function generateMetadata({
  params,
}: {
  params: { projectId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return {
      title: 'Projeto',
    };
  }

  const project = await db.project.findUnique({
    where: {
      id: params.projectId,
      orgId,
    },
  });

  return {
    title: project?.title || 'Projeto',
  };
}

const ProjectIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect('/select-org');
  }

  const project = await db.project.findUnique({
    where: {
      id: params.projectId,
      orgId,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${project.imageFullUrl})` }}
    >
      <ProjectNavbar data={project} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default ProjectIdLayout;
