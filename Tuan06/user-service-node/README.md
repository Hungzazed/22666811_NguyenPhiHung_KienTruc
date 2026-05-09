# User Service (Person 2)

Node.js + Express + MariaDB service for:

- POST /register
- POST /login
- GET /users (ADMIN only)

## 1) Setup

```bash
npm install
copy .env.example .env
```

Update `.env`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `CORS_ORIGIN` (LAN IP frontend, example: `http://192.168.1.10:5173`)

## 2) Init database

Run SQL in `database/init.sql` on MariaDB, or just start the service and it will auto-create the `users` table on startup.

## 3) Run service

```bash
npm run dev
```

Service listens on `0.0.0.0:8081` by default.

## Sample requests

### Register

```http
POST /register
Content-Type: application/json

{
  "name": "User A",
  "email": "usera@company.local",
  "password": "123456"
}
```

Note: For demo `GET /users`, you can register an admin by sending `"role": "ADMIN"` in register payload.

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "usera@company.local",
  "password": "123456"
}
```

### Get users (ADMIN)

```http
GET /users
Authorization: Bearer <jwt_token>
```
