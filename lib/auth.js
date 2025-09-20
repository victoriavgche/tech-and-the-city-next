import crypto from 'crypto';

// Simple session storage (in production use Redis or database)
const sessions = new Map();

// Admin credentials (in production use environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'techandthecity2024';

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

export function createSession(username) {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    username,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
  return sessionId;
}

export function validateSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  if (new Date() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session;
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function authenticate(username, password) {
  const hashedPassword = hashPassword(password);
  const adminHashedPassword = hashPassword(ADMIN_PASSWORD);
  
  if (username === ADMIN_USERNAME && hashedPassword === adminHashedPassword) {
    return createSession(username);
  }
  
  return null;
}

export function requireAuth(request) {
  const sessionId = request.cookies.get('admin-session')?.value;
  if (!sessionId) return null;
  
  return validateSession(sessionId);
}
