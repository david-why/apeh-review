import { ref } from 'vue'

export const breadcrumb = ref([] as string[])

export declare type Status = 'not-started' | 'skipped' | 'flagged' | 'reviewed'

const localState = JSON.parse(localStorage.getItem('apeh-review-state') || '{}')

const stateCounter = ref(0)

export function getLocalState() {
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
