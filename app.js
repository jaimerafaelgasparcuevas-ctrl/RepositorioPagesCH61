// ===== Productos de JR Coffe (en grano y molido) =====
const PRODUCTS = [
  {
    id: 1,
    name: "Café en grano JR Blend",
    price: 249,
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
  },
  {
    id: 2,
    name: "Café molido Espresso",
    price: 199,
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348"
  },
  {
    id: 3,
    name: "Café en grano Chiapas",
    price: 299,
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"

  },
  {
    id: 4,
    name: "Café molido Descafeinado",
    price: 189,
    img: "https://images.unsplash.com/photo-1522992319-0365e5f11656"
  }
];

// Referencias a elementos del DOM (si existen en la página actual)
const $grid = document.getElementById('productsGrid');
const $counter = document.getElementById('cartCounter');
const $cartItems = document.getElementById('cartItems');
const $cartTotal = document.getElementById('cartTotal');
const $clearCartBtn = document.getElementById('clearCartBtn');

// Estado básico del carrito
let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // [{id, qty}]
const money = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

// ===== Productos (página productos.html) =====
function renderProducts() {
  if (!$grid) return; // si no estoy en productos.html, no hago nada

  $grid.innerHTML = PRODUCTS.map(p => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-grid gap-2">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text fw-bold">${money(p.price)}</p>
          <button class="btn btn-outline-primary" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `).join('');

  // Delegación de eventos para botones "Agregar"
  $grid.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-add');
    if (!id) return;
    addToCart(Number(id));
  });
}

// ===== Lógica de carrito =====
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  persist();
}

function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;

  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  persist();
}

function clearCart() {
  cart = [];
  persist();
}

function persist() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
  renderCart();
}

function updateCartCounter() {
  if (!$counter) return;
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  $counter.textContent = totalQty;
}

function renderCart() {
  if (!$cartItems) return; // solo corre en carrito.html

  const detailed = cart.map(i => ({
    ...i,
    ...PRODUCTS.find(p => p.id === i.id)
  }));

  const total = detailed.reduce((sum, i) => sum + i.price * i.qty, 0);

  $cartItems.innerHTML = detailed.length
    ? detailed.map(i => `
      <div class="d-flex align-items-center justify-content-between border rounded p-2">
        <div class="d-flex align-items-center gap-2">
          <img src="${i.img}" width="48" height="48" class="rounded" alt="${i.name}">
          <div>
            <div class="fw-medium">${i.name}</div>
            <div class="small text-secondary">${money(i.price)} x ${i.qty}</div>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i.id}, -1)">–</button>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
    `).join('')
    : `<p class="text-secondary">Tu carrito está vacío. Agrega algún café desde la página de productos.</p>`;

  if ($cartTotal) {
    $cartTotal.textContent = money(total);
  }
}

// Botón "Vaciar carrito" (solo existe en carrito.html)
$clearCartBtn?.addEventListener('click', clearCart);

// ===== Validación básica Bootstrap para formularios (contacto.html) =====
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);
});

// ===== Inicialización común =====
updateCartCounter(); // contador del navbar
renderProducts();    // si estoy en productos.html, pinta productos
renderCart();        // si estoy en carrito.html, pinta carrito
