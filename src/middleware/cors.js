import cors from 'cors';

export default function buildCors() {
  // DIRECT ORIGINS — no .env
  const allowList = [
    'https://npl-client-final.vercel.app',
    'https://npl-jet.vercel.app',
    'http://localhost:5173'
  ];

  const origin = (requestOrigin, callback) => {
    if (!requestOrigin) return callback(null, true); // Postman, curl
    const ok = allowList.includes(requestOrigin);
    callback(null, ok);
  };

  return cors({
    origin,
    credentials: true
  });
}
