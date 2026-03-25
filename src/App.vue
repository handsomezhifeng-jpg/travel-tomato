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
</style>
