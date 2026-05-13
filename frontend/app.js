/* =============================================
   EL TORNILLO FELIZ — APP LOGIC
   localStorage demo (sin backend requerido)
   ============================================= */

// ========== STATE ==========
const LOW_STOCK_THRESHOLD = 5;

function getProductos() {
  return JSON.parse(localStorage.getItem('productos') || '[]');
}

function saveProductos(p) {
  localStorage.setItem('productos', JSON.stringify(p));
}

function getTransacciones() {
  return JSON.parse(localStorage.getItem('transacciones') || '[]');
}

function saveTransacciones(t) {
  localStorage.setItem('transacciones', JSON.stringify(t));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== SEED DATA (solo primera vez) ==========
function seedData() {
  if (localStorage.getItem('seeded')) return;

  const productos = [
    { id: generateId(), codigo: 'P001', nombre: 'Martillo de Carpintero', cantidad: 25, precioUnitario: 32500 },
    { id: generateId(), codigo: 'P002', nombre: 'Destornillador Phillips', cantidad: 40, precioUnitario: 8900 },
    { id: generateId(), codigo: 'P003', nombre: 'Taladro Eléctrico', cantidad: 3, precioUnitario: 185000 },
    { id: generateId(), codigo: 'P004', nombre: 'Tornillos 1/2" (100u)', cantidad: 120, precioUnitario: 4500 },
    { id: generateId(), codigo: 'P005', nombre: 'Llave Inglesa', cantidad: 4, precioUnitario: 28000 },
    { id: generateId(), codigo: 'P006', nombre: 'Cinta Métrica 5m', cantidad: 15, precioUnitario: 12000 },
    { id: generateId(), codigo: 'P007', nombre: 'Nivel de Burbuja', cantidad: 0, precioUnitario: 21000 },
    { id: generateId(), codigo: 'P008', nombre: 'Guantes de Trabajo', cantidad: 30, precioUnitario: 9500 },
  ];

  const hoy = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const dias = n => {
    const d = new Date(); d.setDate(d.getDate() - n); return fmt(d);
  };

  const transacciones = [
    { id: generateId(), fecha: dias(2), tipo: 'venta', detalle: 'Venta de martillos y tornillos', monto: 95000 },
    { id: generateId(), fecha: dias(3), tipo: 'compra', detalle: 'Reabastecimiento tornillos', monto: 45000 },
    { id: generateId(), fecha: dias(5), tipo: 'venta', detalle: 'Venta taladro + guantes', monto: 218000 },
    { id: generateId(), fecha: dias(7), tipo: 'venta', detalle: 'Venta destornilladores x5', monto: 44500 },
    { id: generateId(), fecha: dias(10), tipo: 'compra', detalle: 'Compra de herramientas nuevas', monto: 320000 },
    { id: generateId(), fecha: dias(12), tipo: 'venta', detalle: 'Venta cintas métricas x3', monto: 36000 },
  ];

  saveProductos(productos);
  saveTransacciones(transacciones);
  localStorage.setItem('seeded', '1');
}

// ========== AUTH ==========
function login() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const err = document.getElementById('login-error');

  if (user === 'admin' && pass === 'admin123') {
    err.classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    init();
  } else {
    err.classList.remove('hidden');
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !document.getElementById('login-screen').classList.contains('hidden')) {
    login();
  }
});

function logout() {
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}

// ========== INIT ==========
function init() {
  seedData();
  updateDate();
  updateAlertBadge();
  renderDashboard();
}

function updateDate() {
  const d = new Date();
  document.getElementById('current-date').textContent =
    d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ========== NAVIGATION ==========
const SECTION_TITLES = {
  dashboard: 'Dashboard',
  inventario: 'Inventario',
  contabilidad: 'Contabilidad',
  reportes: 'Reportes'
};

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('section-' + name).classList.remove('hidden');
  document.getElementById('section-title').textContent = SECTION_TITLES[name];

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n => {
    if (n.getAttribute('onclick')?.includes(name)) n.classList.add('active');
  });

  if (name === 'inventario') renderProductos();
  if (name === 'contabilidad') renderTransacciones();
  if (name === 'reportes') renderReportes();
}

