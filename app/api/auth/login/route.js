import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const sessionId = authenticate(username, password);
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
