# Frontend React (Person 1)

UI gồm:

- Login/Register
- Danh sách món (GET /foods)
- Giỏ hàng
- Tạo order (POST /orders)

## Setup

```bash
npm install
copy .env.example .env
```

Cập nhật `.env` bằng IP LAN thật:

- `VITE_USER_SERVICE_URL=http://192.168.x.x:8081`
- `VITE_FOOD_SERVICE_URL=http://192.168.x.x:8082`
- `VITE_ORDER_SERVICE_URL=http://192.168.x.x:8083`
- `VITE_PAYMENT_SERVICE_URL=http://192.168.x.x:8084`

## Run

```bash
npm run dev
```

Frontend chạy ở `http://<IP_MAY_FRONTEND>:5173`.

## Notes

- Login/Register gọi User Service.
- Sau login frontend lưu JWT vào localStorage và tự gắn Bearer token.
- Cart lưu ở state frontend.
- Nút "Đặt hàng" gọi Order Service.
