<script setup lang="ts">
import { getStatus, setStatus } from '@/store'
import { findChildren, findRootConcepts, getData, statusStyle } from '@/utils'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const data = getData()

const options = [
  { label: '⬜ None', value: 'not-started' },
  { label: '⏭ Skip', value: 'skipped' },
  { label: '🚩 Flag', value: 'flagged' },
  { label: '✅ Done', value: 'reviewed' }
]
const shortOptions = options.map(({ label, value }) => ({ label: label.substring(0, 2), value }))

const id = route.params.id as string

const concept = computed(() => data.concepts[id])
const children = computed(() => findChildren(id))

const status = computed({
  get: () => getStatus(id),
  set: (val) => {
    setStatus(id, val)
  }
})

function onKeyDown(ev: KeyboardEvent) {
  if (
    !id ||
    ev.repeat ||
    ev.ctrlKey ||
    ev.metaKey ||
    ev.altKey ||
    ev.shiftKey ||
    ev.target instanceof HTMLInputElement
  ) {
    return
  }
  if (ev.key === 'n') {
    setStatus(id, 'not-started')
  } else if (ev.key === 's') {
    setStatus(id, 'skipped')
  } else if (ev.key === 'f') {
    setStatus(id, 'flagged')
  } else if (ev.key === 'r') {
    setStatus(id, 'reviewed')
  } else {
    return
  }
  ev.preventDefault()
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <template v-if="id">
    <h1>Concept {{ id }}</h1>
    <p>
      <a-radio-group v-model:value="status">
        <a-radio-button v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </a-radio-button>
      </a-radio-group>
    </p>
    <p v-if="concept.custom">
      <i>
        This concept is NOT official content taken from the APEH CED; rather, it was summarized from
        the contents of its children.
      </i>
    </p>
    <p>{{ concept.text }}</p>
    <template v-if="concept.examples.length !== 0">
      <h2>Examples</h2>
      <a-list :data-source="concept.examples" size="small">
        <template #renderItem="{ index, item }">
          <a-list-item>
            <a-space>
              <a-select
                :value="getStatus(id + ':' + index)"
                :options="shortOptions"
                @select="setStatus(id + ':' + index, $event)"
                class="status-select"
                v-if="!item.endsWith(':')"
              ></a-select>
              <span :style="statusStyle[getStatus(id + ':' + index)]">{{ item }}</span>
            </a-space>
          </a-list-item>
        </template>
      </a-list>
    </template>
    <template v-if="children.length !== 0">
      <h2>Children</h2>
      <a-list :data-source="children" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <router-link :to="{ name: 'concept', params: { id: item } }">{{ item }}.</router-link>
            {{ data.concepts[item].text }}
          </a-list-item>
        </template>
      </a-list>
    </template>
    <template v-if="concept.topics.length !== 0">
      <h2>Topics</h2>
      <a-list :data-source="concept.topics" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <router-link :to="{ name: 'topic', params: { id: item } }">
              {{ item }}. {{ data.topics[item].name }}
            </router-link>
          </a-list-item>
        </template>
      </a-list>
    </template>
  </template>
  <template v-else>
    <h1>Concepts</h1>
    <p>
      These are the "Key Concepts" of the APEH course. These are usually not found directly in
      textbooks; however, they can be found in the CED.
    </p>
    <p>
      The concepts are naturally organized in a tree structure by their identifiers (KC-1.1.II, for
      example). Each concept might have "children" concepts, which are more specific concepts that
      are related to it.
    </p>
    <p>You can navigate the sidebar to browse all the concepts in the APEH CED.</p>
    <a-list :data-source="findRootConcepts()" size="small">
      <template #renderItem="{ item }">
        <a-list-item>
          <router-link :to="{ name: 'concept', params: { id: item } }"> {{ item }}. </router-link>
          {{ data.concepts[item].text }}
        </a-list-item>
      </template>
    </a-list>
  </template>
</template>

<style scoped>
.status-select {
  width: 70px;
}
</style>
