# Food Service (Person 3)

Node.js + Express + MariaDB service for:

- GET /foods
- POST /foods
- PUT /foods/:id
- DELETE /foods/:id

## 1) Setup

1. Install dependencies

npm install

2. Create env file

copy .env.example .env

Update .env:

- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- CORS_ORIGIN = frontend LAN URL, example http://192.168.1.10:5173

## 2) Init database

Run SQL file: database/init.sql

Note: Service also auto-create table and auto-seed default foods when table is empty.

## 3) Run service

npm run dev

Default port: 8082, bind address: 0.0.0.0

## 4) Test API quickly

1. Get foods
   GET http://<IP_MAY_FOOD_SERVICE>:8082/foods

2. Create food
   POST http://<IP_MAY_FOOD_SERVICE>:8082/foods
   Content-Type: application/json

{
"name": "Tra dao cam sa",
"description": "Tra mat lanh",
"price": 30000
}

3. Update food
   PUT http://<IP_MAY_FOOD_SERVICE>:8082/foods/1
   Content-Type: application/json

{
"price": 47000
}

4. Delete food
   DELETE http://<IP_MAY_FOOD_SERVICE>:8082/foods/1

## Service-based architecture demonstration

- User Service runs on port 8081
- Food Service runs on port 8082
- Frontend calls both services directly by LAN IP
- Each service has its own codebase and startup process
