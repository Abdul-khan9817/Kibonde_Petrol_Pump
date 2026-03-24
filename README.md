# Kibonde Petrol Pump (Kibonde Fuels)

A simple front-end web app for a petrol pump / fuel ordering system. Users can sign up, log in, place petrol/diesel orders (pickup or delivery), apply coupons, and track order status. Admins can manage orders, generate discount coupons, and view contact messages.

## Demo / Pages
This project is a static site (HTML + CSS + JavaScript) with Supabase used as the backend database via the Supabase JS client loaded from a CDN.

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
- Supabase (via `@supabase/supabase-js` CDN import)
- Font Awesome (icons)

## Setup
### 1) Clone
```bash
git clone https://github.com/Abdul-khan9817/Kibonde-Petrol-Pump.git
cd Kibonde-Petrol-Pump
```

### 2) Create a Supabase project
1. Create a project in Supabase.
2. Get your **Project URL** and **Anon public key**.

### 3) Configure Supabase keys in the HTML files
This repo currently contains Supabase keys directly inside some pages (e.g. `login.html`, `buynow.html`, `vieworders.html`, etc.). For better security and easier setup, you should replace the placeholders/keys with your own project values.

Search for these constants in the HTML files and update them:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Note: In `mainpage.html` the key is set to `YOUR_SUPABASE_ANON_KEY` and must be replaced.

### 4) Create required Supabase tables
From the code, the following tables are used:

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
Used by: `feedback.html` (and likely `contact.html`)
- `name` (text)
- `email` (text)
- `message` (text)
- `created_at` (timestamp)

> You may need to adjust column types/names to match your Supabase schema.

### 5) Run locally
Because this is a static site, you can run it with any local web server. For example:

#### Using VS Code Live Server
- Install the **Live Server** extension
- Right-click `index.html` → **Open with Live Server**

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
- Do **not** commit private keys. Supabase anon keys are public, but you should still enable Row Level Security (RLS) and policies in Supabase.
- Passwords are stored/queried as plain text in the current code. For a real project, use Supabase Auth or hash passwords.

## License
No license specified yet.