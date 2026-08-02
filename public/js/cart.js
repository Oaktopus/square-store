// Shared cart logic for all pages
(function () {
  const STORAGE_KEY = 'cart';
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); // { id: {qty, options} }
  let products = [];

  // Custom hats: the total is FIXED by the chosen patch (mirrored on server.js)
  const PATCH_PRICES = {
    Embroidered: 2990,
    'Laser Engraved': 2390,
    'UV Printed Leatherette': 2690,
  };
  const TEXT_PRICE = 800;

  const fmt = (cents) =>
    (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    renderCart();
  }

  // Flat $5.50 US shipping; FREE when the order has 3+ hats.
  function hatCount(cartItems) {
    return Object.keys(cartItems).reduce((sum, id) => {
      if (id.startsWith('hat-')) return sum + cartItems[id].qty;
      return sum;
    }, 0);
  }
  function calcShippingCents(cartItems) {
    return hatCount(cartItems) >= 3 ? 0 : 550;
  }

  function itemPrice(p, options) {
    // Custom hats: fixed total based on the chosen patch
    if (options && options.patch) {
      let price = PATCH_PRICES[options.patch] || 0;
      if (options.text && options.text.trim()) price += TEXT_PRICE;
      return price;
    }
    return p.price;
  }

  async function loadProducts() {
    const res = await fetch('data/products.json');
    products = await res.json();
    renderCart();
  }

  function getItem(id) {
    return products.find((p) => p.id === id);
  }

  function addItem(id, qty, options) {
    if (!cart[id]) cart[id] = { qty: 0, options: options || null };
    cart[id].qty += qty;
    if (options) cart[id].options = options;
    saveCart();
    const p = getItem(id);
    const label = p ? p.name : id;
    showToast(`${label} added to cart!`);
  }

  function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) return;
    document.getElementById('toast-msg').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function renderCart() {
    const ids = Object.keys(cart).filter((id) => cart[id].qty > 0);
    const count = ids.reduce((sum, id) => sum + cart[id].qty, 0);

    document.querySelectorAll('.cart-count').forEach((el) => (el.textContent = count));

    const container = document.getElementById('drawerItems');
    if (!container) return;
    const checkoutBtn = document.getElementById('goCheckout');

    if (ids.length === 0) {
      container.innerHTML = '<div class="drawer-empty">Your cart is empty.</div>';
      document.getElementById('drawerTotal').textContent = fmt(0);
      const shipEl = document.getElementById('drawerShip');
      if (shipEl) shipEl.textContent = fmt(0);
      const hintEl = document.getElementById('shipHint');
      if (hintEl) hintEl.textContent = '';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    let total = 0;
    container.innerHTML = ids
      .map((id) => {
        const p = getItem(id);
        if (!p) return '';
        const { qty, options } = cart[id];
        const price = itemPrice(p, options);
        total += price * qty;
        const optLines = options
          ? [options.model, options.color, options.patch, options.text && `"${options.text}"`]
              .filter(Boolean)
              .join(' · ')
          : '';
        return `
        <div class="drawer-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="info">
            <div class="name">${p.name}</div>
            ${optLines ? `<div class="meta">${optLines}</div>` : ''}
            <div class="meta">
              <button class="qty-btn" data-id="${id}" data-op="-">−</button>
              ${qty}
              <button class="qty-btn" data-id="${id}" data-op="+">+</button>
              <span style="margin-left:6px;">${fmt(price * qty)}</span>
            </div>
            <button class="remove" data-id="${id}">Remove</button>
          </div>
        </div>`;
      })
      .join('');

    const shipping = calcShippingCents(cart);
    document.getElementById('drawerTotal').textContent = fmt(total + shipping);
    const shipEl = document.getElementById('drawerShip');
    if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : fmt(shipping);
    const hintEl = document.getElementById('shipHint');
    if (hintEl) {
      const hats = hatCount(cart);
      hintEl.textContent =
        hats > 0 && hats < 3 ? `Add ${3 - hats} more hat${3 - hats > 1 ? 's' : ''} for free shipping!` : '';
    }
    if (checkoutBtn) checkoutBtn.disabled = false;

    container.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        cart[id].qty += btn.dataset.op === '+' ? 1 : -1;
        if (cart[id].qty <= 0) delete cart[id];
        saveCart();
      });
    });
    container.querySelectorAll('.remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        delete cart[btn.dataset.id];
        saveCart();
      });
    });
  }

  // Inject drawer markup into every page
  function ensureDrawer() {
    if (document.getElementById('drawer')) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="toast" id="toast"><span class="toast-icon">✓</span><span id="toast-msg"></span></div>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer">
        <div class="drawer-head">
          <h2>Your Cart</h2>
          <button class="close-btn" id="closeCart">&times;</button>
        </div>
        <div class="drawer-items" id="drawerItems"></div>
        <div class="drawer-foot">
          <div class="drawer-ship"><span>Shipping</span><span id="drawerShip">$0.00</span></div>
          <div class="ship-hint" id="shipHint"></div>
          <div class="drawer-total"><span>Total</span><span id="drawerTotal">$0.00</span></div>
          <button class="checkout-btn" id="goCheckout" disabled>Checkout</button>
        </div>
      </aside>`;
    document.body.appendChild(div.firstElementChild);
    document.body.appendChild(div.lastElementChild);
    while (div.firstChild) div.removeChild(div.firstChild);
  }

  function bindUI() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('openCart');
    const closeBtn = document.getElementById('closeCart');

    if (openBtn) openBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      overlay.classList.add('open');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    });
    if (overlay) overlay.addEventListener('click', () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    });

    const goCheckout = document.getElementById('goCheckout');
    if (goCheckout) goCheckout.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }

  window.OakCart = {
    addItem,
    getCart: () => cart,
    itemPrice,
    getItem,
    fmt,
    calcShippingCents,
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureDrawer();
    bindUI();
    loadProducts();
  });
})();
