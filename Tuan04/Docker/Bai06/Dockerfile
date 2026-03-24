# ===== Stage 1: Build =====
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Nếu có build (TypeScript, React, v.v.)
RUN npm run build


# ===== Stage 2: Run =====
FROM node:18-alpine

WORKDIR /app

# Copy từ stage build
COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm", "start"]