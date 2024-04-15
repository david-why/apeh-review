<script setup lang="ts">
import { data, datasource, datasources } from '@/data'
import { getLocalState, getSetting, setLocalState, setSetting } from '@/store'
import { notification } from 'ant-design-vue'
import { computed, ref } from 'vue'

const firstTopic = computed(() => Object.keys(data.value.topics)[0])
const firstConcept = computed(() => Object.keys(data.value.concepts)[0])

const resetModalOpen = ref(false)
const proSwitch = computed({
  get: () => getSetting('proSwitch'),
  set: (value) => setSetting('proSwitch', value)
})
const expandDefault = computed({
  get: () => getSetting('expandDefault'),
  set: (value) => setSetting('expandDefault', value)
})

function exportProgress() {
  const state = JSON.stringify(getLocalState())
  const blob = new Blob([state], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = data.value.short_name.toLowerCase() + '-review-tree-progress.json'
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
  <a-radio-group v-model:value="datasource">
    <a-radio-button v-for="(value, key) in datasources" :key="key" :value="key">
      {{ value.emoji }} {{ value.short_name }}
    </a-radio-button>
  </a-radio-group>
  <h1>Welcome to {{ data.short_name }} Review Tree!</h1>
  <p>
    This is a website to help you review for your {{ data.name }} exam. Most of the content here is
    taken directly from the AP Course and Exam Description (CED), so you don't need to worry about
    false information.
  </p>
  <p>The website is organized into two major sections: Topics and Concepts.</p>
  <h2>Topics</h2>
  <p>
    Topics are what you often see in your textbook, for example "{{ firstTopic }}
    {{ data.topics[firstTopic].name }}". Most people study by topics, so this is a good place to
    start.
  </p>
  <p>Go to <router-link to="/topic">Topics</router-link> to begin!</p>
  <h2>Concepts</h2>
  <p>
    Concepts are less well-known than topics. They are called "Key Concepts" in the CED, and
    basically, thet are everything that you need to know for the exam. For example, "{{
      firstConcept
    }}
    {{ data.concepts[firstConcept].text }}" is a concept.
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
  <p>
    <a-space wrap>
      <a-button @click="exportProgress">Export</a-button>
      <a-button @click="importProgress">Import</a-button>
      <a-button @click="resetModalOpen = true" danger>Reset</a-button>
    </a-space>
  </p>
  <h2>Pro zone</h2>
  <p>If you're a pro, turn on the switch below to access the pro zone.</p>
  <p>
    <a-space>
      <a-switch id="isProUser" v-model:checked="proSwitch"></a-switch>
      <label for="isProUser">I'm a pro, show me the pro stuff!</label>
    </a-space>
  </p>
  <template v-if="proSwitch">
    <h2>What is a "child" and "parent"?</h2>
    <p>
      When you see the words "child", "children", and "parent" on this website, they don't literally
      mean a child, like, a human person. You can think of this child-parent relationship as files
      in a folder. Each "parent" is like a folder that contains a bunch of files called "children".
    </p>
    <p>
      For example, units (like Unit 1. Renaissance and Exploration) are "parents" of topics that
      they contain (like 1.1 Contextualizing Renaissance and Discovery), and topics are "parents" of
      the concepts in the topic (like KC-1.1.I).
    </p>
    <h2>Keyboard shortcuts</h2>
    <p>You can navigate this website with keyboard shortcuts only. Here's how this works:</p>
    <ul>
      <li><kbd>↑</kbd>: Go to the parent of the current item.</li>
      <li>
        <kbd>↓</kbd>: Go to the first child of the current item. For concepts this is the children
        concepts, for units the topics, and for topics the concepts within them.
      </li>
      <li>
        <kbd>←</kbd>, <kbd>→</kbd>: Go to the previous and next items on the same level,
        respectively.
      </li>
      <li>
        <kbd>PageUp</kbd>, <kbd>PageDown</kbd>: Go to the previous and next pages in the browsing
        history.
      </li>
      <li>
        <kbd>n</kbd>, <kbd>s</kbd>, <kbd>f</kbd>, <kbd>d</kbd>: Marks the current concept as None,
        Skipped, Flagged, and Done, respectively. (<kbd>r</kbd> for "Reviewed" is a synonym to
        <kbd>d</kbd>.)
      </li>
    </ul>
    <h2>Settings</h2>
    <a-space>
      <a-switch id="expandDefault" v-model:checked="expandDefault"></a-switch>
      <label for="expandDefault">Expand all items by default</label>
    </a-space>
  </template>
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

<style scoped>
kbd {
  background-color: #f0f0f0;
  border-radius: 3px;
  padding: 0.1em 0.3em;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  font-family: monospace;
  font-size: 0.9em;
  color: #333;
}
</style>
