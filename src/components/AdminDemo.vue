<script setup lang="ts">
import { ref } from 'vue'

const activeItem = ref<string | null>('salchipapas')

const categories = [
  {
    id: 'bocados', label: 'Bocados', count: 7,
    items: [
      { id: 'chorizos', name: 'Chorizos cóctel', price: '18.000', available: true },
      { id: 'salchipapas', name: 'Salchipapas', price: '13.500', available: true },
      { id: 'costipapa', name: 'Costipapa', price: '18.000', available: true },
      { id: 'chuletines', name: 'Chuletines', price: '18.000', available: true },
      { id: 'canastas', name: 'Canastas de plátano con costilla y pollo desmechado', price: '18.000', available: true },
      { id: 'empanaditas', name: 'Empanaditas chilenas', price: '18.000', available: true },
      { id: 'papas', name: 'Porción de papas', price: '8.000', available: true },
    ],
  },
  {
    id: 'postres', label: 'Postres', count: 6,
    items: [
      { id: 'almojabana', name: 'Torta de Almojábana', price: '13.000', available: true },
      { id: 'cheesecake', name: 'Cheesecake', price: '16.000', available: true },
      { id: 'brownie', name: 'Brownie con Helado', price: '14.000', available: true },
      { id: 'torta-dia', name: 'Torta del día', price: '10.000', available: true },
    ],
  },
  {
    id: 'platos', label: 'Platos Fuertes', count: 6,
    items: [
      { id: 'hamburguesa', name: 'Hamburguesa de La Casa', price: '28.000', available: true },
      { id: 'hamburguesac', name: 'Hamburguesa Carnívora', price: '32.000', available: true },
    ],
  },
]

type Item = { id: string; name: string; price: string; available: boolean }
const selectedItem = ref<Item>({ id: 'salchipapas', name: 'Salchipapas', price: '13500', available: true })

function selectItem(item: Item) {
  activeItem.value = item.id
  selectedItem.value = { ...item, price: item.price.replace('.', '') }
}
</script>

<template>
  <div class="frame">
    <!-- Browser chrome -->
    <div class="chrome">
      <div class="dots">
        <span class="dot" style="background:#ff5f57"></span>
        <span class="dot" style="background:#ffbd2e"></span>
        <span class="dot" style="background:#28ca41"></span>
      </div>
      <div class="url-bar">
        <span class="material-symbols-outlined" style="font-size:11px;color:#9ca3af;vertical-align:middle;">lock</span>
        admin.lightweightmenu.com/menu/abc123
      </div>
    </div>

    <!-- App -->
    <div class="app">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="logo">⚡ LWM Admin</div>

          <div class="section-label">RESTAURANTE</div>
          <div class="restaurant-picker">
            Nicolas ni dejas colar
            <span style="color:#9ca3af;font-size:10px;">▾</span>
          </div>

          <div class="nav-plain">
            <a class="nav-link">Dashboard</a>
            <a class="nav-link">Info del restaurante</a>
          </div>

          <div class="section-label" style="margin-top:12px;">MENÚS</div>
          <div class="nav-plain">
            <a class="nav-link nav-link--menu-active">Menu base</a>
          </div>

          <div class="nav-plain" style="margin-top:8px;">
            <a class="nav-link">Tema</a>
            <a class="nav-link">Ubicaciones</a>
            <a class="nav-link">Redes sociales</a>
            <a class="nav-link">Código QR</a>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="main">
        <div class="topbar">
          <h1 class="page-title">Menu base</h1>
          <div class="topbar-actions">
            <a class="action-preview">Vista previa ↗</a>
            <button class="btn-outline">+ Agregar categoría</button>
            <button class="btn-publish">Publicar cambios</button>
          </div>
        </div>

        <div class="category-list">
          <div v-for="cat in categories" :key="cat.id" class="category-card">
            <div class="cat-header">
              <span class="handle">⠿</span>
              <span class="cat-chevron">∨</span>
              <span class="cat-name">{{ cat.label }}</span>
              <span class="cat-count">{{ cat.count }} platos</span>
              <span class="cat-icon">👁</span>
              <span class="cat-icon">···</span>
              <span class="cat-icon">🗑</span>
            </div>
            <div class="cat-body">
              <div
                v-for="item in cat.items"
                :key="item.id"
                class="item-row"
                :class="{ 'item-row--active': activeItem === item.id }"
                @click="selectItem(item)"
              >
                <span class="handle" style="color:#d1d5db;font-size:0.85rem;">⠿</span>
                <span class="availability-dot"></span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">$ {{ item.price }}</span>
              </div>
              <div class="add-item">+ Agregar plato</div>
            </div>
          </div>
        </div>
      </main>

      <!-- Slide-over -->
      <aside class="slideover" :class="{ 'slideover--open': activeItem }">
        <div class="so-header">
          <span class="so-title">Editar plato</span>
          <button class="so-close" @click="activeItem = null">✕</button>
        </div>
        <div class="so-body">
          <div class="field">
            <label>NOMBRE</label>
            <input :value="selectedItem.name" readonly />
          </div>
          <div class="field">
            <label>DESCRIPCIÓN</label>
            <textarea rows="3" readonly></textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label>PRECIO</label>
              <input type="number" :value="selectedItem.price" readonly class="input-number" />
            </div>
            <div class="field">
              <label>VISIBILIDAD</label>
              <select>
                <option>Visible</option>
                <option>Oculto</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>ETIQUETAS DIETÉTICAS</label>
            <div class="chips">
              <span class="chip chip--active">🌿 Vegetariano</span>
              <span class="chip">🌱 Vegano</span>
              <span class="chip">🌾 Sin gluten</span>
              <span class="chip">🌶 Picante</span>
              <span class="chip">🥜 Nueces</span>
              <span class="chip">🐟 Pescado</span>
              <span class="chip">🥛 Sin lácteos</span>
            </div>
          </div>
          <div class="field">
            <label>FOTO</label>
            <div class="photo-box">
              <img src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&q=70" alt="Salchipapas" style="width:100%;height:100%;object-fit:cover;" />
            </div>
          </div>
        </div>
        <div class="so-footer">
          <button class="btn-delete">Eliminar</button>
          <button class="btn-save">Guardar plato</button>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.frame {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 0 80px rgba(132,204,22,0.1), 0 32px 64px rgba(0,0,0,0.5);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  max-width: 1000px;
  margin: 0 auto;
}

