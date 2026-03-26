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
  width: 100%;
  overflow: hidden;
}

/* Global auto-scale wrapper styles */
.page-outer {
  width: 100%;
  height: 100%;
  background: #1A1A2E;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.page-inner {
  display: flex;
  flex-direction: column;
  background: #1A1A2E;
  padding-top: max(100px, env(safe-area-inset-top));
  padding-bottom: max(80px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  /* NO overflow:hidden here — content must render fully before scale shrinks it */
}
</style>
