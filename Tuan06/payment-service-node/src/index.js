require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const { bootstrapDatabase } = require("./config/bootstrap");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (
    !origin ||
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(origin)
  ) {
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
    return res.json({ status: "ok", service: "payment-service" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

app.use(paymentRoutes);

async function startServer() {
  try {
    await bootstrapDatabase();
    const port = Number(process.env.PORT || 8084);
    app.listen(port, "0.0.0.0", () => {
      console.log(`Payment Service running at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Failed to start Payment Service:", error.message);
    process.exit(1);
  }
}

startServer();
