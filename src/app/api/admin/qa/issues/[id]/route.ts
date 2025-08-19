import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const params = await context.params;
    const issueId = parseInt(params.id);
    
    const issue = await prisma.qAIssue.update({
      where: { id: issueId },
      data: {
        status: body.status,
        updatedAt: new Date()
      }
    });
    
    // TODO: Trigger n8n webhook for status change
    await triggerStatusChangeNotification(issue, body.status);
    
    return NextResponse.json(issue);
  } catch (error) {
    console.error('Failed to update QA issue:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

async function triggerStatusChangeNotification(issue: any, newStatus: string) {
  try {
    // n8n webhook 호출 로직
    console.log('Triggering status change notification:', issue.issueNumber, newStatus);
  } catch (error) {
    console.error('Failed to trigger notification:', error);
  }
}
