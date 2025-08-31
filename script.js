
const CATALOG = [{"id": "cap01", "name": "Gorra 'Metrolinea'", "category": "gorras", "price": 24.99, "img": "cap01.svg", "desc": "Gorra curva negra con línea roja subterránea.", "variants": ["Negro", "Gris cemento"], "sizes": ["Única"]}, {"id": "cap02", "name": "Gorra 'Neón'", "category": "gorras", "price": 26.99, "img": "cap02.svg", "desc": "Snapback con detalle de neón minimal.", "variants": ["Negro", "Verde ácido"], "sizes": ["Única"]}, {"id": "cap03", "name": "Gorra 'Stencil'", "category": "gorras", "price": 27.99, "img": "cap03.svg", "desc": "Estética stencil y textura grunge.", "variants": ["Negro"], "sizes": ["Única"]}, {"id": "tee01", "name": "Camisa 'Underground Script'", "category": "camisas", "price": 29.99, "img": "tee01.svg", "desc": "Tipografía gótica en el pecho.", "variants": ["Negro", "Blanco sucio"], "sizes": ["S", "M", "L", "XL"]}, {"id": "tee02", "name": "Camisa 'Circuito'", "category": "camisas", "price": 31.99, "img": "tee02.svg", "desc": "Trazos tipo circuito urbano.", "variants": ["Negro", "Gris oscuro"], "sizes": ["S", "M", "L", "XL"]}, {"id": "tee03", "name": "Camisa 'Neón Alley'", "category": "camisas", "price": 31.99, "img": "tee03.svg", "desc": "Detalle de letrero neón lateral.", "variants": ["Negro"], "sizes": ["S", "M", "L", "XL"]}, {"id": "tee04", "name": "Camisa 'Stencil Skull'", "category": "camisas", "price": 32.99, "img": "tee04.svg", "desc": "Cráneo stencil discreto.", "variants": ["Negro", "Blanco sucio"], "sizes": ["S", "M", "L", "XL"]}, {"id": "tee05", "name": "Camisa 'Metro Map'", "category": "camisas", "price": 33.99, "img": "tee05.svg", "desc": "Mapa de metro abstracto.", "variants": ["Negro", "Morado oscuro"], "sizes": ["S", "M", "L", "XL"]}, {"id": "hd01", "name": "Suéter 'Bunker'", "category": "sueter", "price": 49.99, "img": "hd01.svg", "desc": "Hoodie pesado 450gsm con línea roja.", "variants": ["Negro"], "sizes": ["S", "M", "L", "XL"]}];

const state = {
  filter: 'todos',
  cart: JSON.parse(localStorage.getItem('sub_cart') || '[]')
};

function fmt(n){ return new Intl.NumberFormat('es-ES',{style:'currency', currency:'USD'}).format(n); }

function renderCatalog(){
  const grid = document.querySelector('#grid');
  grid.innerHTML = '';
  CATALOG.filter(p => state.filter==='todos' || p.category===state.filter).forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="assets/products/${p.img}" alt="${p.name}"/>
      <div class="info">
        <div class="badge">${p.category.toUpperCase()}</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <strong>${p.name}</strong>
          <span class="price">${fmt(p.price)}</span>
        </div>
        <p style="opacity:.75;font-size:14px;margin:0">${p.desc}</p>
        <div class="controls">
          <select data-type="variant">${p.variants.map(v=>`<option>${v}</option>`).join('')}</select>
          <select data-type="size">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select>
          <button class="btn" data-add="${p.id}">Agregar</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function saveCart(){ localStorage.setItem('sub_cart', JSON.stringify(state.cart)); renderCart(); }

function renderCart(){
  const panel = document.querySelector('#cartPanel');
  const list = panel.querySelector('.body');
  list.innerHTML = '';
  let total = 0;
  state.cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="assets/products/${item.img}"/>
      <div style="flex:1">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <strong>${item.name}</strong>
          <span>${fmt(item.price)}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-top:4px">
          <span class="badge">${item.variant}</span>
          <span class="badge">Talla ${item.size}</span>
          <input type="number" min="1" value="${item.qty}" style="width:64px;background:#0e0e0e;color:#e9e9e9;border:1px solid #1a1a1a;border-radius:8px;padding:6px" data-qty="${idx}"/>
          <button class="btn" data-del="${idx}">Quitar</button>
        </div>
      </div>`;
    list.appendChild(el);
  });
  panel.querySelector('#total').textContent = fmt(total);
  document.querySelector('#cartCount').textContent = state.cart.reduce((a,b)=>a+b.qty,0);
}

document.addEventListener('click', (e) => {
  if(e.target.matches('[data-add]')){
    const card = e.target.closest('.card');
    const id = e.target.getAttribute('data-add');
    const product = CATALOG.find(p=>p.id===id);
    const variant = card.querySelector('[data-type="variant"]').value;
    const size = card.querySelector('[data-type="size"]').value;
    const existing = state.cart.find(i => i.id===id && i.variant===variant && i.size===size);
    if(existing){ existing.qty += 1; } else {
      state.cart.push({id, name:product.name, price:product.price, img:product.img, variant, size, qty:1});
    }
    saveCart();
  }
  if(e.target.matches('[data-del]')){
    const idx = +e.target.getAttribute('data-del');
    state.cart.splice(idx,1); saveCart();
  }
  if(e.target.matches('#fab')){
    document.querySelector('#cartPanel').classList.toggle('open');
  }
  if(e.target.matches('[data-filter]')){
    state.filter = e.target.getAttribute('data-filter');
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('btn')); 
    e.target.classList.add('btn');
    renderCatalog();
  }
  if(e.target.matches('#wa')){
    const lines = state.cart.map(i=>`${i.qty} x ${i.name} (${i.variant}, ${i.size}) - ${fmt(i.price)}`);
    const total = document.querySelector('#total').textContent;
    const msg = `Hola, quiero hacer este pedido en Subterráneo:%0A%0A${lines.join('%0A')}%0ATotal: ${total}`;
    const phone = '00000000000'; // <-- Reemplaza con tu número
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }
});

document.addEventListener('input', (e) => {
  if(e.target.matches('[data-qty]')){
    const idx = +e.target.getAttribute('data-qty');
    state.cart[idx].qty = Math.max(1, +e.target.value || 1);
    saveCart();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderCart();
});
