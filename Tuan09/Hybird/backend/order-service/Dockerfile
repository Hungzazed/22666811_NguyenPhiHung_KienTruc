FROM node:20-alpine
WORKDIR /app
COPY backend/shared ./backend/shared
COPY backend/order-service/package*.json ./backend/order-service/
WORKDIR /app/backend/order-service
RUN npm install
COPY backend/order-service/ .
EXPOSE 8083
CMD ["npm", "start"]
