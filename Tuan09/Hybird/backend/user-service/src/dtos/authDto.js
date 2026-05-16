function normalizeRegisterPayload(body = {}) {
  const username = String(body.username || '').trim();
  const password = String(body.password || '').trim();

  if (!username || !password) {
    throw new Error('username and password are required');
  }

  return { username, password };
}

function normalizeLoginPayload(body = {}) {
  const username = String(body.username || '').trim();
  const password = String(body.password || '').trim();

  if (!username || !password) {
    throw new Error('username and password are required');
  }

  return { username, password };
}

module.exports = {
  normalizeRegisterPayload,
  normalizeLoginPayload,
};
