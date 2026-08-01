import { products, itemPriceCents } from '../_lib/catalog';

const SQUARE_PRODUCTION = 'https://connect.squareup.com/v2/payments';
const SQUARE_SANDBOX = 'https://connect.squareupsandbox.com/v2/payments';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { cart, sourceId, buyerEmail } = body;

    if (!sourceId) return json({ error: 'Card token (sourceId) missing.' }, 400);
    if (!Array.isArray(cart) || cart.length === 0) {
      return json({ error: 'Your cart is empty.' }, 400);
    }

    // Recalculate the total ON THE SERVER from products.json — never trust a
    // total sent by the browser, it can be tampered with.
    let totalCents = 0;
    for (const item of cart) {
      const product = products.find((p) => p.id === item.id);
      if (!product) return json({ error: `Invalid product: ${item.id}` }, 400);
      const quantity = Math.max(1, parseInt(item.quantidade, 10) || 1);
      totalCents += itemPriceCents(product, item.options) * quantity;
    }

    if (totalCents <= 0) return json({ error: 'Invalid order total.' }, 400);

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

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
