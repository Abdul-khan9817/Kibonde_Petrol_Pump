# Kibonde Petrol Pump (Kibonde Fuels)

A fuel ordering system with an Express + MongoDB backend and an HTML/CSS/JavaScript frontend. Users can sign up, log in, place petrol/diesel orders (pickup or delivery), apply coupons, and track order status. Admins can manage orders, generate discount coupons, and view contact messages.

## Demo / Pages
This project uses a small API backend built with Node.js, Express, and MongoDB. The frontend is still plain HTML/CSS/JavaScript and talks to the backend through `frontend-api.js`.

Main pages:
- `index.html` — Landing page
- `login.html` — User sign in / sign up
- `mainpage.html` — User dashboard
- `buynow.html` — Place an order
- `vieworders.html` — View user orders

Admin pages:
- `admin-login.html` — Admin login
- `admin_dashboard.html` — Admin dashboard
- `admin_manage_orders.html` — Update order statuses
- `admin_generate_coupon.html` — Generate coupons
- `feedback.html` — View contact messages

## Tech Stack
- HTML / CSS / JavaScript
- Node.js / Express
- MongoDB / Mongoose
- Shared browser API wrapper (`frontend-api.js`)
- Font Awesome (icons)

## Setup
### 1) Clone
```bash
git clone https://github.com/Abdul-khan9817/Kibonde-Petrol-Pump.git
cd Kibonde-Petrol-Pump
```

### 2) Configure MongoDB
1. Install and run MongoDB locally, or use a hosted MongoDB connection string.
2. Set `MONGO_URI` in [backend/.env](backend/.env).

### 3) Create required MongoDB collections
From the backend code, the following collections are used:

#### `users`
Used by: `login.html`, `admin_generate_coupon.html`
- `user_id` (integer / primary key)
- `name` (text)
- `email` (text)
- `password` (text)
- `mobile_number` (text)

#### `admins`
Used by: `admin-login.html`
- `name` (text)
- `password` (text)

#### `orders`
Used by: `buynow.html`, `vieworders.html`, `admin_manage_orders.html`
- `order_id` (integer / primary key)
- `user_id` (integer)
- `fuel_type` (text)
- `number_of_litres` (numeric)
- `delivery_location` (text, nullable)
- `mode_of_payment` (text)
- `price` (numeric/text)
- `order_number` (text)
- `status` (text)
- `created_at` (timestamp, for sorting)

#### `coupons`
Used by: `buynow.html`, `admin_generate_coupon.html`
- `code` (text / unique)
- `discount_percent` (numeric/text)
- `user_id` (integer)

#### `contact_messages`
Used by: `feedback.html` and `contact.html`
- `name` (text)
- `email` (text)
- `message` (text)
- `created_at` (timestamp)

> You may need to adjust field types/names to match your MongoDB schema.

### 4) Run locally
Because the frontend is static, you can run it with any local web server and start the backend separately.

#### Using VS Code Live Server
- Install the **Live Server** extension
- Right-click `index.html` → **Open with Live Server**

#### Start the backend
```bash
cd backend
npm install
npm start
```

#### Using Python
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

## Screenshots
Some screenshots are available in `screenshots/`, for example:
- `screenshots/login page.png`
- `screenshots/customer dash page.png`
- `screenshots/buy fuel page.png`
- `screenshots/admin dash.png`
- `screenshots/admin manage orders.png`

## Notes / Security
- Do **not** commit real MongoDB credentials.
- Passwords are stored/queried as plain text in the current code. For a real project, use hashed passwords and authentication tokens.

## License
No license specified yet.
