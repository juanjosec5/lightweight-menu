type GtagFn = (cmd: 'event', name: string, params: Record<string, unknown>) => void

export function getGtag(): GtagFn | null {
  const w = window as unknown as { gtag?: GtagFn }
  return typeof w.gtag === 'function' ? w.gtag : null
}
