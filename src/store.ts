import { data, datasource, datasources } from '@/data'
import { ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const breadcrumb = ref([] as { name: string; to?: RouteLocationRaw }[])

export declare type Status = 'not-started' | 'skipped' | 'flagged' | 'reviewed'

const curVersion: Record<keyof typeof datasources, number> = {
  apeh: 2,
  apwh: 0
}
const conv: Record<keyof typeof datasources, Record<string, string>[]> = {
  apeh: [
    {
      'KC-3.1.III:1': 'KC-3.2.IV.B:13',
      'KC-3.1.III:2': 'KC-3.2.IV.B:14',
      'KC-3.1.III:3': 'KC-3.2.IV.B:15',
      'KC-3.1.III:4': 'KC-3.2.IV.B:16',
      'KC-3.1.III:5': 'KC-3.2.IV.B:17'
    },
    {
      'KC-3.1.III.B:6': 'KC-3.1.III.B:11',
      'KC-3.1.III.B:7': 'KC-3.1.III.B:12',
      'KC-3.1.III.B:1': 'KC-3.1.III.B:6',
      'KC-3.1.III.B:2': 'KC-3.1.III.B:7',
      'KC-3.1.III.B:3': 'KC-3.1.III.B:8',
      'KC-3.1.III.B:4': 'KC-3.1.III.B:9',
      'KC-3.1.III.B:5': 'KC-3.1.III.B:10',
      'KC-3.2.IV.B:8': 'KC-3.1.III.B:1',
      'KC-3.2.IV.B:9': 'KC-3.1.III.B:2',
      'KC-3.2.IV.B:10': 'KC-3.1.III.B:3',
      'KC-3.2.IV.B:11': 'KC-3.1.III.B:4',
      'KC-3.2.IV.B:13': 'KC-3.2.IV.B:8',
      'KC-3.2.IV.B:14': 'KC-3.2.IV.B:9',
      'KC-3.2.IV.B:15': 'KC-3.2.IV.B:10',
      'KC-3.2.IV.B:16': 'KC-3.2.IV.B:11',
      'KC-3.2.IV.B:17': 'KC-3.2.IV.B:12'
    }
  ],
  apwh: []
}

const localState = JSON.parse(
  localStorage.getItem(data.value.short_name.toLowerCase() + '-review-state') ||
    JSON.stringify({ version: curVersion[datasource.value] })
)

watch(data, () => {
  Object.keys(localState).forEach((key) => {
    delete localState[key]
  })
  Object.assign(
    localState,
    JSON.parse(
      localStorage.getItem(data.value.short_name.toLowerCase() + '-review-state') ||
        JSON.stringify({ version: curVersion[datasource.value] })
    )
  )
})

const stateCounter = ref(0)

export function getLocalState(): Record<string, Status> {
  stateCounter.value
  const version = localState.version || 0
  if (localState.version !== curVersion[datasource.value]) {
    for (let i = version; i < curVersion[datasource.value]; i++) {
      for (const key in conv[datasource.value][i]) {
        if (localState[key] !== undefined) {
          localState[conv[datasource.value][i][key]] = localState[key]
          delete localState[key]
        }
      }
    }
    localState.version = curVersion[datasource.value]
  }
  return localState
}

export function setLocalState(state: Record<string, Status>) {
  Object.keys(localState).forEach((key) => {
    delete localState[key]
  })
  Object.assign(localState, state)
  localStorage.setItem(data.value.short_name.toLowerCase().toLowerCase() + '-review-state', JSON.stringify(localState))
  stateCounter.value++
}

export function getStatus(id: string): Status {
  return getLocalState()[id] || 'not-started'
}

export function setStatus(id: string, status: Status) {
  const localState = getLocalState()
  localState[id] = status
  localStorage.setItem(data.value.short_name.toLowerCase() + '-review-state', JSON.stringify(localState))
  stateCounter.value++
}

declare interface Settings {
  proSwitch: boolean
  expandDefault: boolean
}

const settingsCounter = ref(0)

export function getSettings() {
  settingsCounter.value
  return JSON.parse(localStorage.getItem(data.value.short_name.toLowerCase() + '-review-settings') || '{}')
}

export function setSettings(settings: Record<string, any>) {
  localStorage.setItem(data.value.short_name.toLowerCase() + '-review-settings', JSON.stringify(settings))
  settingsCounter.value++
}

export function getSetting<T extends keyof Settings>(key: T): Settings[T] {
  return getSettings()[key]
}

export function setSetting<T extends keyof Settings>(key: T, value: Settings[T]) {
  const settings = getSettings()
  settings[key] = value
  setSettings(settings)
}
