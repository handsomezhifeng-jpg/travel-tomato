import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PomodoroRecord, CurrentCity, CityCandidate, VisitedCity } from '@/types'
import * as storage from '@/utils/storage'

export const usePomodoroStore = defineStore('pomodoro', () => {
  // ====== 状态 ======
  const currentCity = ref<CurrentCity | null>(null)
  const recentRecords = ref<PomodoroRecord[]>([])

  // ====== 计算属性 ======
  const isFirstUse = computed(() => currentCity.value === null)

  const totalStats = computed(() => storage.getTotalStats())

  // ====== 初始化 ======
  function initialize() {
    currentCity.value = storage.getCurrentCity()
    recentRecords.value = storage.getAllRecords().slice(-20)
  }

  // ====== 设置出发城市 ======
  function setOriginCity(city: CurrentCity) {
    currentCity.value = city
    storage.setCurrentCity(city)
  }

  // ====== 完成番茄钟 ======
  function completePomodoro(record: PomodoroRecord) {
    storage.addRecord(record)
    recentRecords.value.push(record)

    // 目的地自动成为新的出发城市
    const newCity: CurrentCity = {
      name: record.destCity,
      country: record.destCountry,
      coord: record.destCoord,
      arrivedAt: new Date().toISOString(),
    }
    currentCity.value = newCity
    storage.setCurrentCity(newCity)
  }

  // ====== 获取已到访城市 ======
  function getVisitedCities(): VisitedCity[] {
    return storage.getVisitedCities()
  }

  return {
    currentCity,
    recentRecords,
    isFirstUse,
    totalStats,
    initialize,
    setOriginCity,
    completePomodoro,
    getVisitedCities,
  }
})
