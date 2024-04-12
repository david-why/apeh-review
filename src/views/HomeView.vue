<script setup lang="ts">
import { getLocalState, setLocalState } from '@/store'
import { notification } from 'ant-design-vue'
import { ref } from 'vue'

const resetModalOpen = ref(false)

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
    notification.info({ message: 'Progress imported successfully!' })
  }
  input.click()
}

function resetProgress() {
  resetModalOpen.value = false
  setLocalState({})
  notification.info({ message: 'Progress reset successfully!' })
}
</script>

<template>
  <h1>Welcome to APEH Review Tree!</h1>
  <p>
    This is a website to help you review for your AP European History exam. Most of the content here
    is taken directly from the AP Course and Exam Description (CED), so you don't need to worry
    about false information.
  </p>
  <p>The website is organized into two major sections: Topics and Concepts.</p>
  <h2>Topics</h2>
  <p>
    Topics are what you often see in your textbook, for example "1.1 Contextualizing Renaissance and
    Discovery". Most people study by topics, so this is a good place to start.
  </p>
  <p>Go to <router-link to="/topic">Topics</router-link> to begin!</p>
  <h2>Concepts</h2>
  <p>
    Concepts are less well-known than topics. They are called "Key Concepts" in the CED, and
    basically, thet are everything that you need to know for the exam. For example, "KC-1.1.I A
    revival of classical texts led to new methods of scholarship and new values in both society and
    religion." is a concept.
  </p>
  <p>
    Some concepts have "Illustrative Examples" in the CED to go with them. These are also included
    on this website.
  </p>
  <p>Go to <router-link to="/concept">Concepts</router-link> to begin!</p>
  <h2>Saving your progress</h2>
  <p>
    On this website, you can save your progress by changing the status of each concept and example.
    This will be saved locally in your browser, so you can come back and continue your review later.
  </p>
  <p>
    If you want to export your progress to another device, you can do so by clicking the "Export"
    button below. You can then import the progress on another device by clicking the "Import"
    button.
  </p>
  <a-space wrap>
    <a-button @click="exportProgress">Export</a-button>
    <a-button @click="importProgress">Import</a-button>
    <a-button @click="resetModalOpen = true" danger>Reset</a-button>
  </a-space>
  <a-modal
    v-model:open="resetModalOpen"
    title="Are you sure you want to reset your progress?"
    centered
    @ok="resetProgress"
  >
    <p>This process cannot be reversed!</p>
  </a-modal>
  <!-- <h2>AP Courses</h2>
  <p>🌏 APWH : AP World History</p>
  <p>🌍 APEH : AP European History</p>
  <p>🌎 APUSH : AP United States History</p> -->
</template>
