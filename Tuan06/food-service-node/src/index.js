require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const { bootstrapDatabase } = require("./config/bootstrap");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.length === 0) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed: ${origin}`));
    },
  }),
);

app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok", service: "food-service" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

app.use(foodRoutes);

async function startServer() {
  try {
    await bootstrapDatabase();
    const port = Number(process.env.PORT || 8082);
    app.listen(port, "0.0.0.0", () => {
      console.log(`Food Service running at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Failed to start Food Service:", error.message);
    process.exit(1);
  }
}

startServer();
