<script setup lang="ts">
import { ref } from 'vue'

const showDrawer = ref(true)

const categories = [
  {
    id: 'bocados', label: 'Bocados', count: 7,
    items: [
      { id: 'c1', name: 'Chorizos cóctel', price: '$ 18.000' },
      { id: 'c2', name: 'Salchipapas', price: '$ 13.500' },
      { id: 'c3', name: 'Costipapa', price: '$ 18.000' },
      { id: 'c4', name: 'Chuletines', price: '$ 18.000' },
      { id: 'c5', name: 'Canastas de plátano con costilla', price: '$ 18.000' },
      { id: 'c6', name: 'Empanaditas chilenas', price: '$ 18.000' },
      { id: 'c7', name: 'Porción de papas', price: '$ 8.000' },
    ],
  },
  { id: 'postres', label: 'Postres', count: 6, items: [] },
  { id: 'platos', label: 'Platos Fuertes', count: 6, items: [] },
]
</script>

<template>
  <!-- Phone shell -->
  <div class="phone-shell">
    <div class="phone-screen">

      <!-- ── Drawer ─────────────────────────────────────────────── -->
      <div v-if="showDrawer" class="drawer">
        <div class="drawer-top">
          <span class="drawer-logo">⚡ LWM Admin</span>
        </div>

        <div class="drawer-section">
          <p class="section-label">RESTAURANTE</p>
          <div class="restaurant-picker">
            Bocatería El Sabor
            <span style="color:#9ca3af;font-size:11px;">⌄</span>
          </div>
        </div>

        <div class="drawer-nav">
          <div class="nav-item nav-item--active">Dashboard</div>
          <div class="nav-item">Info del restaurante</div>

          <p class="section-label" style="margin-top:10px;">MENÚS</p>
          <div class="nav-item">Menu base</div>

          <div class="nav-divider"></div>

          <div class="nav-item">Tema</div>
          <div class="nav-item">Ubicaciones</div>
          <div class="nav-item">Redes sociales</div>
          <div class="nav-item">Código QR</div>
        </div>

        <div class="drawer-bottom">
          <button class="logout-btn" @click="showDrawer = false">Cerrar sesión →</button>
        </div>
      </div>

      <!-- ── Menu Editor ────────────────────────────────────────── -->
      <div v-else class="editor">
        <!-- Mobile topbar -->
        <div class="mob-topbar">
          <button class="hamburger" @click="showDrawer = true">≡</button>
          <span class="mob-logo">⚡ LWM</span>
          <div style="width:28px;"></div>
        </div>

        <div class="editor-body">
          <h1 class="page-title">Menu base</h1>
          <div class="action-row">
            <button class="btn-ghost">Vista previa ↗</button>
            <button class="btn-outline">+ Agregar categoría</button>
            <button class="btn-dark">Publicar cambios</button>
          </div>

          <div class="cat-list">
            <div v-for="cat in categories" :key="cat.id" class="cat-card">
              <div class="cat-header">
                <span class="handle">⠿</span>
                <span class="chevron">∨</span>
                <span class="cat-name">{{ cat.label }}</span>
                <span class="cat-count">{{ cat.count }} platos</span>
                <span class="icon-btn">👁</span>
                <span class="icon-btn">···</span>
                <span class="icon-btn">🗑</span>
              </div>
              <template v-if="cat.items.length">
                <div v-for="item in cat.items" :key="item.id" class="item-row">
                  <span class="handle" style="font-size:11px;color:#d1d5db;">⠿</span>
                  <span class="avail-dot"></span>
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">{{ item.price }}</span>
                </div>
                <div class="add-item">+ Agregar plato</div>
              </template>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.phone-shell {
  background: #050505;
  border-radius: 3.5rem;
  padding: 16px;
  border: 8px solid #1a1a1a;
  box-shadow: 0 0 100px rgba(132, 204, 22, 0.15);
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.phone-screen {
  background: #fff;
  border-radius: 2.8rem;
  height: 640px;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
}

/* ── Drawer ── */
.drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.drawer-top {
  padding: 20px 20px 14px;
  border-bottom: 1px solid #e4e4e7;
}

.drawer-logo {
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #111;
}

.drawer-section { padding: 14px 20px 8px; }

.section-label {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.08em;
  margin: 0 0 6px;
}

.restaurant-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.drawer-nav { flex: 1; padding: 4px 12px; overflow-y: auto; }

.nav-item {
  padding: 9px 10px;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
}

.nav-item--active {
  background: #f4f4f5;
  font-weight: 700;
  color: #111;
}

.nav-divider {
  height: 1px;
  background: #e4e4e7;
  margin: 10px 0;
}

.drawer-bottom {
  padding: 14px 20px 24px;
  border-top: 1px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.logout-btn {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: center;
  padding: 4px 0;
}

/* ── Editor ── */
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f4f4f5;
}

.mob-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e4e4e7;
  flex-shrink: 0;
}

.hamburger {
  font-size: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #111;
  width: 28px;
  padding: 0;
}

.mob-logo {
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 14px;
  color: #111;
}

.editor-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
}

.page-title {
  font-family: 'Manrope', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #111;
  margin: 0 0 10px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.btn-ghost {
  padding: 5px 8px;
  background: transparent;
  border: none;
  font-size: 11.5px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.btn-outline {
  padding: 5px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 11.5px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.btn-dark {
  padding: 5px 10px;
  border-radius: 6px;
  background: #9ca3af;
  border: none;
  font-size: 11.5px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}

.cat-list { display: flex; flex-direction: column; gap: 8px; }

.cat-card {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  overflow: hidden;
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 9px 10px;
}

.handle { color: #d1d5db; font-size: 12px; }
.chevron { font-size: 10px; color: #9ca3af; }
.cat-name { font-weight: 700; font-size: 13px; color: #111; flex: 1; }
.cat-count { font-size: 10.5px; color: #9ca3af; }
.icon-btn { font-size: 11px; color: #9ca3af; cursor: pointer; }

.item-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-top: 1px solid #f3f4f6;
}

.avail-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
}

.item-name { flex: 1; font-size: 12px; color: #111; }
.item-price { font-size: 12px; font-weight: 600; color: #111; white-space: nowrap; }

.add-item {
  padding: 7px 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
  cursor: pointer;
}
</style>
