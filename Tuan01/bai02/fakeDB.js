const users = [
  {
    id: 1,
    username: "admin",
    password: "123",
    role: "admin"
  },
  {
    id: 2,
    username: "guest",
    password: "123",
    role: "guest"
  }
];

const refreshTokens = [];

module.exports = { users, refreshTokens };