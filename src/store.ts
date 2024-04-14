import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const breadcrumb = ref([] as { name: string; to?: RouteLocationRaw }[])

export declare type Status = 'not-started' | 'skipped' | 'flagged' | 'reviewed'

const localState = JSON.parse(localStorage.getItem('apeh-review-state') || '{}')

const stateCounter = ref(0)

const curVersion = 2
const conv: Record<string, string>[] = [
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
]

export function getLocalState(): Record<string, Status> {
  stateCounter.value
  const version = localState.version || 0
  if (localState.version !== curVersion) {
    for (let i = version; i < curVersion; i++) {
      for (const key in conv[i]) {
        if (localState[key] !== undefined) {
          localState[conv[i][key]] = localState[key]
          delete localState[key]
        }
      }
    }
    localState.version = curVersion
  }
  return localState
}

export function setLocalState(state: Record<string, Status>) {
  Object.keys(localState).forEach((key) => {
    delete localState[key]
  })
  Object.assign(localState, state)
  localStorage.setItem('apeh-review-state', JSON.stringify(localState))
  stateCounter.value++
}

export function getStatus(id: string): Status {
  return getLocalState()[id] || 'not-started'
}

export function setStatus(id: string, status: Status) {
  const localState = getLocalState()
  localState[id] = status
  localStorage.setItem('apeh-review-state', JSON.stringify(localState))
  stateCounter.value++
}

declare interface Settings {
  proSwitch: boolean
  expandDefault: boolean
}

const settingsCounter = ref(0)

export function getSettings() {
  settingsCounter.value
  return JSON.parse(localStorage.getItem('apeh-review-settings') || '{}')
}

export function setSettings(settings: Record<string, any>) {
  localStorage.setItem('apeh-review-settings', JSON.stringify(settings))
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
