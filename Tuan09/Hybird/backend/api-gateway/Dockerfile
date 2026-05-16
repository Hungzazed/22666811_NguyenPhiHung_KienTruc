FROM node:20-alpine
WORKDIR /app
COPY backend/api-gateway/package*.json ./backend/api-gateway/
WORKDIR /app/backend/api-gateway
RUN npm install
COPY backend/api-gateway/ .
EXPOSE 8080
CMD ["npm", "start"]
