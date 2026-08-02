import products from '../public/data/products.json';

const PATCH_PRICES = {
  Embroidered: 2990,
  'Laser Engraved': 2390,
  'UV Printed Leatherette': 2690,
};
const TEXT_PRICE = 800;
const SQUARE_PRODUCTION = 'https://connect.squareup.com/v2/payments';
const SQUARE_SANDBOX = 'https://connect.squareupsandbox.com/v2/payments';

function itemPriceCents(product, options) {
  if (options && options.patch) {
    let price = PATCH_PRICES[options.patch] || 0;
    if (options.text && options.text.trim()) price += TEXT_PRICE;
    return price;
  }
  return product.price;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleApi(request, env) {
  const url = new URL(request.url);

  if (url.pathname === '/api/config' && request.method === 'GET') {
    return json({
      applicationId: env.SQUARE_APPLICATION_ID,
      locationId: env.SQUARE_LOCATION_ID,
      environment: env.SQUARE_ENVIRONMENT || 'sandbox',
    });
  }

  if (url.pathname === '/api/products' && request.method === 'GET') {
    return json(products);
  }

  if (url.pathname === '/api/checkout' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { cart, sourceId, buyerEmail } = body;

      if (!sourceId) return json({ error: 'Card token (sourceId) missing.' }, 400);
      if (!Array.isArray(cart) || cart.length === 0) {
        return json({ error: 'Your cart is empty.' }, 400);
      }

      // Recalculate the total ON THE SERVER — never trust a browser-sent total.
      let totalCents = 0;
      for (const item of cart) {
        const product = products.find((p) => p.id === item.id);
        if (!product) return json({ error: `Invalid product: ${item.id}` }, 400);
        const quantity = Math.max(1, parseInt(item.quantidade, 10) || 1);
        totalCents += itemPriceCents(product, item.options) * quantity;
      }
      if (totalCents <= 0) return json({ error: 'Invalid order total.' }, 400);

      // Flat $5.50 US shipping; FREE when the order has 3+ hats.
      let hats = 0;
      for (const item of cart) {
        if (item.id && item.id.startsWith('hat-')) {
          hats += Math.max(1, parseInt(item.quantidade, 10) || 1);
        }
      }
      totalCents += hats >= 3 ? 0 : 550;

      const url =
        env.SQUARE_ENVIRONMENT === 'production' ? SQUARE_PRODUCTION : SQUARE_SANDBOX;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
          'Square-Version': '2025-01-23',
        },
        body: JSON.stringify({
          source_id: sourceId,
          idempotency_key: crypto.randomUUID(),
          amount_money: { amount: totalCents, currency: 'USD' },
          location_id: env.SQUARE_LOCATION_ID,
          buyer_email_address: buyerEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return json(
          { error: data?.errors?.[0]?.detail || 'Error processing payment.' },
          res.status
        );
      }
      return json({
        success: true,
        paymentId: data.payment.id,
        status: data.payment.status,
        receiptUrl: data.payment.receipt_url,
      });
    } catch (err) {
      return json({ error: err?.message || 'Error processing payment.' }, 500);
    }
  }

  return new Response('Not found', { status: 404 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
