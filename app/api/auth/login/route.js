import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Get client info for security
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const sessionId = authenticate(username, password, ipAddress, userAgent);
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const response = NextResponse.json({ 
      success: true,
      message: 'Login successful'
    });
    
    response.cookies.set('admin-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
