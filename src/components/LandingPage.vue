<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import AdminDemo from './AdminDemo.vue'
import MobileAdminDemo from './MobileAdminDemo.vue'

const ADMIN_URL = 'https://lightweightmenu-admin.vercel.app'

onMounted(() => {
  document.documentElement.classList.add('dark')
  document.body.classList.add('landing-active')
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('dark')
  document.body.classList.remove('landing-active')
})
</script>

<template>
  <div class="dark bg-background text-on-surface font-body overflow-x-hidden">
    <!-- ── TopNavBar ─────────────────────────────────────────────────── -->
    <nav class="fixed top-0 w-full z-50 bg-neutral-950/70 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
      <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div class="text-2xl font-black text-white tracking-tighter" style="font-family: 'Manrope', sans-serif;">LWM Admin</div>
        <div class="hidden md:flex gap-10 items-center">
          <a class="font-bold text-sm text-lime-400 tracking-tight transition-all" style="font-family: 'Manrope', sans-serif;" href="#como-funciona">Cómo funciona</a>
          <a class="font-bold text-sm text-neutral-400 hover:text-white tracking-tight transition-all" style="font-family: 'Manrope', sans-serif;" href="#caracteristicas">Características</a>
          <a class="font-bold text-sm text-neutral-400 hover:text-white tracking-tight transition-all" style="font-family: 'Manrope', sans-serif;" href="#demo">Demo</a>
        </div>
        <a
          :href="ADMIN_URL"
          target="_blank"
          rel="noopener"
          class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-extrabold text-sm hover:scale-105 active:scale-95 transition-transform"
          style="font-family: 'Manrope', sans-serif;"
        >
          Solicita tu menú
        </a>
      </div>
    </nav>

    <main class="pt-32 mesh-bg">

      <!-- ── Hero ─────────────────────────────────────────────────────── -->
      <section id="como-funciona" class="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div class="lg:col-span-6 relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6" style="font-family: 'Manrope', sans-serif;">
              SaaS para Restaurantes
            </div>
            <h1 class="font-extrabold text-5xl lg:text-7xl text-white leading-[1.05] tracking-tighter mb-8" style="font-family: 'Manrope', sans-serif;">
              Tu menú digital, <span class="text-primary text-glow italic">listo</span> en segundos.
            </h1>
            <p class="text-lg text-on-surface-variant mb-12 max-w-lg leading-relaxed font-light">
              La forma más rápida y elegante para que los restaurantes colombianos digitalicen su servicio sin fricción tecnológica.
            </p>
            <div class="flex flex-col sm:flex-row gap-5">
              <a
                :href="ADMIN_URL"
                target="_blank"
                rel="noopener"
                class="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg hover:brightness-110 transition-all glow-primary text-center"
                style="font-family: 'Manrope', sans-serif;"
              >
                Empieza ahora
              </a>
              <a
                href="#demo"
                class="flex items-center justify-center gap-3 px-10 py-5 rounded-lg border border-outline font-bold text-lg text-white hover:bg-white/5 transition-all backdrop-blur-sm"
                style="font-family: 'Manrope', sans-serif; text-decoration: none;"
              >
                <span class="material-symbols-outlined">play_circle</span>
                Ver demo
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 relative group">
            <div class="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
            <div class="relative">
              <!-- Desktop mockup -->
              <div class="bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden border border-white/10 w-full aspect-[4/3] relative z-0 transform -rotate-3 hover:rotate-0 transition-all duration-700">
                <img alt="Admin UI" class="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida/ADBb0uh25xg6vWGgjiXWaaEf_tHQ0ixP2qdbcsuYtcXqpQ7rBbbXYE0YkkKahM7d5l1111P72vDj03deGMdpGCLG-Z-mA8QEf0Ltgd2BFyHfwc9OwVNgCQqiAnx4f5c1KGwkwDpP7ilBdYaVRFS_YR6_xZkqx-ZY6PhoMqfUztXieUuahEq6ID_qTDLXs_X5LxDHj5-7uJsDXogWCND7ZIVJSDRBYP68BKfMY1f3zn3BoKNGWrk-w8wpxGL8urMT0E1PyOktYOev0jFnhZs" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
              </div>
              <!-- Phone mockup -->
              <div class="absolute -right-4 -bottom-12 w-1/2 max-w-[260px] z-10 transform rotate-6 group-hover:rotate-3 transition-all duration-700">
                <div class="bg-[#050505] rounded-[2.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border-[6px] border-[#1a1a1a]">
                  <div class="bg-black rounded-[2rem] h-[400px] overflow-hidden relative">
                    <img alt="Mobile UI" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugALkOVy45Aw5PW9zojUTk7UoQbWYUcXsVIJWByFAZ2GMVREloKM5L2NvxAuvJpPL9vg88A8kfm0T9tX_tFKxUotmycCezt4DSnQ_Km41a4alR4IHN1Dc2OSlpdAj-vwP1PLxokbdC3wW4DHlkPxqlhjFj6NYjvI1aBspZJF03yLqI0yIkx4zqkP0bXVWJ_Uan9IDm_EkThYE57LdclL72SfC0vZyjZE6kBVgFGOXAljtI0CzqWXPaJT8Kh2Rf7cG9NqNHkBFjfl84" />
                    <div class="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Bento grid ─────────────────────────────────────────────────── -->
      <section id="caracteristicas" class="py-32 relative">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div class="max-w-2xl">
              <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-6 tracking-tighter" style="font-family: 'Manrope', sans-serif;">Todo lo que necesitas para digitalizar tu mesa.</h2>
              <p class="text-on-surface-variant text-lg font-light">Diseñado para ser intuitivo, potente y sobre todo, extremadamente rápido.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Large card -->
            <div class="md:col-span-8 glass-card p-10 rounded-2xl flex flex-col justify-between group overflow-hidden relative">
              <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8 border border-primary/20">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
                </div>
                <h3 class="font-bold text-3xl text-white mb-4 tracking-tight" style="font-family: 'Manrope', sans-serif;">Menú digital en segundos</h3>
                <p class="text-on-surface-variant leading-relaxed text-lg font-light max-w-lg">Crea tu restaurante, añade platos y publica al instante. Tu menú vive en una URL compartible y código QR listo para imprimir.</p>
              </div>
              <div class="mt-12 flex gap-3 relative z-10">
                <span class="px-4 py-1.5 bg-white/5 border border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest">Instantáneo</span>
                <span class="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest">Cloud Sync</span>
              </div>
            </div>

            <!-- Green card -->
            <div class="md:col-span-4 bg-primary p-10 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 overflow-hidden relative">
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-on-primary mb-8">
                  <span class="material-symbols-outlined">drag_pan</span>
                </div>
                <h3 class="font-bold text-2xl text-on-primary mb-4 tracking-tight" style="font-family: 'Manrope', sans-serif;">Editor Visual</h3>
                <p class="text-on-primary/80 leading-relaxed font-medium">Reordena categorías y platos visualmente con drag-and-drop.</p>
              </div>
            </div>

            <!-- Small cards -->
            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">storefront</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3" style="font-family: 'Manrope', sans-serif;">Perfil de restaurante</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">Tu logo, redes y ubicación integrados elegantemente en el menú digital.</p>
            </div>

            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">restaurant_menu</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3" style="font-family: 'Manrope', sans-serif;">Múltiples menús</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">Gestión centralizada para desayunos, almuerzos, cenas y licores.</p>
            </div>

            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">qr_code_2</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3" style="font-family: 'Manrope', sans-serif;">Generador de QR</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">Códigos listos para imprimir con estilos personalizados para tu marca.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Live Demo ──────────────────────────────────────────────────── -->
      <section id="demo" class="py-32 relative overflow-hidden">
        <div class="absolute inset-0 bg-white/[0.02] -skew-y-2 pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6" style="font-family: 'Manrope', sans-serif;">
              Demo interactiva
            </div>
            <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-6 tracking-tighter" style="font-family: 'Manrope', sans-serif;">Así de fácil se gestiona tu menú.</h2>
            <p class="text-on-surface-variant text-lg font-light max-w-xl mx-auto">Haz clic en un plato para editarlo. Esto es exactamente lo que verás cuando administres tu restaurante.</p>
          </div>

          <div class="relative">
            <div class="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div class="relative z-10">
              <AdminDemo />
            </div>
          </div>
        </div>
      </section>

      <!-- ── Mobile-First ───────────────────────────────────────────────── -->
      <section class="py-32 overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div class="relative">
            <div class="relative mx-auto w-full" style="max-width: 320px;">
              <div class="absolute -inset-20 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
              <div class="relative z-10">
                <MobileAdminDemo />
              </div>
            </div>
          </div>

          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8" style="font-family: 'Manrope', sans-serif;">
              <span class="material-symbols-outlined" style="font-size: 14px;">smartphone</span>
              OPTIMIZADO PARA MÓVIL
            </div>
            <h2 class="font-extrabold text-5xl lg:text-6xl text-white mb-8 leading-tight tracking-tighter" style="font-family: 'Manrope', sans-serif;">Gestiona tu menú desde donde estés.</h2>
            <p class="text-on-surface-variant text-xl leading-relaxed mb-10 font-light">
              ¿No tienes computador? No hay problema. Nuestra plataforma está optimizada para que hagas cambios táctiles mientras atiendes tu negocio. Cambia un precio o oculta un plato agotado en segundos.
            </p>
            <ul class="space-y-6 mb-12">
              <li v-for="feat in ['Edición táctil intuitiva', 'Carga fotos directamente de tu cámara', 'Cambios en tiempo real']" :key="feat" class="flex items-center gap-4 text-white font-medium">
                <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-primary" style="font-size: 14px; font-variation-settings: 'FILL' 1;">check</span>
                </div>
                {{ feat }}
              </li>
            </ul>
            <a
              :href="ADMIN_URL"
              target="_blank"
              rel="noopener"
              class="inline-block bg-white/5 border border-white/10 text-white px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300"
              style="font-family: 'Manrope', sans-serif; text-decoration: none;"
            >
              Empieza a editar hoy
            </a>
          </div>
        </div>
      </section>

      <!-- ── Analytics teaser ───────────────────────────────────────────── -->
      <section class="py-32 relative">
        <div class="absolute inset-0 bg-white/[0.02] -skew-y-3 pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-10 border border-primary/20 glow-primary">
            <span class="material-symbols-outlined text-4xl">insights</span>
          </div>
          <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-8 tracking-tighter" style="font-family: 'Manrope', sans-serif;">Analíticas sencillas</h2>
          <p class="text-on-surface-variant text-xl leading-relaxed font-light mb-12">
            Descubre cuántas personas escanean y ven tu menú cada día. Toma decisiones basadas en datos reales para hacer crecer tu restaurante.
          </p>
          <div class="flex justify-center gap-8 opacity-40">
            <div class="h-24 w-1 bg-primary/40 rounded-full"></div>
            <div class="h-32 w-1 bg-primary/60 rounded-full"></div>
            <div class="h-20 w-1 bg-primary/30 rounded-full"></div>
            <div class="h-28 w-1 bg-primary/50 rounded-full"></div>
            <div class="h-16 w-1 bg-primary/40 rounded-full"></div>
            <div class="h-36 w-1 bg-primary/70 rounded-full"></div>
          </div>
        </div>
      </section>

      <!-- ── Final CTA ──────────────────────────────────────────────────── -->
      <section class="py-32 px-6">
        <div class="max-w-6xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-16 text-center relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -mr-[250px] -mt-[250px] pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[120px] -ml-[200px] -mb-[200px] pointer-events-none"></div>
          <div class="relative z-10">
            <h2 class="font-extrabold text-5xl lg:text-6xl text-white mb-8 tracking-tighter leading-tight" style="font-family: 'Manrope', sans-serif;">
              ¿Listo para llevar tu menú <br/> al <span class="text-primary italic">siguiente nivel?</span>
            </h2>
            <p class="text-lg text-on-surface-variant mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Únete a restaurantes colombianos que ya están modernizando su atención al cliente con LWM Admin.
            </p>
            <a
              :href="ADMIN_URL"
              target="_blank"
              rel="noopener"
              class="inline-block bg-primary text-on-primary px-12 py-6 rounded-lg font-black text-xl hover:scale-105 transition-transform glow-primary"
              style="font-family: 'Manrope', sans-serif; text-decoration: none;"
            >
              Solicita tu menú ahora
            </a>
          </div>
        </div>
      </section>
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="bg-[#131313] w-full py-16 px-12 border-t border-white/5">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between gap-16 mb-20">
          <div class="max-w-xs">
            <div class="text-2xl font-black text-white tracking-tighter mb-6" style="font-family: 'Manrope', sans-serif;">LWM Admin</div>
            <p class="text-neutral-500 text-sm leading-relaxed font-light uppercase tracking-widest">Simplificando la gestión digital de restaurantes en Colombia.</p>
          </div>
          <div class="flex flex-col gap-5">
            <h4 class="text-xs uppercase tracking-[0.2em] text-lime-500 font-black mb-2">Producto</h4>
            <a class="text-neutral-500 hover:text-white transition-all text-sm uppercase tracking-widest font-medium" href="#caracteristicas">Características</a>
            <a class="text-neutral-500 hover:text-white transition-all text-sm uppercase tracking-widest font-medium" href="#demo">Demo</a>
            <a class="text-neutral-500 hover:text-white transition-all text-sm uppercase tracking-widest font-medium" href="#como-funciona">Cómo funciona</a>
          </div>
        </div>
        <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-xs uppercase tracking-[0.3em] text-neutral-600 font-medium">
            © 2025 LWM Admin. Hecho en Colombia.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Tailwind v4 — utilities + theme only, NO preflight (preserves existing menu CSS) */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

