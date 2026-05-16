const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { normalizeRegisterPayload, normalizeLoginPayload } = require('../dtos/authDto');

async function register(body) {
  const payload = normalizeRegisterPayload(body);
  const existingUser = await userRepository.findByUsername(payload.username);

  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const createdUser = await userRepository.createUser({
    username: payload.username,
    password: hashedPassword,
  });

  return {
    id: createdUser.id,
    username: createdUser.username,
  };
}

async function login(body) {
  const payload = normalizeLoginPayload(body);
  const user = await userRepository.findByUsername(payload.username);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET || 'food-delivery-secret',
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
}

module.exports = {
  register,
  login,
};
