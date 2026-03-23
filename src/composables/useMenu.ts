import { ref, watch, type Ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { MenuData } from '@/types/menu'

export function useMenu(slug: Ref<string | null>) {
  const data = ref<MenuData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(id: string) {
    loading.value = true
    error.value = null
    data.value = null

    const { data: result, error: err } = await supabase
      .from('restaurants')
      .select(`
        *,
        menus(*, categories(*, items(*, item_labels(*)))),
        restaurant_locations(*),
        social_links(*)
      `)
      .eq('slug', id)
      .eq('is_published', true)
      .order('sort_order', { referencedTable: 'menus' })
      .order('sort_order', { referencedTable: 'social_links' })
      .single()

    if (err || !result) {
      error.value = err?.code === 'PGRST116' ? 'Menú no encontrado' : (err?.message ?? 'Error al cargar el menú')
    } else {
      document.title = result.name
      // Sort nested resources that can't be ordered via referencedTable (too deep)
      result.menus?.forEach((m: any) => {
        m.categories?.sort((a: any, b: any) => a.sort_order - b.sort_order)
        m.categories?.forEach((c: any) => {
          c.items?.sort((a: any, b: any) => a.sort_order - b.sort_order)
        })
      })
      data.value = result as unknown as MenuData
    }

    loading.value = false
  }

  watch(slug, (id) => {
    if (id) load(id)
    else { data.value = null; error.value = null }
  }, { immediate: true })

  return { data, loading, error }
}
