Bạn là Senior Software Architect + Fullstack Engineer.

Hãy tạo một dự án hoàn chỉnh tên:

"Food Delivery System – Hybrid Microservices Architecture"

Mục tiêu:
Xây dựng hệ thống mini giống GrabFood/ShopeeFood sử dụng:

* Microservices
* REST API
* Event-Driven Architecture
* API Gateway
* Async Messaging

Yêu cầu kiến trúc:

1. Các request cần phản hồi ngay:

* dùng REST synchronous
* Frontend → API Gateway → Service

2. Các xử lý hậu trường:

* dùng Event-Driven async
* Publish/Consume Event

==================================================
TECH STACK
==========

Backend:

* NodeJS
* ExpressJS
* MySQL
* Kafka hoặc RabbitMQ

Frontend:

* ReactJS
* Axios
* React Router

Container:

* Docker + Docker Compose

==================================================
MICROSERVICES
=============

1. API Gateway
   Port: 8080

Routes:

* /api/users/**
* /api/foods/**
* /api/orders/**

Forward request đến đúng service.

==================================================

2. User Service
   Port: 8081

Chức năng:

* Đăng ký
* Đăng nhập

REST APIs:
POST /register
POST /login

Entity:
User:

* id
* username
* password

==================================================

3. Food Service
   Port: 8082

Chức năng:

* Danh sách món ăn
* Chi tiết món

REST APIs:
GET /foods
GET /foods/{id}

Entity:
Food:

* id
* name
* price
* description

==================================================

4. Order Service (CORE)
   Port: 8083

Chức năng:

* Tạo order
* Xem order

REST APIs:
POST /orders
GET /orders
GET /orders/{id}

Entity:
Order:

* id
* userId
* foodId
* quantity
* totalPrice
* status

Khi tạo order:

1. Lưu database
2. Publish event:
   ORDER_CREATED

Không xử lý payment trực tiếp.

==================================================

5. Payment Service
   Port: 8084

Consume:

* ORDER_CREATED

Xử lý:

* Random payment success/fail

Nếu thành công:
Publish:
PAYMENT_SUCCESS

Nếu thất bại:
Publish:
PAYMENT_FAILED

==================================================

6. Notification Service
   Port: 8085

Consume:

* PAYMENT_SUCCESS
* PAYMENT_FAILED

Console output:

* "Đơn hàng #123 đã thanh toán thành công!"
* "Đơn hàng #123 thanh toán thất bại!"

==================================================
EVENT DESIGN
============

Events:

1. ORDER_CREATED
   {
   orderId,
   userId,
   totalPrice
   }

2. PAYMENT_SUCCESS
   {
   orderId,
   message
   }

3. PAYMENT_FAILED
   {
   orderId,
   reason
   }

==================================================
SYSTEM FLOW
===========

1. User → Frontend
2. Frontend → API Gateway
3. Gateway → Order Service
4. Order Service:

   * save DB
   * publish ORDER_CREATED
5. Payment Service:

   * consume ORDER_CREATED
   * process payment
   * publish PAYMENT_SUCCESS or PAYMENT_FAILED
6. Notification Service:

   * consume payment events
   * print notification

==================================================
YÊU CẦU CODE
============

1. Generate:

* Full source code
* Folder structure
* Entity
* Controller
* Service
* Repository
* DTO
* Kafka/RabbitMQ configuration
* API Gateway config
* application.yml

2. Giải thích:

* Kiến trúc hệ thống
* Vì sao dùng REST
* Vì sao dùng Event-Driven
* Event flow

3. Generate:

* Dockerfile cho từng service
* docker-compose.yml

4. Generate:

* README.md đầy đủ:

  * Cách chạy project
  * Cách start Kafka/RabbitMQ
  * Cách test API bằng Postman

5. Frontend ReactJS:

* Login/Register page
* Food list page
* Order page
* Call API Gateway bằng Axios

6. Database:

* Mỗi service có database riêng
* Theo đúng microservices architecture

==================================================
OUTPUT FORMAT
=============

Hãy trả lời theo thứ tự:

1. Kiến trúc tổng quan
2. Folder structure
3. Source code từng service
4. Kafka/RabbitMQ config
5. API Gateway config
6. Frontend ReactJS
7. Docker setup
8. README
9. Hướng dẫn chạy

Code phải clean architecture, dễ hiểu, chạy được thực tế.
