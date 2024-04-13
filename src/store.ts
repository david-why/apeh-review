import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const breadcrumb = ref([] as { name: string; to?: RouteLocationRaw }[])

export declare type Status = 'not-started' | 'skipped' | 'flagged' | 'reviewed'

const localState = JSON.parse(localStorage.getItem('apeh-review-state') || '{}')

const stateCounter = ref(0)

export function getLocalState() {
  stateCounter.value
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
  stateCounter.value
  return localState[id] || 'not-started'
}

export function setStatus(id: string, status: Status) {
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
