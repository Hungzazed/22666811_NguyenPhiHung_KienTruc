FROM node:20-alpine
WORKDIR /app
COPY backend/shared ./backend/shared
COPY backend/notification-service/package*.json ./backend/notification-service/
WORKDIR /app/backend/notification-service
RUN npm install
COPY backend/notification-service/ .
EXPOSE 8085
CMD ["npm", "start"]
