# Kibonde Fuels — MERN Stack

 MongoDB, Express, React (Vite), Node.
UI is unchanged — same layout, colors, and pages, now backed by your own API.

```
kibonde-mern/
  backend/     Express + Mongoose API
  frontend/    Vite + React app
```

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # set MONGO_URI to your MongoDB instance
npm run dev
```

Runs on `http://localhost:5000`.

## 2. Admin account

There's no admin signup page (same as the original site) — create the account
yourself with the seed script:

```bash
node seedAdmin.js "Admin Name" "your-password"
```

Log in at `/admin-login` with that exact name and password. Run the script
again with a different name/password any time you need another admin.

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # points VITE_API_URL at the backend
npm run dev
```

Open `http://localhost:5173`.

## API summary

| Method | Endpoint                 | Purpose                           |
|--------|---------------------------|------------------------------------|
| POST   | /api/auth/signup          | Create a user account             |
| POST   | /api/auth/login           | User login                        |
| POST   | /api/admin/login          | Admin login                       |
| POST   | /api/orders               | Place an order                    |
| GET    | /api/orders/user/:userId  | A user's own orders               |
| GET    | /api/orders               | All orders (admin)                |
| PATCH  | /api/orders/:id/status    | Update an order's status (admin)  |
| GET    | /api/coupons/:code        | Look up a coupon's discount       |
| POST   | /api/coupons              | Generate a coupon (admin)         |
| GET    | /api/coupons/users/list   | List users for the coupon form    |
| POST   | /api/contact              | Submit a contact message          |
| GET    | /api/contact              | List contact messages (admin)     |

## Notes

- Passwords (user and admin) are hashed with bcrypt — not stored as plain text.
- Fixed two bugs from the original: a corrupted duplicate `<html>` block inside
  `login.html`'s `<style>` tag, and an order status mismatch (`'Pending'` vs
  `'pending'`) that broke the admin order filter.
- For production, set a real `CLIENT_ORIGIN` in the backend `.env`, and consider
  swapping the current localStorage-based login for real sessions/JWTs.
