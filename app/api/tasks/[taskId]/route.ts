import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const task = await db.task.findUnique({
      where: {
        id: params.taskId,
        taskColumn: {
          project: {
            orgId,
          },
        },
      },
      include: {
        taskColumn: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
