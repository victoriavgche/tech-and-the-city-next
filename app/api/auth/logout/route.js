import { NextResponse } from 'next/server';
import { deleteSession } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value;
    
    if (sessionId) {
      deleteSession(sessionId);
    }
    
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin-session');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
