FROM node:20-alpine
WORKDIR /app
COPY backend/shared ./backend/shared
COPY backend/payment-service/package*.json ./backend/payment-service/
WORKDIR /app/backend/payment-service
RUN npm install
COPY backend/payment-service/ .
EXPOSE 8084
CMD ["npm", "start"]
