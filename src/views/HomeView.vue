<script setup lang="ts">
import { getLocalState, setLocalState } from '@/store'

function exportProgress() {
  const data = JSON.stringify(getLocalState())
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'apeh-review-tree-progress.json'
  a.click()
  URL.revokeObjectURL(url)
}

function importProgress() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (ev) => {
    const file = (ev.target as HTMLInputElement).files?.[0]
    if (!file) {
      return
    }
    const data = await file.text()
    const state = JSON.parse(data)
    setLocalState(state)
    alert('Progress imported successfully!')
  }
  input.click()
}
</script>

<template>
  <h1>Welcome to APEH Review Tree!</h1>
  <p>Use the sidebar to the left to get started!</p>
  <p>(More description and help is coming soon)</p>
  <a-space>
    <a-button @click="exportProgress">Export progress</a-button>
    <a-button @click="importProgress">Import progress</a-button>
  </a-space>
</template>
