# Food Delivery System – Hybrid Microservices Architecture

Mini system giống GrabFood / ShopeeFood được thiết kế theo mô hình hybrid microservices:

- REST synchronous cho các request cần phản hồi ngay
- Event-driven asynchronous cho xử lý hậu trường
- API Gateway làm lớp truy cập duy nhất từ frontend
- RabbitMQ làm message broker cho các event giữa services
- MySQL tách theo từng service
- ReactJS frontend gọi qua Axios đến gateway

## 1. Kiến trúc tổng quan

Luồng đồng bộ:

1. Frontend gọi API Gateway.
2. Gateway chuyển tiếp request đến đúng service.
3. User Service xử lý đăng ký / đăng nhập.
4. Food Service trả danh sách món và chi tiết món.
5. Order Service tạo đơn và lưu database ngay lập tức.

Luồng bất đồng bộ:

1. Order Service lưu order.
2. Order Service publish event `ORDER_CREATED`.
3. Payment Service consume event và giả lập thanh toán thành công / thất bại.
4. Payment Service publish `PAYMENT_SUCCESS` hoặc `PAYMENT_FAILED`.
5. Notification Service consume event thanh toán và in thông báo ra console.

## 2. Folder structure

```text
HYBRID/
├─ backend/
│  ├─ api-gateway/
│  │  ├─ src/
│  │  └─ Dockerfile
│  ├─ user-service/
│  │  ├─ src/
│  │  └─ Dockerfile
│  ├─ food-service/
│  │  ├─ src/
│  │  └─ Dockerfile
│  ├─ order-service/
│  │  ├─ src/
│  │  └─ Dockerfile
│  ├─ payment-service/
│  │  ├─ src/
│  │  └─ Dockerfile
│  ├─ notification-service/
│  │  ├─ src/
│  │  └─ Dockerfile
│  └─ shared/
│     ├─ mysql.js
│     └─ rabbitmq.js
├─ frontend/
│  ├─ src/
│  ├─ Dockerfile
│  └─ vite.config.js
├─ docker-compose.yml
└─ README.md
```

## 3. Source code từng service

### API Gateway

- Port: `8080`
- Routes:
  - `GET/POST /api/users/**`
  - `GET/POST /api/foods/**`
  - `GET/POST /api/orders/**`
- Vai trò: route request từ frontend đến đúng backend service.

### User Service

- Port: `8081`
- APIs:
  - `POST /register`
  - `POST /login`
- Entity: `User(id, username, password)`

### Food Service

- Port: `8082`
- APIs:
  - `GET /foods`
  - `GET /foods/:id`
- Entity: `Food(id, name, price, description)`
- Có seed dữ liệu mẫu khi khởi động lần đầu.

### Order Service

- Port: `8083`
- APIs:
  - `POST /orders`
  - `GET /orders`
  - `GET /orders/:id`
- Entity: `Order(id, userId, foodId, quantity, totalPrice, status)`
- Khi tạo order:
  - lưu DB
  - publish event `ORDER_CREATED`

### Payment Service

- Port: `8084`
- Consume:
  - `ORDER_CREATED`
- Xử lý:
  - random success / fail
- Publish:
  - `PAYMENT_SUCCESS`
  - `PAYMENT_FAILED`

### Notification Service

- Port: `8085`
- Consume:
  - `PAYMENT_SUCCESS`
  - `PAYMENT_FAILED`
- Output console:
  - `Đơn hàng #123 đã thanh toán thành công!`
  - `Đơn hàng #123 thanh toán thất bại!`

## 4. RabbitMQ config

- Exchange: `food_delivery_events`
- Type: `direct`
- Event names:
  - `ORDER_CREATED`
  - `PAYMENT_SUCCESS`
  - `PAYMENT_FAILED`

Payload mẫu:

```json
{
  "eventType": "ORDER_CREATED",
  "payload": {
    "orderId": 1,
    "userId": 10,
    "totalPrice": 70000
  },
  "occurredAt": "2026-05-16T00:00:00.000Z"
}
```

## 5. API Gateway config

Gateway dùng `http-proxy-middleware` để forward:

- `/api/users/**` -> `USER_SERVICE_URL`
- `/api/foods/**` -> `FOOD_SERVICE_URL`
- `/api/orders/**` -> `ORDER_SERVICE_URL`

Ví dụ:

- `POST /api/users/register` -> `POST /register`
- `GET /api/foods/foods` -> `GET /foods`
- `POST /api/orders/orders` -> `POST /orders`

## 6. Frontend ReactJS

Frontend dùng:

- ReactJS
- React Router
- Axios

Trang chính:

- Login page
- Register page
- Food list page
- Order page

Frontend gọi API Gateway bằng `http://localhost:8080/api`.

## 7. Docker setup

Stack bao gồm:

- `mysql`
- `rabbitmq`
- `api-gateway`
- `user-service`
- `food-service`
- `order-service`
- `payment-service`
- `notification-service`
- `frontend`

RabbitMQ Management UI:

- `http://localhost:15672`
- username/password mặc định: `guest` / `guest`

## 8. Cách chạy project

### Cách 1: chạy bằng Docker Compose

```bash
docker compose up --build
```

### Cách 2: chạy từng service local

1. Chạy MySQL và RabbitMQ trước bằng Docker.
2. Mở từng folder service và cài dependencies:

```bash
cd backend/user-service
npm install
npm start
```

Làm tương tự cho các service còn lại và frontend.

## 9. Test API bằng Postman

### Register

`POST http://localhost:8080/api/users/register`

```json
{
  "username": "alice",
  "password": "123456"
}
```

### Login

`POST http://localhost:8080/api/users/login`

```json
{
  "username": "alice",
  "password": "123456"
}
```

### List foods

`GET http://localhost:8080/api/foods/foods`

### Food detail

`GET http://localhost:8080/api/foods/foods/1`

### Create order

`POST http://localhost:8080/api/orders/orders`

```json
{
  "userId": 1,
  "foodId": 1,
  "quantity": 2
}
```

### Get orders

`GET http://localhost:8080/api/orders/orders`

## Ghi chú kiến trúc

- REST được dùng cho luồng cần phản hồi ngay: đăng ký, đăng nhập, xem món, tạo order.
- Event-driven được dùng cho payment và notification vì đây là xử lý hậu trường, không nên chặn request tạo order.
- Mỗi service có database riêng theo đúng microservices architecture.
