import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Auto-scale page content to fit any viewport without scrolling.
 *
 * Problem: UniApp rpx scales with screen WIDTH. In landscape the width is large,
 * inflating all vertical dimensions beyond the short height → overflow.
 *
 * Solution: The inner container is sized to hold all content (height = max of
 * viewport height and estimated content height at current rpx). Then the whole
 * thing is scaled down uniformly to fit within safe margins. Content is centered.
 *
 * @param contentRpx - estimated total content height in rpx (default 800)
 */
export function usePageScale(contentRpx = 800) {
  const scale = ref(1)
  const innerW = ref(375)
  const innerH = ref(812)

  function recalc() {
    const info = uni.getSystemInfoSync()
    const w = info.windowWidth
    const h = info.windowHeight
    const rpxToPx = w / 750
    const contentPx = contentRpx * rpxToPx

    innerW.value = w
    // Inner must be tall enough for content at current rpx sizing
    innerH.value = Math.max(h, contentPx)

    // Smaller margins in landscape to maximize usable space
    const isLandscape = w > h
    const m = isLandscape ? 20 : 40

    const sw = (w - m * 2) / innerW.value
    const sh = (h - m * 2) / innerH.value
    scale.value = Math.min(sw, sh)
  }

  onMounted(() => {
    recalc()
    try { uni.onWindowResize(recalc) } catch (e) {}
  })

  onUnmounted(() => {
    try { uni.offWindowResize(recalc) } catch (e) {}
  })

  const scaleStyle = computed(() => ({
    width: innerW.value + 'px',
    height: innerH.value + 'px',
    transform: `scale(${scale.value})`,
    transformOrigin: 'center center',
  }))

  return { scaleStyle, recalc }
}
