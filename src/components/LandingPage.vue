<script setup lang="ts">
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import SignupSection from './SignupSection.vue'
import { supabase } from '@/lib/supabase'

const AdminDemo    = defineAsyncComponent(() => import('./AdminDemo.vue'))
const MobileAdminDemo = defineAsyncComponent(() => import('./MobileAdminDemo.vue'))

const { locale } = useI18n()

// ── Language ────────────────────────────────────────────────────────────────
const lang = ref<'es' | 'en'>('es')
const liveRestaurants = ref<{ name: string; slug: string; logo_url: string | null }[]>([])

let revealObserver: IntersectionObserver | null = null

onMounted(async () => {
  const { data } = await supabase
    .from('restaurants')
    .select('name, slug, logo_url')
    .eq('is_published', true)
    .order('created_at')
  if (data) liveRestaurants.value = data
  const saved = localStorage.getItem('lwm-lang')
  if (saved === 'es' || saved === 'en') lang.value = saved
  document.documentElement.classList.add('dark')
  document.body.classList.add('landing-active')

  // Scroll-reveal: fade + slide up each .reveal element once on entry
  nextTick(() => {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver!.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => revealObserver!.observe(el))
  })
})

watch(lang, (v) => {
  localStorage.setItem('lwm-lang', v)
  locale.value = v
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
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
      pricing: 'Precios',
      cta: 'Habla con nosotros',
    },
    hero: {
      badge: 'Menús digitales para restaurantes',
      headlinePre: 'Tu menú digital,',
      headlineAccent: 'carga antes de que',
      headlinePost: 'cambien de opinión.',
      sub: 'La única plataforma donde tú mismo gestionas tu menú desde el celular — sin saber de tecnología, sin esperar a nadie.',
      ctaPrimary: 'Crea tu menú hoy',
      ctaSecondary: 'Ver demo en vivo',
    },
    bento: {
      h2: 'Todo lo que necesitas.\nNada de lo que no necesitas.',
      sub: 'Cada función fue diseñada para un dueño de restaurante ocupado, no para un equipo de tecnología.',
      card1Title: 'Tu menú, publicado hoy',
      card1Desc: 'Crea tu restaurante, agrega tus platos y comparte el enlace o el QR el mismo día. Sin instalaciones. Sin configuraciones complicadas.',
      tag1: 'Listo hoy',
      card2Title: 'Editor visual',
      card2Desc: 'Mueve, edita y reorganiza tu menú arrastrando con el dedo. Tan fácil como ordenar fotos en tu galería.',
      card3Title: 'Tu marca, en cada menú',
      card3Desc: 'Logo, redes sociales y dirección visibles para cada cliente que escanee tu código QR.',
      card4Title: 'Varios menús, un solo lugar',
      card4Desc: 'Desayunos, almuerzos, cenas, bebidas — cada uno con sus propias categorías, todos desde el mismo panel.',
      card5Title: 'Código QR listo para imprimir',
      card5Desc: 'Descarga tu QR en segundos y ponlo en la mesa, la carta o la vitrina. Sin aplicaciones adicionales para el cliente.',
    },
    demo: {
      badge: 'Pruébalo ahora',
      h2: 'Así se ve administrar tu menú.',
      sub: 'Esto no es una simulación — es el admin real. Haz clic en cualquier plato y edítalo.',
    },
    mobile: {
      badge: 'HECHO PARA EL CELULAR',
      h2: 'Actualiza tu menú\nentre mesa y mesa.',
      sub: 'Agotaste un plato, cambió un precio, quieres agregar algo nuevo — hazlo en segundos desde tu celular, sin interrumpir la operación.',
      features: ['Edita con el pulgar, sin mouse ni teclado', 'Sube fotos directo desde tu cámara', 'Los cambios se ven al instante en el menú'],
      cta: 'Ver cómo funciona →',
    },
    analytics: {
      h2: '¿Cuánta gente está viendo tu menú?',
      sub: 'Mira cuántas personas escanean tu QR cada día. Sencillo, directo, útil. Sin dashboards complicados.',
    },
    testimonials: {
      eyebrow: 'Restaurantes activos',
      headline: 'Ya confían en Lightweight Menu',
    },
    pricing: {
      headline: 'Elige tu plan.',
      headlineAccent: 'Sin sorpresas.',
      sub: 'Dos planes claros para cada etapa de tu restaurante. Sin costos ocultos.',
      trialBadge: 'El primer mes es gratis. Sin tarjeta de crédito. Sin permanencia.',
      baseTitle: 'Base',
      baseBadge: 'Básico',
      baseFeatures: [
        'Menús ilimitados',
        'Categorías y platos ilimitados',
        'Hasta 15 fotos por menú',
        'Código QR listo para imprimir',
        'Editor visual con drag-and-drop',
        'Gestión desde el celular',
        'Actualizaciones en tiempo real',
        'Perfil de restaurante completo',
      ],
      basePrice: '$100.000 COP / mes',
      baseUsd: '≈ $27 USD / mes*',
      baseFine: 'Primer mes gratis. Pago mensual por transferencia bancaria. Cancela cuando quieras.',
      proTitle: 'Pro',
      proBadge: 'Pro',
      proRecommended: 'Recomendado',
      proFeatures: [
        'Todo lo del plan Base',
        'Fotos ilimitadas por menú',
        'Analíticas de escaneos',
      ],
      proPrice: '$150.000 COP / mes',
      proUsd: '≈ $40 USD / mes*',
      proFine: 'Primer mes gratis. Pago mensual por transferencia bancaria. Cancela cuando quieras.',
      setupTitle: 'Configuración inicial',
      setupBadge: 'Pago único · Opcional',
      setupDesc: '¿Prefieres que nos encarguemos de todo? Creamos tu restaurante, cargamos tus platos, descripciones, precios, etiquetas e imágenes. Tu menú listo desde el primer día.',
      setupPrice: 'Desde $150.000 COP',
      setupUsd: '≈ $40 USD*',
      setupFine: 'Pago único por transferencia bancaria. Precio según volumen de platos e imágenes.',
      usdNote: '*Valor aproximado. La conversión varía según la tasa de cambio del día.',
      diyTitle: '¿Prefieres configurarlo tú mismo?',
      diyDesc: 'Crea tu cuenta, agrega tus platos y publica tu menú hoy. El primer mes es completamente gratis, sin límites.',
      diyCtaPrimary: 'Empieza gratis →',
      diyCtaSecondary: '¿Listo para empezar? Escríbenos por WhatsApp y te explicamos cómo funciona el pago.',
    },
    cta: {
      h2pre: 'Tu menú digital,',
      h2accent: 'listo hoy.',
      sub: 'Escríbenos y en menos de 24 horas tienes tu menú publicado, con QR listo para poner en las mesas.',
      button: 'Escríbenos por WhatsApp →',
    },
    footer: {
      tagline: 'Menús digitales rápidos. Para restaurantes reales.',
      product: 'Producto',
      features: 'Características',
      howItWorks: 'Cómo funciona',
      copyright: '© 2025 LWM Admin. Hecho en Colombia.',
    },
    waMessage: 'Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20Lightweight%20Menu',
    signup: {
      badge: 'Empieza gratis',
      headline: 'Tu menú digital,\nlisto hoy.',
      sub: 'Crea tu cuenta y publica tu menú el mismo día. El primer mes es completamente gratis, sin tarjeta de crédito.',
      restaurantLabel: 'Nombre de tu restaurante',
      restaurantPlaceholder: 'Ej: Café Nicolás',
      emailLabel: 'Tu correo electrónico',
      emailPlaceholder: 'hola@mirestaurante.com',
      cta: 'Crear mi menú gratis →',
      sending: 'Enviando...',
      fine: 'Te enviaremos un enlace mágico. Sin contraseña, sin complicaciones.',
      sentTitle: '¡Revisa tu correo!',
      sentSub: 'Enviamos un enlace a {email}. Haz clic en él para empezar a construir tu menú.',
    },
  },
  en: {
    nav: {
      howItWorks: 'How it works',
      features: 'Features',
      demo: 'Demo',
      pricing: 'Pricing',
      cta: 'Talk to us',
    },
    hero: {
      badge: 'Digital menus for restaurants',
      headlinePre: 'Your digital menu,',
      headlineAccent: 'loads before they',
      headlinePost: 'change their mind.',
      sub: 'The only platform where you manage your own menu from your phone — no tech knowledge needed, no waiting on anyone.',
      ctaPrimary: 'Create your menu today',
      ctaSecondary: 'See live demo',
    },
    bento: {
      h2: 'Everything you need.\nNothing you don\'t.',
      sub: 'Every feature was built for a busy restaurant owner, not a tech team.',
      card1Title: 'Your menu, live today',
      card1Desc: 'Create your restaurant, add your dishes, and share the link or QR the same day. No setup. No complicated configurations.',
      tag1: 'Live today',
      card2Title: 'Visual editor',
      card2Desc: 'Move, edit and reorganize your menu by dragging with your finger. As easy as sorting photos in your gallery.',
      card3Title: 'Your brand, on every menu',
      card3Desc: 'Logo, social media and address visible to every customer who scans your QR code.',
      card4Title: 'Multiple menus, one place',
      card4Desc: 'Breakfast, lunch, dinner, drinks — each with their own categories, all from the same dashboard.',
      card5Title: 'Print-ready QR code',
      card5Desc: 'Download your QR in seconds and put it on the table, the menu card, or the window. No app required for the customer.',
    },
    demo: {
      badge: 'Try it now',
      h2: 'This is what managing your menu looks like.',
      sub: 'This is not a simulation — it\'s the real admin. Click any dish and edit it.',
    },
    mobile: {
      badge: 'BUILT FOR MOBILE',
      h2: 'Update your menu\nbetween tables.',
      sub: 'A dish sold out, a price changed, something new to add — do it in seconds from your phone without stopping the operation.',
      features: ['Edit with your thumb, no mouse or keyboard', 'Upload photos directly from your camera', 'Changes appear instantly on the menu'],
      cta: 'See how it works →',
    },
    analytics: {
      h2: 'How many people are viewing your menu?',
      sub: 'See how many people scan your QR every day. Simple, direct, useful. No complicated dashboards.',
    },
    testimonials: {
      eyebrow: 'Live restaurants',
      headline: 'Already using Lightweight Menu',
    },
    pricing: {
      headline: 'Choose your plan.',
      headlineAccent: 'No surprises.',
      sub: 'Two clear plans for every stage of your restaurant. No hidden costs.',
      trialBadge: 'First month free. No credit card. No commitment.',
      baseTitle: 'Base',
      baseBadge: 'Basic',
      baseFeatures: [
        'Unlimited menus',
        'Unlimited categories and dishes',
        'Up to 15 photos per menu',
        'Print-ready QR code',
        'Visual drag-and-drop editor',
        'Manage from your phone',
        'Real-time updates',
        'Complete restaurant profile',
      ],
      basePrice: '$100.000 COP / month',
      baseUsd: '≈ $27 USD / month*',
      baseFine: 'First month free. Monthly payment by bank transfer. Cancel anytime.',
      proTitle: 'Pro',
      proBadge: 'Pro',
      proRecommended: 'Recommended',
      proFeatures: [
        'Everything in Base',
        'Unlimited photos per menu',
        'Scan analytics',
      ],
      proPrice: '$150.000 COP / month',
      proUsd: '≈ $40 USD / month*',
      proFine: 'First month free. Monthly payment by bank transfer. Cancel anytime.',
      setupTitle: 'Initial setup',
      setupBadge: 'One-time · Optional',
      setupDesc: 'Prefer we handle everything? We create your restaurant, load your dishes, descriptions, prices, labels and images. Your menu ready from day one.',
      setupPrice: 'From $150.000 COP',
      setupUsd: '≈ $40 USD*',
      setupFine: 'One-time payment by bank transfer. Price based on volume of dishes and images.',
      usdNote: '*Approximate value. Conversion varies with the daily exchange rate.',
      diyTitle: 'Prefer to set it up yourself?',
      diyDesc: 'Create your account, add your dishes and publish your menu today. The first month is completely free, no limits.',
      diyCtaPrimary: 'Start free →',
      diyCtaSecondary: 'Ready to get started? Message us on WhatsApp and we\'ll walk you through how payment works.',
    },
    cta: {
      h2pre: 'Your digital menu,',
      h2accent: 'live today.',
      sub: 'Message us and in less than 24 hours your menu is published, with a QR ready to put on the tables.',
      button: 'Message us on WhatsApp →',
    },
    footer: {
      tagline: 'Fast digital menus. For real restaurants.',
      product: 'Product',
      features: 'Features',
      howItWorks: 'How it works',
      copyright: '© 2025 LWM Admin. Made in Colombia.',
    },
    waMessage: 'Hi%2C%20I%27m%20interested%20in%20learning%20more%20about%20Lightweight%20Menu',
    signup: {
      badge: 'Start for free',
      headline: 'Your digital menu,\nlive today.',
      sub: 'Create your account and publish your menu the same day. The first month is completely free, no credit card required.',
      restaurantLabel: 'Your restaurant name',
      restaurantPlaceholder: 'e.g. Bistro Nicolas',
      emailLabel: 'Your email address',
      emailPlaceholder: 'hello@myrestaurant.com',
      cta: 'Create my free menu →',
      sending: 'Sending...',
      fine: 'We\'ll send you a magic link. No password, no hassle.',
      sentTitle: 'Check your inbox!',
      sentSub: 'We sent a link to {email}. Click it to start building your menu.',
    },
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
          <a class="font-bold text-sm text-neutral-400 hover:text-white tracking-tight transition-all font-headline" href="#precios">{{ t.nav.pricing }}</a>
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
      <section id="como-funciona" class="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative reveal">
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
                href="#empieza-gratis"
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
            <div class="max-w-2xl reveal">
              <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-6 tracking-tighter font-headline">{{ t.bento.h2 }}</h2>
              <p class="text-on-surface-variant text-lg font-light">{{ t.bento.sub }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Large card -->
            <div class="md:col-span-8 glass-card p-10 rounded-2xl flex flex-col justify-between group overflow-hidden relative reveal reveal-d1">
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
            <div class="md:col-span-4 bg-primary p-10 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 overflow-hidden relative reveal reveal-d2">
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
            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group reveal reveal-d1">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">storefront</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3 font-headline">{{ t.bento.card3Title }}</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">{{ t.bento.card3Desc }}</p>
            </div>

            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group reveal reveal-d2">
              <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">restaurant_menu</span>
              </div>
              <h3 class="font-bold text-xl text-white mb-3 font-headline">{{ t.bento.card4Title }}</h3>
              <p class="text-on-surface-variant leading-relaxed text-sm font-light">{{ t.bento.card4Desc }}</p>
            </div>

            <div class="md:col-span-4 glass-card p-8 rounded-2xl hover:border-primary/30 transition-all group reveal reveal-d3">
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
          <div class="text-center mb-16 reveal">
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
          </div>
        </div>
      </section>

      <!-- ── Mobile-First ───────────────────────────────────────────────── -->
      <section class="py-32 overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div class="relative">
            <div class="relative mx-auto w-full reveal" style="max-width: 320px;">
              <div class="absolute -inset-20 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
              <div class="relative z-10">
                <MobileAdminDemo />
              </div>
            </div>
          </div>

          <div class="relative z-10 reveal reveal-d1">
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
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10 reveal">
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

      <!-- ── Testimonials ──────────────────────────────────────────────── -->
      <section v-if="liveRestaurants.length > 0" class="py-20 overflow-hidden">
        <div class="max-w-5xl mx-auto px-6 text-center mb-12 reveal">
          <p class="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 font-headline mb-3">
            {{ t.testimonials.eyebrow }}
          </p>
          <h2 class="font-extrabold text-3xl text-white font-headline">
            {{ t.testimonials.headline }}
          </h2>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-4 px-6 no-scrollbar justify-start md:justify-center md:flex-wrap">
          <a
            v-for="r in liveRestaurants"
            :key="r.slug"
            :href="`/?menu=${r.slug}`"
            class="flex-shrink-0 glass-card rounded-xl px-6 py-4 flex flex-col items-center gap-2 min-w-[120px] hover:border-primary/40 transition-colors border border-white/10"
          >
            <img
              v-if="r.logo_url"
              :src="r.logo_url"
              :alt="r.name"
              class="h-10 w-auto object-contain opacity-80"
            />
            <span class="text-on-surface-variant text-sm font-medium text-center leading-tight">{{ r.name }}</span>
          </a>
        </div>
      </section>

      <!-- ── Signup ───────────────────────────────────────────────────── -->
      <SignupSection />

      <!-- ── Pricing ──────────────────────────────────────────────────── -->
      <section id="precios" class="py-32 relative">
        <div class="max-w-5xl mx-auto px-6">

          <!-- Header -->
          <div class="text-center mb-6 reveal">
            <h2 class="font-extrabold text-4xl lg:text-5xl text-white mb-6 tracking-tighter font-headline">
              {{ t.pricing.headline }}<br/>
              <span class="text-primary italic">{{ t.pricing.headlineAccent }}</span>
            </h2>
            <p class="text-on-surface-variant text-lg font-light max-w-xl mx-auto">{{ t.pricing.sub }}</p>
          </div>

          <!-- Free trial badge -->
          <div class="flex justify-center mb-16 reveal">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold font-headline">
              <span class="material-symbols-outlined" style="font-size: 16px; font-variation-settings: 'FILL' 1;">star</span>
              {{ t.pricing.trialBadge }}
            </div>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

            <!-- Base card -->
            <div class="glass-card rounded-2xl p-10 flex flex-col justify-between reveal reveal-d1">
              <div>
                <div class="flex flex-col gap-3 mb-8">
                  <span class="self-start px-3 py-1 bg-white/5 border border-white/10 text-neutral-400 rounded-full text-xs font-black uppercase tracking-widest font-headline">{{ t.pricing.baseBadge }}</span>
                  <h3 class="font-extrabold text-2xl text-white font-headline">{{ t.pricing.baseTitle }}</h3>
                </div>
                <ul class="space-y-4 mb-10">
                  <li
                    v-for="feature in t.pricing.baseFeatures"
                    :key="feature"
                    class="flex items-center gap-3 text-on-surface-variant text-sm font-light"
                  >
                    <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span class="material-symbols-outlined text-primary" style="font-size: 12px; font-variation-settings: 'FILL' 1;">check</span>
                    </div>
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div>
                <div class="border-t border-white/10 pt-8">
                  <div class="flex items-baseline gap-3 mb-1">
                    <span class="text-3xl font-black text-white font-headline">{{ t.pricing.basePrice }}</span>
                  </div>
                  <div class="text-on-surface-variant text-sm mb-4">{{ t.pricing.baseUsd }}</div>
                  <p class="text-xs text-on-surface-variant/60 font-light">{{ t.pricing.baseFine }}</p>
                </div>
              </div>
            </div>

            <!-- Pro card -->
            <div class="glass-card rounded-2xl p-10 flex flex-col justify-between border border-primary/30 reveal reveal-d2">
              <div>
                <div class="flex flex-col gap-3 mb-8">
                  <div class="flex items-center gap-2">
                    <span class="self-start px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest font-headline">{{ t.pricing.proBadge }}</span>
                    <span class="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-black uppercase tracking-widest font-headline">{{ t.pricing.proRecommended }}</span>
                  </div>
                  <h3 class="font-extrabold text-2xl text-white font-headline">{{ t.pricing.proTitle }}</h3>
                </div>
                <ul class="space-y-4 mb-10">
                  <li
                    v-for="feature in t.pricing.proFeatures"
                    :key="feature"
                    class="flex items-center gap-3 text-on-surface-variant text-sm font-light"
                  >
                    <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span class="material-symbols-outlined text-primary" style="font-size: 12px; font-variation-settings: 'FILL' 1;">check</span>
                    </div>
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div>
                <div class="border-t border-white/10 pt-8">
                  <div class="flex items-baseline gap-3 mb-1">
                    <span class="text-3xl font-black text-white font-headline">{{ t.pricing.proPrice }}</span>
                  </div>
                  <div class="text-on-surface-variant text-sm mb-4">{{ t.pricing.proUsd }}</div>
                  <p class="text-xs text-on-surface-variant/60 font-light">{{ t.pricing.proFine }}</p>
                </div>
              </div>
            </div>

          </div>

          <p class="text-center text-xs text-on-surface-variant/40 font-light mb-16 -mt-10">
            {{ t.pricing.usdNote }}
          </p>

          <!-- DIY callout -->
          <div class="text-center glass-card rounded-2xl p-10 reveal mb-8">
            <h4 class="font-bold text-xl text-white mb-4 font-headline">{{ t.pricing.diyTitle }}</h4>
            <p class="text-on-surface-variant font-light mb-8 max-w-md mx-auto">{{ t.pricing.diyDesc }}</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                :href="WA_URL"
                target="_blank"
                rel="noopener"
                class="bg-primary text-on-primary px-8 py-4 rounded-lg font-extrabold text-base hover:brightness-110 transition-all glow-primary font-headline"
              >{{ t.pricing.diyCtaPrimary }}</a>
              <p class="text-on-surface-variant text-sm font-light max-w-xs">{{ t.pricing.diyCtaSecondary }}</p>
            </div>
          </div>

          <!-- Setup card (one-time service, below DIY) -->
          <div class="glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 reveal">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1 bg-white/5 border border-white/10 text-neutral-400 rounded-full text-xs font-black uppercase tracking-widest font-headline">{{ t.pricing.setupBadge }}</span>
              </div>
              <h4 class="font-bold text-lg text-white mb-1 font-headline">{{ t.pricing.setupTitle }}</h4>
              <p class="text-on-surface-variant text-sm font-light leading-relaxed">{{ t.pricing.setupDesc }}</p>
            </div>
            <div class="shrink-0 text-right">
              <div class="text-xl font-black text-white font-headline">{{ t.pricing.setupPrice }}</div>
              <div class="text-on-surface-variant text-sm">{{ t.pricing.setupUsd }}</div>
              <p class="text-xs text-on-surface-variant/60 font-light mt-1 max-w-[200px]">{{ t.pricing.setupFine }}</p>
            </div>
          </div>

        </div>
      </section>

      <!-- ── Final CTA ──────────────────────────────────────────────────── -->
      <section class="py-32 px-6">
        <div class="max-w-6xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-16 text-center relative overflow-hidden shadow-2xl reveal">
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
    <footer class="bg-[#131313] w-full py-12 px-6 border-t border-white/5">
      <div class="max-w-4xl mx-auto">

        <!-- Top row: logo + nav links -->
        <div class="flex flex-col sm:flex-row sm:items-start gap-8 mb-10">

          <!-- Brand -->
          <div class="flex-1">
            <div class="text-lg font-black text-white tracking-tighter mb-3 font-headline">LWM Admin</div>
            <p class="text-neutral-500 text-sm leading-relaxed font-light max-w-xs">{{ t.footer.tagline }}</p>
          </div>

          <!-- Nav links -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-black text-lime-500 uppercase tracking-widest mb-1 font-headline">{{ t.footer.product }}</span>
            <a class="text-neutral-400 hover:text-white transition-colors text-sm font-medium" href="#caracteristicas">{{ t.footer.features }}</a>
            <a class="text-neutral-400 hover:text-white transition-colors text-sm font-medium" href="#demo">Demo</a>
            <a class="text-neutral-400 hover:text-white transition-colors text-sm font-medium" href="#como-funciona">{{ t.footer.howItWorks }}</a>
            <a class="text-neutral-400 hover:text-white transition-colors text-sm font-medium" href="#precios">{{ t.nav.pricing }}</a>
          </div>
        </div>

        <!-- Bottom bar: copyright + lang toggle -->
        <div class="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-xs text-neutral-600">{{ t.footer.copyright }}</p>
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

/* ── Scroll-reveal ─────────────────────────────────────────────── */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.2s; }
.reveal-d3 { transition-delay: 0.3s; }

/* ── No-scrollbar utility ──────────────────────────────────────── */
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
