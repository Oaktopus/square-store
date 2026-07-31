# OAKTOPUS — Store with Square checkout

Product catalog with cart and credit card payment via **Square**.
Backend in Node.js/Express (required: the Square secret key must never live in the browser).

## 1. Create your Square Developer account (free)

1. Go to **https://developer.squareup.com/** and create an account (you can use your normal Square account).
2. Click **"+ Create your first application"** and give it a name (e.g. "Oaktopus Store").
3. Inside the app you'll see two tabs: **Sandbox** and **Production**. Start with **Sandbox** — a test environment with fake cards, no real charges.
4. In the **Sandbox** tab, copy:
   - **Sandbox Access Token**
   - **Sandbox Application ID**
5. Go to **Locations** (or use the "Default Test Account" already created) and copy the **Location ID**.

## 2. Set up the project

```bash
cd square-store
npm install
cp .env.example .env
```

Open `.env` and paste the values from step 1:

```
SQUARE_ENVIRONMENT=sandbox
SQUARE_ACCESS_TOKEN=EAAAE...
SQUARE_APPLICATION_ID=sandbox-sq0idb-...
SQUARE_LOCATION_ID=L1234ABCD
PORT=3000
```

## 3. Run locally

```bash
npm start
```

Open **http://localhost:3000** — the catalog loads, add products to the cart and click "Checkout".

### Test card (sandbox)

Use this Square-provided fake card in checkout to simulate an approved purchase:

- Number: `4111 1111 1111 1111`
- Expiry: any future date (e.g. `12/28`)
- CVV: any 3 digits (e.g. `111`)
- ZIP: any (e.g. `12345`)

## 4. Edit products

Edit `public/data/products.json`. Each product looks like:

```json
{
  "id": "hat-trucker",
  "name": "Product name",
  "category": "Category",
  "price": 3499,
  "description": "Short text.",
  "image": "img/6.png"
}
```

> Prices are always in **cents** (USD) because that is how the Square API expects the amount.

## 5. Go to production (charge for real)

1. In the Square Developer Dashboard, complete account activation (bank details, EIN/SSN etc. — Square requires this to deposit your sales).
2. Copy the **Production** credentials (Access Token, Application ID, Location ID).
3. In `.env`, change:
   ```
   SQUARE_ENVIRONMENT=production
   ```
   and replace the 3 values with the production ones.
4. In `public/checkout.html`, change the SDK script from:
   ```html
   <script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
   ```
   to:
   ```html
   <script src="https://web.squarecdn.com/v1/square.js"></script>
   ```
5. Publish the project on an HTTPS server (Render, Railway, Fly.io, a VPS, etc. — Square requires HTTPS in production). Render's free plan works well to start.

## Project structure

```
square-store/
├── server.js              # Express backend + Square integration
├── package.json
├── .env.example
└── public/
    ├── index.html         # Catalog / shop
    ├── checkout.html      # Payment page
    ├── css/style.css
    ├── js/catalog.js      # Cart logic
    ├── js/checkout.js     # Card tokenization + backend call
    ├── img/               # Product & site images
    └── data/products.json # Your products (edit here)
```

## How payment works (technical summary)

1. In the browser, the **Square Web Payments SDK** turns the card data into a token (`sourceId`) — the card number never touches your server.
2. The frontend sends that token + the cart to `POST /api/checkout`.
3. The server **recalculates the total by itself** from `products.json` (never trusts the browser total) and calls `squareClient.payments.create(...)` to charge.
4. Square responds with the payment status, shown to the customer.
