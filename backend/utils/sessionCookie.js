const isProduction = process.env.NODE_ENV === 'production';

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return cookies;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function getSessionToken(req) {
  return parseCookies(req.headers.cookie).sfs_session;
}

function setSessionCookie(res, token) {
  res.cookie('sfs_session', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie('sfs_session', { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' });
}

module.exports = { parseCookies, getSessionToken, setSessionCookie, clearSessionCookie };
