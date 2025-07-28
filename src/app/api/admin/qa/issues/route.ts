import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const issues = await prisma.qAIssue.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Failed to fetch QA issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate issue number
    const count = await prisma.qAIssue.count();
    const issueNumber = `QA-${String(count + 1).padStart(3, '0')}`;
    
    const issue = await prisma.qAIssue.create({
      data: {
        issueNumber,
        url: body.url,
        page: body.page,
        location: body.location,
        category: body.category,
        description: body.description,
        priority: body.priority,
        assignee: body.assignee,
        createdBy: body.createdBy,
        screenshotUrl: body.screenshotUrl
      }
    });
    
    // TODO: Trigger n8n webhook for notification
    await triggerNewIssueNotification(issue);
    
    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    console.error('Failed to create QA issue:', error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}

async function triggerNewIssueNotification(issue: any) {
  try {
    // n8n webhook 호출 로직
    console.log('Triggering notification for issue:', issue.issueNumber);
  } catch (error) {
    console.error('Failed to trigger notification:', error);
  }
}