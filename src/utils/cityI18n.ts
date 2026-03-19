import { useLang } from './i18n'
import g1 from '@/data/city-i18n-group1.json'
import g2 from '@/data/city-i18n-group2.json'
import g3 from '@/data/city-i18n-group3.json'

type I18nEntry = { tagline: Record<string, string>; description: Record<string, string> }

// 启动时合并三组翻译数据
const i18nData: Record<string, I18nEntry> = {}

function initData() {
  for (const group of [g1, g2, g3]) {
    for (const [key, val] of Object.entries(group as Record<string, any>)) {
      if (!i18nData[key]) {
        i18nData[key] = { tagline: {}, description: {} }
      }
      if (val.tagline) Object.assign(i18nData[key].tagline, val.tagline)
      if (val.description) Object.assign(i18nData[key].description, val.description)
    }
  }
}
initData()

function getCityKey(name: string, country: string): string {
  return `${name}_${country}`
}

/** 获取城市 tagline 的翻译 */
export function cityTagline(city: { name: string; country: string; tagline: string }): string {
  const { currentLang } = useLang()
  const lang = currentLang.value

  if (lang === 'zh') return city.tagline

  const key = getCityKey(city.name, city.country)
  const entry = i18nData[key]
  if (entry?.tagline?.[lang]) return entry.tagline[lang]
  if (entry?.tagline?.['en']) return entry.tagline['en']
  return city.tagline
}

/** 获取城市 description 的翻译 */
export function cityDescription(city: { name: string; country: string; description: string }): string {
  const { currentLang } = useLang()
  const lang = currentLang.value

  if (lang === 'zh') return city.description

  const key = getCityKey(city.name, city.country)
  const entry = i18nData[key]
  if (entry?.description?.[lang]) return entry.description[lang]
  if (entry?.description?.['en']) return entry.description['en']
  return city.description
}
