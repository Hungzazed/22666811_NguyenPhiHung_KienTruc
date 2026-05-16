const authService = require('../services/authService');

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'Register successful', data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ message: 'Login successful', data: result });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
};
