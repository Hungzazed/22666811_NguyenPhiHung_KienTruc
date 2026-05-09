# Order Service (Person 4)

## APIs

- POST /orders
- GET /orders
- GET /orders/:id
- PUT /orders/:id/status

## Run

```bash
npm install
npm run dev
```

Notes:

- Calls User Service to validate user via `GET /users/:id/validate`
- Calls Food Service via `GET /foods`
