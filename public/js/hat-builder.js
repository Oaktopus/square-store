const BASE = {
  'hat-trucker': { name: 'Trucker Cap', emoji: '🧢', img: 'img/6.png' },
  'hat-snapback': { name: 'Snapback', emoji: '🧢', img: 'img/2.png' },
  'hat-dad': { name: 'Dad Hat', emoji: '🧢', img: 'img/3.png' },
  'hat-fivepanel': { name: 'Five Panel', emoji: '🧢', img: 'img/1.png' },
};

const COLORS = [
  { id: 'navy', name: 'Navy', hex: '#394F76' },
  { id: 'black', name: 'Black', hex: '#242026' },
  { id: 'red', name: 'Red', hex: '#C03F41' },
  { id: 'pink', name: 'Pink / Salmon', hex: '#D27B76' },
  { id: 'khaki', name: 'Khaki', hex: '#BEB1AB' },
  { id: 'olive', name: 'Olive', hex: '#84A476' },
  { id: 'grey', name: 'Grey', hex: '#91979C' },
  { id: 'brown', name: 'Brown', hex: '#715F61' },
];

const SHELF_IMGS = ['img/shelf-1.jpg', 'img/shelf-2.jpg'];

const PATCHES = [
  { id: 'Embroidered', name: 'Embroidered', price: 2990, emoji: '🧵', desc: 'Classic stitched thread design' },
  { id: 'Laser Engraved', name: 'Laser Engraved', price: 2390, emoji: '🔥', desc: 'Precise laser-etched detail' },
  { id: 'UV Printed Leatherette', name: 'UV Printed Leatherette', price: 2690, emoji: '🧾', desc: 'Vibrant print on leatherette' },
];

const TEXT_PRICE = 800;

const state = {
  step: 1,
  model: null,
  color: null,
  patch: null,
  text: '',
};

function currentPrice() {
  const patch = PATCHES.find((p) => p.id === state.patch);
  let price = patch ? patch.price : 0;
  if (state.text.trim()) price += TEXT_PRICE;
  return price;
}

function renderModels() {
  document.getElementById('modelGrid').innerHTML = Object.keys(BASE)
    .map(
      (id) => `
      <div class="option-card ${state.model === id ? 'selected' : ''}" data-model="${id}" onclick="selectModel('${id}')">
        <div class="option-img"><img src="${BASE[id].img}" alt="${BASE[id].name}" onerror="this.style.display='none'">${BASE[id].emoji}</div>
        <div class="option-name">${BASE[id].name}</div>
      </div>`
    )
    .join('');
}

function renderColors() {
  document.getElementById('shelfReference').innerHTML = SHELF_IMGS.map(
    (src) => `<img src="${src}" alt="Available colors" loading="lazy" onerror="this.style.display='none'">`
  ).join('');
  document.getElementById('colorGrid').innerHTML = COLORS.map(
    (c) => `
    <div class="color-card ${state.color === c.id ? 'selected' : ''}" data-color="${c.id}" onclick="selectColor('${c.id}')">
      <span class="swatch" style="background:${c.hex};"></span>
      <span class="color-name">${c.name}</span>
    </div>`
  ).join('');
}

function renderPatches() {
  document.getElementById('patchGrid').innerHTML = PATCHES.map(
    (p) => `
    <div class="option-card ${state.patch === p.id ? 'selected' : ''}" data-patch="${p.id}" onclick="selectPatch('${p.id}')">
      <div class="option-img">${p.emoji}</div>
      <div class="option-name">${p.name}</div>
      <div class="option-price">${OakCart.fmt(p.price)}</div>
      <div class="option-desc">${p.desc}</div>
    </div>`
  ).join('');
}

function renderOrderSummary() {
  const model = state.model ? BASE[state.model] : null;
  const color = state.color ? COLORS.find((c) => c.id === state.color) : null;
  const patch = PATCHES.find((p) => p.id === state.patch);

  const rows = [];
  if (model) rows.push(`<div class="summary-row"><span>${model.name}</span><span>—</span></div>`);
  if (color) rows.push(`<div class="summary-row"><span>Color: ${color.name}</span><span></span></div>`);
  if (patch) rows.push(`<div class="summary-row"><span>${patch.name}</span><span>${OakCart.fmt(patch.price)}</span></div>`);
  if (state.text.trim()) rows.push(`<div class="summary-row"><span>Text: "${state.text.trim()}"</span><span>${OakCart.fmt(TEXT_PRICE)}</span></div>`);

  document.getElementById('orderSummary').innerHTML =
    rows.join('') + `<div class="summary-row total"><span>Total</span><span>${OakCart.fmt(currentPrice())}</span></div>`;
  document.getElementById('livePrice').textContent = OakCart.fmt(currentPrice());
}

function selectModel(id) {
  state.model = id;
  renderModels();
}

function selectColor(id) {
  state.color = id;
  renderColors();
}

function selectPatch(id) {
  state.patch = id;
  renderPatches();
}

function goStep(n) {
  if (n === 2 && (!state.model || !state.color)) {
    alert('Choose a hat style and a color first.');
    return;
  }
  if (n === 3 && !state.patch) {
    alert('Choose a patch type first.');
    return;
  }
  state.step = n;
  [1, 2, 3].forEach((s) => {
    document.getElementById(`step${s}`).style.display = s === n ? 'block' : 'none';
  });
  document.querySelectorAll('.step-item').forEach((el) => {
    el.classList.toggle('active', parseInt(el.dataset.step, 10) <= n);
  });
  if (n === 3) renderOrderSummary();
}

function addCustomHat() {
  if (!state.model || !state.color || !state.patch) {
    alert('Complete all steps first.');
    return;
  }
  const options = {
    model: BASE[state.model].name,
    color: COLORS.find((c) => c.id === state.color).name,
    patch: state.patch,
    text: state.text.trim(),
  };
  OakCart.addItem(state.model, 1, options);
}

document.addEventListener('DOMContentLoaded', () => {
  renderModels();
  renderColors();
  renderPatches();
  document.getElementById('customText').addEventListener('input', () => {
    state.text = document.getElementById('customText').value;
    renderOrderSummary();
  });
  document.getElementById('addCustomHat').addEventListener('click', addCustomHat);
});
