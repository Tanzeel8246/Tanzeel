import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return a safe message to avoid user enumeration, while still friendly
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been generated.',
      });
    }

    // Generate crypto token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    // Upsert verification token
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token,
        },
      },
      update: {
        token,
        expires,
      },
      create: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    });

    const host = req.headers.get('host') || 'tanzeel.work';
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const resetUrl = `${protocol}://${host}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

    console.log(`[Password Reset] Generated reset link for ${normalizedEmail}: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetUrl,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process password reset request.' }, { status: 500 });
  }
}
