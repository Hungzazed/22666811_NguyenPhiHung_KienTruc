FROM node:20-alpine
WORKDIR /app
COPY backend/shared ./backend/shared
COPY backend/food-service/package*.json ./backend/food-service/
WORKDIR /app/backend/food-service
RUN npm install
COPY backend/food-service/ .
EXPOSE 8082
CMD ["npm", "start"]
