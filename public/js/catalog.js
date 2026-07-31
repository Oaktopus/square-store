const state = {
  products: [],
  category: 'All',
};

function readCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  return cat ? decodeURIComponent(cat) : 'All';
}

async function loadProducts() {
  const res = await fetch('data/products.json');
  state.products = await res.json();
  state.category = readCategoryFromUrl();
  renderFilters();
  renderGrid();
}

function renderFilters() {
  const cats = ['All', ...new Set(state.products.map((p) => p.category))];
  const el = document.getElementById('filters');
  if (!el) return;
  el.innerHTML = cats
    .map(
      (c) =>
        `<button class="filter-chip ${c === state.category ? 'active' : ''}" data-cat="${c}">${c}</button>`
    )
    .join('');
  el.querySelectorAll('.filter-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const list =
    state.category === 'All'
      ? state.products
      : state.products.filter((p) => p.category === state.category);

  const grid = document.getElementById('grid');
  grid.innerHTML = list
    .map(
      (p) => `
    <div class="card">
      <img class="thumb" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <div class="cat">${p.category}</div>
        <h3>${p.name}</h3>
        <p class="desc">${p.description}</p>
        <div class="row">
          <span class="price">${OakCart.fmt(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">+ Add</button>
        </div>
      </div>
    </div>`
    )
    .join('');

  grid.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      OakCart.addItem(btn.dataset.id, 1, null);
      btn.textContent = 'Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = '+ Add';
        btn.classList.remove('added');
      }, 900);
    });
  });
}

document.addEventListener('DOMContentLoaded', loadProducts);