/* Class-based dark mode: .dark ancestor activates dark: variants */
@variant dark (&:where(.dark, .dark *));

/* Custom design tokens */
@theme {
  --color-primary: #84CC16;
  --color-on-primary: #052e16;
  --color-background: #0a0a0a;
  --color-surface: #121212;
  --color-surface-variant: #1a1a1a;
  --color-outline: #262626;
  --color-on-surface: #fafafa;
  --color-on-surface-variant: #a3a3a3;
  --font-family-headline: 'Manrope', sans-serif;
  --font-family-body: 'Inter', sans-serif;
}

/* Custom utilities used by the landing page */
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.glass-card {
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glow-primary {
  box-shadow: 0 0 40px -10px rgba(132, 204, 22, 0.3);
}

.text-glow {
  text-shadow: 0 0 20px rgba(132, 204, 22, 0.4);
}

.mesh-bg {
  background-image:
    radial-gradient(at 0% 0%, hsla(84, 80%, 15%, 0.15) 0, transparent 50%),
    radial-gradient(at 100% 100%, hsla(84, 80%, 15%, 0.1) 0, transparent 50%);
}

/* Remove underlines from all anchors in the landing page */
a {
  text-decoration: none;
}

/* Smooth scrolling for anchor nav */
html {
  scroll-behavior: smooth;
}
</style>
