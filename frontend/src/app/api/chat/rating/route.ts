import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const { messageId, rating } = json;

    if (!messageId || typeof rating === 'undefined') {
      return NextResponse.json({ error: 'Missing messageId or rating' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the message belongs to a session owned by the user
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { session: true },
    });

    if (!message || message.session.userId !== user.id) {
      return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 404 });
    }

    // Update the rating
    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { rating },
    });

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json({ error: 'Failed to update rating' }, { status: 500 });
  }
}