/* Chrome */
.chrome {
  background: #1e1e1e;
  padding: 9px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #2a2a2a;
}
.dots { display: flex; gap: 5px; }
.dot { width: 11px; height: 11px; border-radius: 50%; }
.url-bar {
  margin: 0 auto;
  background: #2c2c2c;
  border-radius: 5px;
  padding: 3px 10px;
  font-size: 11px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 380px;
  flex: 1;
}

/* App shell */
.app {
  display: flex;
  background: #f4f4f5;
  height: 560px;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 182px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e4e4e7;
  overflow-y: auto;
}
.sidebar-top { padding: 14px 0 10px; }
.logo {
  font-weight: 800;
  font-size: 15px;
  color: #111;
  padding: 0 14px 14px;
  font-family: 'Manrope', sans-serif;
}
.section-label {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.07em;
  padding: 0 14px 4px;
}
.restaurant-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px 10px;
  padding: 5px 8px;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}
.nav-plain { display: flex; flex-direction: column; }
.nav-link {
  display: block;
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  border-radius: 0;
  transition: background 0.1s;
}
.nav-link:hover { background: #f4f4f5; }
.nav-link--menu-active {
  background: #f4f4f5;
  font-weight: 700;
  color: #111;
  border-radius: 6px;
  margin: 0 6px;
  padding: 6px 8px;
}

/* Main */
.main {
  flex: 1;
  overflow-y: auto;
  background: #f4f4f5;
}
.topbar {
  background: #fff;
  border-bottom: 1px solid #e4e4e7;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 2;
}
.page-title {
  font-size: 19px;
  font-weight: 700;
  color: #111;
  margin: 0;
  font-family: 'Manrope', sans-serif;
}
.topbar-actions { display: flex; align-items: center; gap: 8px; }
.action-preview {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
}
.btn-outline {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}
.btn-publish {
  padding: 6px 14px;
  border-radius: 6px;
  background: #111;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}
.category-list { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.category-card {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  overflow: hidden;
}
.cat-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  cursor: pointer;
  background: #fff;
}
.handle { color: #d1d5db; cursor: grab; font-size: 14px; }
.cat-chevron { font-size: 11px; color: #9ca3af; }
.cat-name { font-weight: 700; font-size: 13.5px; color: #111; flex: 1; }
.cat-count { font-size: 11px; color: #9ca3af; }
.cat-icon { font-size: 13px; color: #9ca3af; cursor: pointer; padding: 0 2px; }
.cat-body { border-top: 1px solid #f3f4f6; }
.item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 1px solid #f9fafb;
  cursor: pointer;
  transition: background 0.1s;
}
.item-row:last-of-type { border-bottom: none; }
.item-row:hover { background: #f9fafb; }
.item-row--active { background: #f9fafb; }
.availability-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
}
.item-name { flex: 1; font-size: 12.5px; color: #111; font-weight: 400; }
.item-price { font-size: 12.5px; font-weight: 600; color: #111; white-space: nowrap; }
.add-item {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  cursor: pointer;
  border-top: 1px solid #f3f4f6;
}
.add-item:hover { color: #374151; }

/* Slide-over */
.slideover {
  width: 0;
  overflow: hidden;
  transition: width 0.22s ease;
  background: #fff;
  border-left: 1px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.slideover--open { width: 260px; }
.so-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border-bottom: 1px solid #e4e4e7;
  flex-shrink: 0;
}
.so-title { font-size: 14px; font-weight: 700; color: #111; white-space: nowrap; }
.so-close {
  width: 22px; height: 22px;
  border-radius: 4px;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
  cursor: pointer;
  font-size: 10px;
  color: #374151;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.so-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field { display: flex; flex-direction: column; gap: 5px; }
.field label {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.field input, .field textarea, .field select {
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12.5px;
  color: #111;
  background: #fff;
  font-family: inherit;
  resize: none;
  outline: none;
  width: 100%;
}
.field select { cursor: pointer; }
.input-number { -moz-appearance: textfield; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 5px; }
.chip {
  padding: 3px 8px;
  border-radius: 99px;
  font-size: 11px;
  border: 1px solid #e4e4e7;
  color: #374151;
  cursor: pointer;
  background: #fafafa;
  white-space: nowrap;
}
.chip--active { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
.photo-box {
  border-radius: 8px;
  overflow: hidden;
  height: 120px;
  background: #f4f4f5;
}
.so-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid #e4e4e7;
  flex-shrink: 0;
}
.btn-delete {
  background: transparent;
  border: none;
  font-size: 12.5px;
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;
  padding: 0;
}
.btn-save {
  padding: 7px 14px;
  border-radius: 6px;
  background: #111;
  border: none;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}
</style>
