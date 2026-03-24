<script setup lang="ts">
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'

const AdminDemo    = defineAsyncComponent(() => import('./AdminDemo.vue'))
const MobileAdminDemo = defineAsyncComponent(() => import('./MobileAdminDemo.vue'))

// ── Language ────────────────────────────────────────────────────────────────
const lang = ref<'es' | 'en'>('es')

onMounted(() => {
  const saved = localStorage.getItem('lwm-lang')
  if (saved === 'es' || saved === 'en') lang.value = saved
  document.documentElement.classList.add('dark')
  document.body.classList.add('landing-active')
})

watch(lang, (v) => localStorage.setItem('lwm-lang', v))

onBeforeUnmount(() => {
  document.documentElement.classList.remove('dark')
  document.body.classList.remove('landing-active')
})

// ── Translations ─────────────────────────────────────────────────────────────
const translations = {
  es: {
    nav: {
      howItWorks: 'Cómo funciona',
      features: 'Características',
      demo: 'Demo',
      cta: 'Solicita tu menú',
    },
    hero: {
      badge: 'SaaS para Restaurantes',
      headlineAccent: 'listo',
      headlinePre: 'Tu menú digital,',
      headlinePost: 'en segundos.',
      sub: 'La forma más rápida y elegante para que los restaurantes digitalicen su servicio sin fricción tecnológica.',
      ctaPrimary: 'Empieza ahora',
      ctaSecondary: 'Ver demo',
    },
    bento: {
      h2: 'Todo lo que necesitas para digitalizar tu mesa.',
      sub: 'Diseñado para ser intuitivo, potente y sobre todo, extremadamente rápido.',
      card1Title: 'Menú digital en segundos',
      card1Desc: 'Crea tu restaurante, añade platos y publica al instante. Tu menú vive en una URL compartible y código QR listo para imprimir.',
      tag1: 'Instantáneo',
      card2Title: 'Editor Visual',
      card2Desc: 'Reordena categorías y platos visualmente con drag-and-drop.',
      card3Title: 'Perfil de restaurante',
      card3Desc: 'Tu logo, redes y ubicación integrados elegantemente en el menú digital.',
      card4Title: 'Múltiples menús',
      card4Desc: 'Gestión centralizada para desayunos, almuerzos, cenas y licores.',
      card5Title: 'Generador de QR',
      card5Desc: 'Códigos listos para imprimir con estilos personalizados para tu marca.',
    },
    demo: {
      badge: 'Demo interactiva',
      h2: 'Así de fácil se gestiona tu menú.',
      sub: 'Haz clic en un plato para editarlo. Esto es exactamente lo que verás cuando administres tu restaurante.',
    },
    mobile: {
      badge: 'OPTIMIZADO PARA MÓVIL',
      h2: 'Gestiona tu menú desde donde estés.',
      sub: '¿No tienes computador? No hay problema. Nuestra plataforma está optimizada para que hagas cambios táctiles mientras atiendes tu negocio. Cambia un precio u oculta un plato agotado en segundos.',
      features: ['Edición táctil intuitiva', 'Carga fotos directamente de tu cámara', 'Cambios en tiempo real'],
      cta: 'Empieza a editar hoy',
    },
    analytics: {
      h2: 'Analíticas sencillas',
      sub: 'Descubre cuántas personas escanean y ven tu menú cada día. Toma decisiones basadas en datos reales para hacer crecer tu restaurante.',
    },
    cta: {
      h2pre: '¿Listo para llevar tu menú',
      h2accent: 'al siguiente nivel?',
      sub: 'Únete a restaurantes de todo el mundo que ya están modernizando su atención al cliente con LWM Admin.',
      button: 'Solicita tu menú ahora',
    },
    footer: {
      tagline: 'Simplificando la gestión digital de menús para restaurantes en todo el mundo.',
      product: 'Producto',
      features: 'Características',
      howItWorks: 'Cómo funciona',
      copyright: '© 2025 LWM Admin. Hecho en Colombia.',
    },
    waMessage: 'Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20Lightweight%20Menu',
  },
  en: {
    nav: {
      howItWorks: 'How it works',
      features: 'Features',
      demo: 'Demo',
      cta: 'Request your menu',
    },
    hero: {
      badge: 'SaaS for Restaurants',
      headlineAccent: 'ready',
      headlinePre: 'Your digital menu,',
      headlinePost: 'in seconds.',
      sub: 'The fastest and most elegant way for restaurants to digitize their service without any technical friction.',
      ctaPrimary: 'Get started',
      ctaSecondary: 'See demo',
    },
    bento: {
      h2: 'Everything you need to take your menu digital.',
      sub: 'Built to be intuitive, powerful, and above all, extremely fast.',
      card1Title: 'Digital menu in seconds',
      card1Desc: 'Create your restaurant, add dishes, and publish instantly. Your menu lives at a shareable URL with a print-ready QR code.',
      tag1: 'Instant',
      card2Title: 'Visual Editor',
      card2Desc: 'Visually reorder categories and dishes with drag-and-drop.',
      card3Title: 'Restaurant profile',
      card3Desc: 'Your logo, social links, and location elegantly integrated into your digital menu.',
      card4Title: 'Multiple menus',
      card4Desc: 'Centralized management for breakfast, lunch, dinner, and drinks.',
      card5Title: 'QR Generator',
      card5Desc: 'Print-ready codes with custom styles that match your brand.',
    },
    demo: {
      badge: 'Interactive demo',
      h2: 'Managing your menu is this easy.',
      sub: 'Click on a dish to edit it. This is exactly what you\'ll see when managing your restaurant.',
    },
    mobile: {
      badge: 'MOBILE OPTIMIZED',
      h2: 'Manage your menu from anywhere.',
      sub: 'No computer? No problem. Our platform is built for touch so you can make changes while running your business. Update a price or hide a sold-out dish in seconds.',
      features: ['Intuitive touch editing', 'Upload photos directly from your camera', 'Real-time updates'],
      cta: 'Start editing today',
    },
    analytics: {
      h2: 'Simple analytics',
      sub: 'Discover how many people scan and view your menu every day. Make data-driven decisions to grow your restaurant.',
    },
    cta: {
      h2pre: 'Ready to take your menu',
      h2accent: 'to the next level?',
      sub: 'Join restaurants around the world already modernizing their customer experience with LWM Admin.',
      button: 'Request your menu now',
    },
    footer: {
      tagline: 'Simplifying digital menu management for restaurants worldwide.',
      product: 'Product',
      features: 'Features',
      howItWorks: 'How it works',
      copyright: '© 2025 LWM Admin. Made in Colombia.',
    },
    waMessage: 'Hi%2C%20I%27m%20interested%20in%20learning%20more%20about%20Lightweight%20Menu',
  },
}

