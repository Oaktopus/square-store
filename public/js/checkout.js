const PATCH_PRICES = {
  Embroidered: 2990,
  'Laser Engraved': 2390,
  'UV Printed Leatherette': 2690,
};
const TEXT_PRICE = 800;

const fmt = (cents) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '{}'); // { id: {qty, options} }
let card; // Square card input instance

function itemPrice(p, options) {
  // Custom hats: fixed total based on the chosen patch
  if (options && options.patch) {
    let price = PATCH_PRICES[options.patch] || 0;
    if (options.text && options.text.trim()) price += TEXT_PRICE;
    return price;
  }
  return p.price;
}

async function renderSummary() {
  const res = await fetch('data/products.json');
  products = await res.json();

  const ids = Object.keys(cart).filter((id) => cart[id].qty > 0);
  const summary = document.getElementById('summary');

  if (ids.length === 0) {
    summary.innerHTML = '<p>Your cart is empty. <a href="/">Back to the shop</a>.</p>';
    document.getElementById('payBtn').disabled = true;
    return 0;
  }

  let total = 0;
  summary.innerHTML = ids
    .map((id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return '';
      const { qty, options } = cart[id];
      const price = itemPrice(p, options);
      total += price * qty;
      const optText = options
        ? [options.model, options.color, options.patch, options.text && `"${options.text}"`]
            .filter(Boolean)
            .join(' · ')
        : '';
      return `<div class="summary-row"><span>${p.name} × ${qty}${optText ? `<br><span class="opt">${optText}</span>` : ''}</span><span>${fmt(price * qty)}</span></div>`;
    })
    .join('') + `<div class="summary-row total"><span>Total</span><span>${fmt(total)}</span></div>`;

  return total;
}

async function initSquare() {
  const configRes = await fetch('/api/config');
  const config = await configRes.json();

  if (!config.applicationId || !config.locationId) {
    setStatus('err', 'Square is not configured yet. Set SQUARE_APPLICATION_ID and SQUARE_LOCATION_ID in the server .env file.');
    return;
  }

  const payments = window.Square.payments(config.applicationId, config.locationId);
  card = await payments.card();
  await card.attach('#card-container');

  const payBtn = document.getElementById('payBtn');
  payBtn.disabled = false;
  payBtn.textContent = 'Pay now';
}

function setStatus(type, msg) {
  const el = document.getElementById('statusMsg');
  el.className = `status-msg ${type}`;
  el.textContent = msg;
}

async function handlePay() {
  const payBtn = document.getElementById('payBtn');
  payBtn.disabled = true;
  payBtn.textContent = 'Processing…';
  setStatus('', '');

  try {
    const tokenResult = await card.tokenize();
    if (tokenResult.status !== 'OK') {
      throw new Error(tokenResult.errors?.[0]?.message || 'Could not read the card.');
    }

    const cartPayload = Object.keys(cart)
      .filter((id) => cart[id].qty > 0)
      .map((id) => ({ id, quantidade: cart[id].qty, options: cart[id].options || null }));

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: cartPayload,
        sourceId: tokenResult.token,
        buyerEmail: document.getElementById('email').value,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment failed.');

    setStatus('ok', `Payment approved! ID: ${data.paymentId}`);
    localStorage.removeItem('cart');
    document.getElementById('payBtn').style.display = 'none';
  } catch (err) {
    setStatus('err', err.message);
    payBtn.disabled = false;
    payBtn.textContent = 'Pay now';
  }
}

(async () => {
  const total = await renderSummary();
  if (total > 0) {
    await initSquare();
    document.getElementById('payBtn').addEventListener('click', handlePay);
  }
})();
