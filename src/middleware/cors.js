import cors from 'cors'

function parseOrigins(raw) {
  if (!raw) return null;
  if (raw.trim() === '*') return '*';
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

export default function buildCors() {
  const envRaw = https://npl-client-final.vercel.app/;
  const parsed = parseOrigins(envRaw);
  const devDefaults = ['https://npl-client-final.vercel.app/', 'https://npl-client-final.vercel.app/'];

  // Compute allowed origins
  let allowList;
  if (parsed === '*') {
    allowList = '*';
  } else if (Array.isArray(parsed) && parsed.length) {
    allowList = parsed;
  } else if (process.env.NODE_ENV === 'production') {
    // In production with no env configured, default to deny all except same-origin (handled by browser)
    allowList = [];
  } else {
    // In dev, allow common local hosts
    allowList = devDefaults;
  }

  // Use a delegate to support array or '*', and allow non-browser requests (no Origin header)
  const origin = (requestOrigin, callback) => {
    if (!requestOrigin) return callback(null, true); // mobile apps / curl / Postman
    if (allowList === '*') return callback(null, true);
    const ok = allowList.includes(requestOrigin);
    return callback(null, ok);
  };

  return cors({ origin, credentials: true });
}