// ========== DASHBOARD ==========
function renderDashboard() {
  const productos = getProductos();
  const transacciones = getTransacciones();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const mesTransacciones = transacciones.filter(t => {
    const d = new Date(t.fecha);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const ingresos = mesTransacciones.filter(t => t.tipo === 'venta').reduce((s, t) => s + t.monto, 0);
  const egresos = mesTransacciones.filter(t => t.tipo === 'compra').reduce((s, t) => s + t.monto, 0);
  const bajo = productos.filter(p => p.cantidad <= LOW_STOCK_THRESHOLD).length;

  document.getElementById('stat-productos').textContent = productos.length;
  document.getElementById('stat-ingresos').textContent = formatCurrency(ingresos);
  document.getElementById('stat-egresos').textContent = formatCurrency(egresos);
  document.getElementById('stat-bajo').textContent = bajo;

  // Balance
  document.getElementById('bal-ingresos').textContent = formatCurrency(ingresos);
  document.getElementById('bal-egresos').textContent = formatCurrency(egresos);
  const neto = ingresos - egresos;
  const netoEl = document.getElementById('bal-neto');
  netoEl.textContent = '= ' + formatCurrency(neto);
  netoEl.style.color = neto >= 0 ? 'var(--green)' : 'var(--red)';
  const pct = ingresos > 0 ? Math.min((ingresos / (ingresos + egresos)) * 100, 100) : 0;
  document.getElementById('balance-bar').style.width = pct + '%';

  // Alerts
  const alertEl = document.getElementById('dashboard-alerts');
  const alertProds = productos.filter(p => p.cantidad <= LOW_STOCK_THRESHOLD);
  if (alertProds.length === 0) {
    alertEl.innerHTML = '<p class="empty-msg">✅ Sin alertas activas</p>';
  } else {
    alertEl.innerHTML = alertProds.map(p => `
      <div class="alert-item">
        <span class="alert-name">📦 ${p.nombre}</span>
        <span class="alert-qty">${p.cantidad === 0 ? '⛔ Sin stock' : p.cantidad + ' unid.'}</span>
      </div>
    `).join('');
  }

  // Recent transactions
  const txEl = document.getElementById('dashboard-transactions');
  const recent = [...transacciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  if (recent.length === 0) {
    txEl.innerHTML = '<p class="empty-msg">Sin transacciones</p>';
  } else {
    txEl.innerHTML = recent.map(t => `
      <div class="mini-row">
        <span>${new Date(t.fecha + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })} — ${t.detalle}</span>
        <span style="color:${t.tipo === 'venta' ? 'var(--green)' : 'var(--red)'}">
          ${t.tipo === 'venta' ? '+' : '-'}${formatCurrency(t.monto)}
        </span>
      </div>
    `).join('');
  }
}

function updateAlertBadge() {
  const count = getProductos().filter(p => p.cantidad <= LOW_STOCK_THRESHOLD).length;
  document.getElementById('alert-count').textContent = count;
  const badge = document.getElementById('alert-badge');
  badge.style.display = count > 0 ? 'flex' : 'none';
}

// ========== INVENTARIO ==========
let filtroInv = '';

function renderProductos(lista) {
  const productos = lista || getProductos();
  const term = filtroInv.toLowerCase();
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(term) || p.codigo.toLowerCase().includes(term)
  );

  const tbody = document.getElementById('tbody-productos');
  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No se encontraron productos</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados.map(p => {
    let badge, estado;
    if (p.cantidad === 0) { badge = 'badge-out'; estado = '⛔ Sin stock'; }
    else if (p.cantidad <= LOW_STOCK_THRESHOLD) { badge = 'badge-low'; estado = '⚠️ Stock bajo'; }
    else { badge = 'badge-ok'; estado = '✅ OK'; }

    return `
      <tr>
        <td><code style="color:var(--accent);font-size:0.82rem">${p.codigo}</code></td>
        <td><strong>${p.nombre}</strong></td>
        <td>${p.cantidad}</td>
        <td>${formatCurrency(p.precioUnitario)}</td>
        <td>${formatCurrency(p.cantidad * p.precioUnitario)}</td>
        <td><span class="badge ${badge}">${estado}</span></td>
        <td>
          <button class="btn-icon" onclick="editarProducto('${p.id}')">✏️</button>
          <button class="btn-icon delete" onclick="eliminarProducto('${p.id}')">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function filtrarProductos() {
  filtroInv = document.getElementById('search-inv').value;
  renderProductos();
}

function abrirModalProducto(id) {
  document.getElementById('prod-id').value = '';
  document.getElementById('prod-codigo').value = '';
  document.getElementById('prod-nombre').value = '';
  document.getElementById('prod-cantidad').value = '';
  document.getElementById('prod-precio').value = '';
  document.getElementById('prod-error').classList.add('hidden');
  document.getElementById('modal-prod-title').textContent = 'Agregar Producto';
  document.getElementById('modal-producto').classList.remove('hidden');
}

function editarProducto(id) {
  const p = getProductos().find(x => x.id === id);
  if (!p) return;
  document.getElementById('prod-id').value = p.id;
  document.getElementById('prod-codigo').value = p.codigo;
  document.getElementById('prod-nombre').value = p.nombre;
  document.getElementById('prod-cantidad').value = p.cantidad;
  document.getElementById('prod-precio').value = p.precioUnitario;
  document.getElementById('prod-error').classList.add('hidden');
  document.getElementById('modal-prod-title').textContent = 'Editar Producto';
  document.getElementById('modal-producto').classList.remove('hidden');
}

function guardarProducto() {
  const id = document.getElementById('prod-id').value;
  const codigo = document.getElementById('prod-codigo').value.trim();
  const nombre = document.getElementById('prod-nombre').value.trim();
  const cantidad = parseInt(document.getElementById('prod-cantidad').value);
  const precio = parseFloat(document.getElementById('prod-precio').value);
  const errEl = document.getElementById('prod-error');

  if (!codigo || !nombre || isNaN(cantidad) || isNaN(precio)) {
    errEl.textContent = 'Todos los campos son obligatorios.';
    errEl.classList.remove('hidden');
    return;
  }

  if (cantidad < 0 || precio < 0) {
    errEl.textContent = 'Cantidad y precio deben ser valores positivos.';
    errEl.classList.remove('hidden');
    return;
  }

  let productos = getProductos();

  if (id) {
    // Editar
    const dup = productos.find(p => p.codigo === codigo && p.id !== id);
    if (dup) { errEl.textContent = '⚠️ Ya existe un producto con ese código.'; errEl.classList.remove('hidden'); return; }
    productos = productos.map(p => p.id === id ? { ...p, codigo, nombre, cantidad, precioUnitario: precio } : p);
    toast('✅ Producto actualizado');
  } else {
    // Nuevo
    if (productos.find(p => p.codigo === codigo)) {
      errEl.textContent = '⚠️ Ya existe un producto con ese código.';
      errEl.classList.remove('hidden');
      return;
    }
    productos.push({ id: generateId(), codigo, nombre, cantidad, precioUnitario: precio });
    toast('✅ Producto agregado');
  }

  saveProductos(productos);
  cerrarModal('modal-producto');
  renderProductos();
  renderDashboard();
  updateAlertBadge();
}

function eliminarProducto(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  saveProductos(getProductos().filter(p => p.id !== id));
  renderProductos();
  renderDashboard();
  updateAlertBadge();
  toast('🗑️ Producto eliminado');
}

// ========== CONTABILIDAD ==========
function renderTransacciones() {
  const tipo = document.getElementById('filter-tipo').value;
  let transacciones = getTransacciones();
  if (tipo) transacciones = transacciones.filter(t => t.tipo === tipo);
  transacciones = [...transacciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const todos = getTransacciones();
  const ingresos = todos.filter(t => t.tipo === 'venta').reduce((s, t) => s + t.monto, 0);
  const egresos = todos.filter(t => t.tipo === 'compra').reduce((s, t) => s + t.monto, 0);
  const neto = ingresos - egresos;

  document.getElementById('total-ingresos-cont').textContent = formatCurrency(ingresos);
  document.getElementById('total-egresos-cont').textContent = formatCurrency(egresos);
  const netoEl = document.getElementById('balance-neto-cont');
  netoEl.textContent = formatCurrency(neto);
  netoEl.style.color = neto >= 0 ? 'var(--green)' : 'var(--red)';

  const tbody = document.getElementById('tbody-transacciones');
  if (transacciones.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No hay transacciones</td></tr>';
    return;
  }

  tbody.innerHTML = transacciones.map(t => `
    <tr>
      <td>${new Date(t.fecha + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
      <td><span class="badge badge-${t.tipo}">${t.tipo === 'venta' ? '💵 Venta' : '🛒 Compra'}</span></td>
      <td>${t.detalle}</td>
      <td style="font-weight:600;color:${t.tipo === 'venta' ? 'var(--green)' : 'var(--red)'}">
        ${t.tipo === 'venta' ? '+' : '-'}${formatCurrency(t.monto)}
      </td>
      <td>
        <button class="btn-icon delete" onclick="eliminarTransaccion('${t.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function filtrarTransacciones() {
  renderTransacciones();
}

function abrirModalTransaccion(tipo) {
  document.getElementById('trans-tipo').value = tipo;
  document.getElementById('trans-fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('trans-detalle').value = '';
  document.getElementById('trans-monto').value = '';
  document.getElementById('trans-error').classList.add('hidden');
  document.getElementById('modal-trans-title').textContent =
    tipo === 'venta' ? '💵 Registrar Venta' : '🛒 Registrar Compra';
  document.getElementById('modal-transaccion').classList.remove('hidden');
}

function guardarTransaccion() {
  const tipo = document.getElementById('trans-tipo').value;
  const fecha = document.getElementById('trans-fecha').value;
  const detalle = document.getElementById('trans-detalle').value.trim();
  const monto = parseFloat(document.getElementById('trans-monto').value);
  const errEl = document.getElementById('trans-error');

  if (!fecha || !detalle || isNaN(monto) || monto <= 0) {
    errEl.textContent = 'Todos los campos son obligatorios y el monto debe ser mayor a 0.';
    errEl.classList.remove('hidden');
    return;
  }

  const transacciones = getTransacciones();
  transacciones.push({ id: generateId(), fecha, tipo, detalle, monto });
  saveTransacciones(transacciones);

  cerrarModal('modal-transaccion');
  renderTransacciones();
  renderDashboard();
  toast(`✅ ${tipo === 'venta' ? 'Venta' : 'Compra'} registrada`);
}

function eliminarTransaccion(id) {
  if (!confirm('¿Eliminar esta transacción?')) return;
  saveTransacciones(getTransacciones().filter(t => t.id !== id));
  renderTransacciones();
  renderDashboard();
  toast('🗑️ Transacción eliminada');
}

// ========== REPORTES ==========
function renderReportes() {
  const productos = getProductos();
  const transacciones = getTransacciones();

  const ingresos = transacciones.filter(t => t.tipo === 'venta').reduce((s, t) => s + t.monto, 0);
  const egresos = transacciones.filter(t => t.tipo === 'compra').reduce((s, t) => s + t.monto, 0);
  const neto = ingresos - egresos;
  const valorInventario = productos.reduce((s, p) => s + p.cantidad * p.precioUnitario, 0);
  const sinStock = productos.filter(p => p.cantidad === 0).length;
  const bajStock = productos.filter(p => p.cantidad > 0 && p.cantidad <= LOW_STOCK_THRESHOLD).length;

  document.getElementById('reporte-resumen').innerHTML = [
    { label: 'Total Productos', value: productos.length, color: '' },
    { label: 'Valor Total Inventario', value: formatCurrency(valorInventario), color: '' },
    { label: 'Total Ingresos (Ventas)', value: formatCurrency(ingresos), color: 'positive' },
    { label: 'Total Egresos (Compras)', value: formatCurrency(egresos), color: 'negative' },
    { label: 'Balance Neto', value: formatCurrency(neto), color: neto >= 0 ? 'positive' : 'negative' },
    { label: 'Productos Sin Stock', value: sinStock, color: sinStock > 0 ? 'negative' : '' },
    { label: 'Productos con Stock Bajo', value: bajStock, color: bajStock > 0 ? 'negative' : '' },
    { label: 'Total Transacciones', value: transacciones.length, color: '' },
  ].map(r => `
    <div class="reporte-row">
      <span class="label">${r.label}</span>
      <span class="value ${r.color}">${r.value}</span>
    </div>
  `).join('');

  // Top productos por valor total
  const top = [...productos]
    .sort((a, b) => (b.cantidad * b.precioUnitario) - (a.cantidad * a.precioUnitario))
    .slice(0, 5);

  document.getElementById('reporte-top-productos').innerHTML = top.length === 0
    ? '<p class="empty-msg">Sin productos</p>'
    : top.map((p, i) => `
      <div class="reporte-row">
        <span class="label">${i + 1}. ${p.nombre}</span>
        <span class="value">${formatCurrency(p.cantidad * p.precioUnitario)}</span>
      </div>
    `).join('');

  // Flujo de caja chart
  renderFlujoCaja(transacciones);
}

function renderFlujoCaja(transacciones) {
  const container = document.getElementById('reporte-flujo');
  const recent = [...transacciones]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 10)
    .reverse();

  if (recent.length === 0) {
    container.innerHTML = '<p class="empty-msg">Sin datos para mostrar</p>';
    return;
  }

  const max = Math.max(...recent.map(t => t.monto));
  const H = 160;

  container.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:6px;width:100%;height:${H}px;padding-top:1rem">
      ${recent.map(t => {
        const h = Math.max(4, Math.round((t.monto / max) * (H - 20)));
        const color = t.tipo === 'venta' ? 'var(--green)' : 'var(--red)';
        const dateStr = new Date(t.fecha + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
        return `
          <div class="chart-bar-wrap" title="${t.detalle}: ${formatCurrency(t.monto)}">
            <div class="chart-bar" style="height:${h}px;background:${color};opacity:0.8"></div>
            <div class="chart-label">${dateStr}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="display:flex;gap:1.5rem;margin-top:0.75rem;font-size:0.8rem">
      <span style="color:var(--green)">■ Ventas</span>
      <span style="color:var(--red)">■ Compras</span>
    </div>
  `;
}

// ========== MODAL HELPERS ==========
function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// ========== UTILS ==========
function formatCurrency(n) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}