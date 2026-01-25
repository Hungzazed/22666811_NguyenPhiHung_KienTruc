const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const { users, refreshTokens } = require("./fakeDB");
const {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_SECRET
} = require("./auth");

const { authenticateToken, authorizeRole } = require("./middleware");

const app = express();
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.sendStatus(401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

app.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const dbUser = users.find(u => u.id === user.id);
    const newAccessToken = generateAccessToken(dbUser);

    res.json({ accessToken: newAccessToken });
  });
});

app.get("/profile",
  authenticateToken,
  (req, res) => {
    res.json({
      message: "Xem profile thành công",
      user: req.user
    });
  }
);

app.get("/admin",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "Chào ADMIN" });
  }
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

