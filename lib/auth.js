import crypto from 'crypto';

// Simple session storage (in production use Redis or database)
const sessions = new Map();

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TechAndTheCity2024!Secure';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-session-secret-change-in-production';

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateSecureToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function createSession(username) {
  const sessionId = generateSessionId();
  const token = generateSecureToken();
  
  sessions.set(sessionId, {
    username,
    token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    ipAddress: null, // Will be set by the login route
    userAgent: null  // Will be set by the login route
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

export function authenticate(username, password, ipAddress = null, userAgent = null) {
  // Validate credentials
  if (username !== ADMIN_USERNAME) {
    return null;
  }
  
  const hashedPassword = hashPassword(password);
  const adminHashedPassword = hashPassword(ADMIN_PASSWORD);
  
  if (hashedPassword === adminHashedPassword) {
    const sessionId = createSession(username);
    const session = sessions.get(sessionId);
    
    // Add security info to session
    if (session) {
      session.ipAddress = ipAddress;
      session.userAgent = userAgent;
    }
    
    return sessionId;
  }
  
  return null;
}

export function requireAuth(request) {
  const sessionId = request.cookies.get('admin-session')?.value;
  if (!sessionId) return null;
  
  return validateSession(sessionId);
}
