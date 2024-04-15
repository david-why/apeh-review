<script setup lang="ts">
import { data } from '@/data'
import { getLocalState, type Status } from '@/store'
import { computed } from 'vue'

function count(status: Status) {
  let count = 0
  const state = getLocalState()
  if (!state) {
    return 0
  }
  for (const concept of Object.keys(state)) {
    if (data.value.concepts[concept] && state[concept] === status) {
      count++
    }
  }
  return count
}

const completed = computed(() => {
  return count('reviewed')
})
const total = computed(() => {
  return Object.keys(data.value.concepts).length - count('skipped')
})
const percent = computed(() => {
  completed.value
  if (total.value === 0) {
    return 100
  }
  return Math.floor((completed.value / total.value) * 1000) / 10
})
</script>

<template>
  <span>Reviewed: {{ percent }}% ({{ completed }} of {{ total }})</span>
</template>