const t = computed(() => translations[lang.value])
const WA_URL = computed(() => `https://wa.me/573154019699?text=${t.value.waMessage}`)
</script>

<template>
  <div class="dark bg-background text-on-surface font-body overflow-x-hidden">
    <!-- ── TopNavBar ─────────────────────────────────────────────────── -->
    <nav class="fixed top-0 w-full z-50 bg-neutral-950/70 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
      <div class="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <div class="text-2xl font-black text-white tracking-tighter font-headline">LWM Admin</div>

        <div class="hidden md:flex gap-10 items-center">
          <a class="font-bold text-sm text-lime-400 tracking-tight transition-all font-headline" href="#como-funciona">{{ t.nav.howItWorks }}</a>
          <a class="font-bold text-sm text-neutral-400 hover:text-white tracking-tight transition-all font-headline" href="#caracteristicas">{{ t.nav.features }}</a>
          <a class="font-bold text-sm text-neutral-400 hover:text-white tracking-tight transition-all font-headline" href="#demo">{{ t.nav.demo }}</a>
        </div>

        <div class="flex items-center gap-3">
          <!-- Language toggle — hidden on mobile, shown in footer instead -->
          <div class="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              @click="lang = 'es'"
              class="px-2.5 py-1 rounded-md text-xs font-bold tracking-widest transition-all font-headline"
              :class="lang === 'es' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'"
            >ES</button>
            <button
              @click="lang = 'en'"
              class="px-2.5 py-1 rounded-md text-xs font-bold tracking-widest transition-all font-headline"
              :class="lang === 'en' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'"
            >EN</button>
          </div>
          <a
            :href="WA_URL"
            target="_blank"
            rel="noopener"
            class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-extrabold text-sm hover:scale-105 active:scale-95 transition-transform font-headline"
          >{{ t.nav.cta }}</a>
        </div>
      </div>
    </nav>

    <main class="pt-32 mesh-bg">

      <!-- ── Hero ─────────────────────────────────────────────────────── -->
      <section id="como-funciona" class="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div class="lg:col-span-6 relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 font-headline">
              {{ t.hero.badge }}
            </div>
            <h1 class="font-extrabold text-5xl lg:text-7xl text-white leading-[1.05] tracking-tighter mb-8 font-headline">
              {{ t.hero.headlinePre }} <span class="text-primary text-glow italic">{{ t.hero.headlineAccent }}</span> {{ t.hero.headlinePost }}
            </h1>
            <p class="text-lg text-on-surface-variant mb-12 max-w-lg leading-relaxed font-light">
              {{ t.hero.sub }}
            </p>
            <div class="flex flex-col sm:flex-row gap-5">
              <a
                :href="WA_URL"
                target="_blank"
                rel="noopener"
                class="bg-primary text-on-primary px-10 py-5 rounded-lg font-extrabold text-lg hover:brightness-110 transition-all glow-primary text-center font-headline"
              >{{ t.hero.ctaPrimary }}</a>
              <a
                href="#demo"
                class="flex items-center justify-center gap-3 px-10 py-5 rounded-lg border border-outline font-bold text-lg text-white hover:bg-white/5 transition-all backdrop-blur-sm font-headline"
              >
                <span class="material-symbols-outlined">play_circle</span>
                {{ t.hero.ctaSecondary }}
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 relative group">
            <div class="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700 pointer-events-none"></div>
            <div class="relative">
              <!-- Desktop mockup — static preview, no JS -->
              <div class="bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden border border-white/10 w-full aspect-[4/3] relative z-0 transform -rotate-3 hover:rotate-0 transition-all duration-700">
                <div class="hpd-root">
                  <div class="hpd-chrome">
                    <div class="hpd-dot" style="background:#ff5f57"></div>
                    <div class="hpd-dot" style="background:#ffbd2e"></div>
                    <div class="hpd-dot" style="background:#28ca41"></div>
                    <div class="hpd-url"></div>
                  </div>
                  <div class="hpd-body">
                    <div class="hpd-sidebar">
                      <div class="hpd-logo-bar"></div>
                      <div class="hpd-nav-block"></div>
                      <div class="hpd-nav-active"></div>
                      <div class="hpd-nav-block" style="width:70%"></div>
                      <div class="hpd-nav-block" style="width:85%"></div>
                      <div class="hpd-nav-block" style="width:60%"></div>
                    </div>
                    <div class="hpd-main">
                      <div class="hpd-page-title"></div>
                      <div class="hpd-card">
                        <div class="hpd-card-head">
                          <div class="hpd-tag"></div>
                          <div class="hpd-tag" style="width:36px;background:#84CC16;opacity:0.3"></div>
                        </div>
                        <div class="hpd-row"><div class="hpd-dot-g"></div><div class="hpd-bar"></div><div class="hpd-price"></div></div>
                        <div class="hpd-row"><div class="hpd-dot-g"></div><div class="hpd-bar" style="width:55%"></div><div class="hpd-price"></div></div>
                        <div class="hpd-row"><div class="hpd-dot-d"></div><div class="hpd-bar" style="width:40%"></div><div class="hpd-price"></div></div>
                      </div>
                      <div class="hpd-card" style="margin-top:8px;">
                        <div class="hpd-card-head"><div class="hpd-tag" style="width:50px"></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none"></div>
              </div>

              <!-- Phone mockup — static preview, no JS -->
              <div class="absolute -right-4 -bottom-12 w-1/2 max-w-[180px] z-10 transform rotate-6 group-hover:rotate-3 transition-all duration-700">
                <div class="hpp-shell">
                  <div class="hpp-screen">
                    <div class="hpp-topbar">
                      <span style="font-size:14px;color:#111;font-weight:700;">≡</span>
                      <div class="hpp-logo-bar"></div>
                      <div style="width:20px;"></div>
                    </div>
                    <div class="hpp-body">
                      <div class="hpp-page-title"></div>
                      <div class="hpp-card">
                        <div class="hpp-card-head">
                          <div class="hpp-tag"></div>
                          <div style="display:flex;gap:4px;">
                            <div class="hpp-icon"></div><div class="hpp-icon"></div>
                          </div>
                        </div>
                        <div class="hpp-item"><div class="hpp-dot-g"></div><div class="hpp-bar"></div><div class="hpp-price"></div></div>
                        <div class="hpp-item"><div class="hpp-dot-g"></div><div class="hpp-bar" style="width:60%"></div><div class="hpp-price"></div></div>
                        <div class="hpp-item"><div class="hpp-dot-d"></div><div class="hpp-bar" style="width:45%"></div><div class="hpp-price"></div></div>
                      </div>
                      <div class="hpp-card" style="margin-top:6px;">
                        <div class="hpp-card-head"><div class="hpp-tag" style="width:40px"></div></div>
                      </div>
                    </div>
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
              <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-6 tracking-tighter font-headline">{{ t.bento.h2 }}</h2>
              <p class="text-on-surface-variant text-lg font-light">{{ t.bento.sub }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Large card -->
            <div class="md:col-span-8 glass-card p-10 rounded-2xl flex flex-col justify-between group overflow-hidden relative">
              <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
              <div class="relative z-10">
                <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8 border border-primary/20">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
                </div>
                <h3 class="font-bold text-3xl text-white mb-4 tracking-tight font-headline">{{ t.bento.card1Title }}</h3>
                <p class="text-on-surface-variant leading-relaxed text-lg font-light max-w-lg">{{ t.bento.card1Desc }}</p>
              </div>
              <div class="mt-12 flex gap-3 relative z-10">
                <span class="px-4 py-1.5 bg-white/5 border border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest">{{ t.bento.tag1 }}</span>
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
                <h3 class="font-bold text-2xl text-on-primary mb-4 tracking-tight font-headline">{{ t.bento.card2Title }}</h3>
                <p class="text-on-primary/80 leading-relaxed font-medium">{{ t.bento.card2Desc }}</p>
              </div>
            </div>

            <!-- Small cards -->
            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">storefront</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3 font-headline">{{ t.bento.card3Title }}</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">{{ t.bento.card3Desc }}</p>
            </div>

            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">restaurant_menu</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3 font-headline">{{ t.bento.card4Title }}</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">{{ t.bento.card4Desc }}</p>
            </div>

            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">qr_code_2</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3 font-headline">{{ t.bento.card5Title }}</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">{{ t.bento.card5Desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Live Demo ──────────────────────────────────────────────────── -->
      <section id="demo" class="py-32 relative overflow-hidden">
        <div class="absolute inset-0 bg-white/[0.02] -skew-y-2 pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 font-headline">
              {{ t.demo.badge }}
            </div>
            <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-6 tracking-tighter font-headline">{{ t.demo.h2 }}</h2>
            <p class="text-on-surface-variant text-lg font-light max-w-xl mx-auto">{{ t.demo.sub }}</p>
          </div>

          <div class="relative">
            <div class="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div class="relative z-10 hidden md:block">
              <AdminDemo />
            </div>
            <div class="relative z-10 flex justify-center md:hidden">
              <MobileAdminDemo />
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
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8 font-headline">
              <span class="material-symbols-outlined" style="font-size: 14px;">smartphone</span>
              {{ t.mobile.badge }}
            </div>
            <h2 class="font-extrabold text-5xl lg:text-6xl text-white mb-8 leading-tight tracking-tighter font-headline">{{ t.mobile.h2 }}</h2>
            <p class="text-on-surface-variant text-xl leading-relaxed mb-10 font-light">{{ t.mobile.sub }}</p>
            <ul class="space-y-6 mb-12">
              <li v-for="feat in t.mobile.features" :key="feat" class="flex items-center gap-4 text-white font-medium">
                <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-primary" style="font-size: 14px; font-variation-settings: 'FILL' 1;">check</span>
                </div>
                {{ feat }}
              </li>
            </ul>
            <a
              :href="WA_URL"
              target="_blank"
              rel="noopener"
              class="inline-block bg-white/5 border border-white/10 text-white px-10 py-5 rounded-lg font-extrabold text-lg hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 font-headline"
            >{{ t.mobile.cta }}</a>
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
          <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-8 tracking-tighter font-headline">{{ t.analytics.h2 }}</h2>
          <p class="text-on-surface-variant text-xl leading-relaxed font-light mb-12">{{ t.analytics.sub }}</p>
          <div class="flex justify-center items-end gap-3 h-16 opacity-40" aria-hidden="true">
            <div class="w-2 h-12 bg-primary/40 rounded-full"></div>
            <div class="w-2 h-16 bg-primary/60 rounded-full"></div>
            <div class="w-2 h-8 bg-primary/30 rounded-full"></div>
            <div class="w-2 h-14 bg-primary/50 rounded-full"></div>
            <div class="w-2 h-10 bg-primary/40 rounded-full"></div>
            <div class="w-2 h-16 bg-primary/70 rounded-full"></div>
            <div class="w-2 h-6 bg-primary/35 rounded-full"></div>
            <div class="w-2 h-12 bg-primary/55 rounded-full"></div>
          </div>
        </div>
      </section>

      <!-- ── Final CTA ──────────────────────────────────────────────────── -->
      <section class="py-32 px-6">
        <div class="max-w-6xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-16 text-center relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -mr-[250px] -mt-[250px] pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[120px] -ml-[200px] -mb-[200px] pointer-events-none"></div>
          <div class="relative z-10">
            <h2 class="font-extrabold text-5xl lg:text-6xl text-white mb-8 tracking-tighter leading-tight font-headline">
              {{ t.cta.h2pre }} <br/> <span class="text-primary italic">{{ t.cta.h2accent }}</span>
            </h2>
            <p class="text-lg text-on-surface-variant mb-12 max-w-2xl mx-auto font-light leading-relaxed">{{ t.cta.sub }}</p>
            <a
              :href="WA_URL"
              target="_blank"
              rel="noopener"
              class="inline-block bg-primary text-on-primary px-12 py-6 rounded-lg font-black text-xl hover:scale-105 transition-transform glow-primary font-headline"
            >{{ t.cta.button }}</a>
          </div>
        </div>
      </section>
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="bg-[#131313] w-full py-16 px-12 border-t border-white/5">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between gap-16 mb-20">
          <div class="max-w-xs">
            <div class="text-2xl font-black text-white tracking-tighter mb-6 font-headline">LWM Admin</div>
            <p class="text-neutral-500 text-sm leading-relaxed font-light uppercase tracking-widest">{{ t.footer.tagline }}</p>
          </div>
          <div class="flex flex-col gap-5">
            <h4 class="text-xs uppercase tracking-[0.2em] text-lime-500 font-black mb-2">{{ t.footer.product }}</h4>
            <a class="text-neutral-500 hover:text-white transition-all text-sm uppercase tracking-widest font-medium" href="#caracteristicas">{{ t.footer.features }}</a>
            <a class="text-neutral-500 hover:text-white transition-all text-sm uppercase tracking-widest font-medium" href="#demo">Demo</a>
            <a class="text-neutral-500 hover:text-white transition-all text-sm uppercase tracking-widest font-medium" href="#como-funciona">{{ t.footer.howItWorks }}</a>
          </div>
        </div>
        <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-xs uppercase tracking-[0.3em] text-neutral-600 font-medium">{{ t.footer.copyright }}</p>
          <div class="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              @click="lang = 'es'"
              class="px-2.5 py-1 rounded-md text-xs font-bold tracking-widest transition-all font-headline"
              :class="lang === 'es' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'"
            >ES</button>
            <button
              @click="lang = 'en'"
              class="px-2.5 py-1 rounded-md text-xs font-bold tracking-widest transition-all font-headline"
              :class="lang === 'en' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'"
            >EN</button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Tailwind v4 — utilities + theme only, NO preflight (preserves existing menu CSS) */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

@variant dark (&:where(.dark, .dark *));

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

.font-headline { font-family: 'Manrope', sans-serif; }

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

.glow-primary { box-shadow: 0 0 40px -10px rgba(132, 204, 22, 0.3); }
.text-glow    { text-shadow: 0 0 20px rgba(132, 204, 22, 0.4); }

.mesh-bg {
  background-image:
    radial-gradient(at 0% 0%, hsla(84, 80%, 15%, 0.15) 0, transparent 50%),
    radial-gradient(at 100% 100%, hsla(84, 80%, 15%, 0.1) 0, transparent 50%);
}

a { text-decoration: none; }
html { scroll-behavior: smooth; }

/* ── Hero: static desktop preview ─────────────────────────────── */
.hpd-root   { display:flex; flex-direction:column; height:100%; background:#fff; }
.hpd-chrome { display:flex; align-items:center; gap:5px; padding:8px 12px; background:#f5f5f5; border-bottom:1px solid #e5e7eb; flex-shrink:0; }
.hpd-dot    { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.hpd-url    { flex:1; height:18px; background:#e5e7eb; border-radius:4px; margin-left:8px; max-width:240px; }
.hpd-body   { display:flex; flex:1; overflow:hidden; }
.hpd-sidebar{ width:150px; border-right:1px solid #f3f4f6; padding:14px 12px; flex-shrink:0; display:flex; flex-direction:column; gap:7px; }
.hpd-logo-bar { height:14px; background:#111; border-radius:3px; margin-bottom:6px; }
.hpd-nav-block{ height:8px; background:#f3f4f6; border-radius:2px; width:80%; }
.hpd-nav-active{ height:28px; background:#f4f4f5; border-radius:5px; width:100%; }
.hpd-main   { flex:1; padding:16px; background:#f9fafb; overflow:hidden; }
.hpd-page-title{ height:18px; background:#111; border-radius:3px; width:90px; margin-bottom:14px; }
.hpd-card   { background:#fff; border:1px solid #e5e7eb; border-radius:7px; padding:10px; }
.hpd-card-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.hpd-tag    { height:10px; background:#e5e7eb; border-radius:2px; width:60px; }
.hpd-row    { display:flex; align-items:center; gap:6px; padding:4px 0; border-top:1px solid #f3f4f6; }
.hpd-dot-g  { width:5px; height:5px; border-radius:50%; background:#84CC16; flex-shrink:0; }
.hpd-dot-d  { width:5px; height:5px; border-radius:50%; background:#d1d5db; flex-shrink:0; }
.hpd-bar    { height:7px; background:#f3f4f6; border-radius:2px; flex:1; }
.hpd-price  { height:7px; background:#e5e7eb; border-radius:2px; width:40px; }

/* ── Hero: static phone preview ───────────────────────────────── */
.hpp-shell  { background:#050505; border-radius:2.5rem; padding:10px; border:6px solid #1a1a1a; box-shadow:0 30px 80px -10px rgba(0,0,0,0.9); }
.hpp-screen { background:#fff; border-radius:2rem; overflow:hidden; }
.hpp-topbar { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:#fff; border-bottom:1px solid #f3f4f6; }
.hpp-logo-bar{ height:10px; background:#111; border-radius:2px; width:50px; }
.hpp-body   { padding:10px; background:#f9fafb; }
.hpp-page-title{ height:12px; background:#111; border-radius:2px; width:70px; margin-bottom:10px; }
.hpp-card   { background:#fff; border:1px solid #e5e7eb; border-radius:6px; padding:8px; margin-bottom:6px; }
.hpp-card-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.hpp-tag    { height:8px; background:#e5e7eb; border-radius:2px; width:50px; }
.hpp-icon   { width:12px; height:12px; background:#f3f4f6; border-radius:2px; }
.hpp-item   { display:flex; align-items:center; gap:5px; padding:3px 0; border-top:1px solid #f3f4f6; }
.hpp-dot-g  { width:4px; height:4px; border-radius:50%; background:#84CC16; flex-shrink:0; }
.hpp-dot-d  { width:4px; height:4px; border-radius:50%; background:#d1d5db; flex-shrink:0; }
.hpp-bar    { height:6px; background:#f3f4f6; border-radius:2px; flex:1; }
.hpp-price  { height:6px; background:#e5e7eb; border-radius:2px; width:28px; }
</style>
