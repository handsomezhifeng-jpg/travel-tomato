<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { usePomodoroStore } from '@/stores/pomodoroStore'

onLaunch(() => {
  const store = usePomodoroStore()
  store.initialize()
})
</script>

<style>
page {
  background-color: #1A1A2E;
  color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  height: 100%;
  /* iOS 刘海屏顶部安全区 */
  padding-top: constant(safe-area-inset-top); /* iOS < 11.2 */
  padding-top: env(safe-area-inset-top); /* iOS >= 11.2 */
}

/* 确保 viewport 支持安全区 */
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
