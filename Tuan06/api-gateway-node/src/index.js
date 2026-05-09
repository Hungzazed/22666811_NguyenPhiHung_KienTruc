require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

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

function createServiceProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => path,
    onProxyReq(proxyReq, req) {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  });
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

app.get("/health", (_req, res) => {
  return res.json({ status: "ok", service: "api-gateway" });
});

app.use("/register", createServiceProxy(process.env.USER_SERVICE_URL));
app.use("/login", createServiceProxy(process.env.USER_SERVICE_URL));
app.use("/users", createServiceProxy(process.env.USER_SERVICE_URL));
app.use("/foods", createServiceProxy(process.env.FOOD_SERVICE_URL));
app.use("/orders", createServiceProxy(process.env.ORDER_SERVICE_URL));
app.use("/payments", createServiceProxy(process.env.PAYMENT_SERVICE_URL));

const port = Number(process.env.PORT || 8080);
app.listen(port, "0.0.0.0", () => {
  console.log(`API Gateway running at http://0.0.0.0:${port}`);
});
