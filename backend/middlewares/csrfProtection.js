const crypto = require('crypto');
const { parseCookies } = require('../utils/sessionCookie');

// Double-submit CSRF protection for cookie-authenticated state-changing calls.
// Legacy Bearer calls are intentionally left compatible during migration.
module.exports = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  // These endpoints establish or recover authentication. They must remain
  // reachable even when a browser has an expired/stale session cookie; the
  // successful response will replace that session and issue a fresh CSRF
  // cookie where appropriate.
  const publicAuthPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/verify-otp',
  ];
  if (publicAuthPaths.includes(req.path)) return next();

  const cookies = parseCookies(req.headers.cookie);
  if (!cookies.sfs_session) return next(); // Public endpoints (login/register etc.)
  // Bearer-authenticated clients already prove possession of the JWT and were
  // supported before cookie sessions were introduced. Keep those requests
  // compatible even when an older session cookie is still present.
  const authorization = req.headers.authorization || '';
  if (authorization.startsWith('Bearer ')) return next();
  const supplied = req.headers['x-csrf-token'];
  const suppliedBuffer = Buffer.from(typeof supplied === 'string' ? supplied : '');
  const cookieBuffer = Buffer.from(cookies.sfs_csrf || '');
  if (!supplied || !cookies.sfs_csrf || suppliedBuffer.length !== cookieBuffer.length
      || !crypto.timingSafeEqual(suppliedBuffer, cookieBuffer)) {
    return res.status(403).json({ message: 'Invalid or missing CSRF token.' });
  }
  next();
};
