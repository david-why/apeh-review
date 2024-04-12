<script setup lang="ts">
import { getData, findTopics, findUnits } from '@/utils'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const data = getData()

const id = route.params.id as string
const topic = computed(() => data.topics[id])
</script>

<template>
  <template v-if="id && id.includes('.')">
    <h1>Topic {{ id }}. {{ topic.name }}</h1>
    <h2>Concepts</h2>
    <a-list :data-source="topic.concepts" size="small">
      <template #renderItem="{ item }">
        <a-list-item>
          <router-link :to="{ name: 'concept', params: { id: item } }">{{ item }}.</router-link>
          {{ data.concepts[item].text }}
        </a-list-item>
      </template>
    </a-list>
  </template>
  <template v-else-if="id">
    <h1>Unit {{ id }}. {{ data.units[id] }}</h1>
    <a-list :data-source="findTopics(Number(id))" size="small">
      <template #renderItem="{ item }">
        <a-list-item>
          <router-link :to="{ name: 'topic', params: { id: item } }">
            {{ item }}. {{ data.topics[item].name }}
          </router-link>
        </a-list-item>
      </template>
    </a-list>
  </template>
  <template v-else>
    <h1>Topics</h1>
    <p>
      These are the units and topics in the APEH curriculum. Most textbooks, including the CED, are
      organized via these topics.
    </p>
    <p>You can use the sidebar to select a unit/topic to view the concepts within them.</p>
    <a-list :data-source="findUnits()" size="small">
      <template #renderItem="{ item }">
        <a-list-item>
          <router-link :to="{ name: 'topic', params: { id: item } }">
            Unit {{ item }}. {{ data.units[item] }}
          </router-link>
        </a-list-item>
      </template>
    </a-list>
  </template>
</template>
