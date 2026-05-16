FROM node:20-alpine
WORKDIR /app
COPY backend/shared ./backend/shared
COPY backend/user-service/package*.json ./backend/user-service/
WORKDIR /app/backend/user-service
RUN npm install
COPY backend/user-service/ .
EXPOSE 8081
CMD ["npm", "start"]
