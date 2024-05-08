import apehData from '@/assets/apeh.json'
import apwhData from '@/assets/apwh.json'
import { computed, ref, watch } from 'vue'

declare interface Data {
  name: string
  short_name: string
  emoji: string
  concepts: {
    [key: string]: {
      text: string
      examples: string[]
      topics: string[]
      custom: boolean
    }
  }
  topics: {
    [key: string]: {
      name: string
      concepts: string[]
    }
  }
  units: {
    [key: string]: string
  }
  max_unit: number
}

export const datasources = {
  apwh: apwhData,
  apeh: apehData
}

export const datasource = ref<keyof typeof datasources>('apeh')

export const data = computed<Data>(() => {
  return datasources[datasource.value]
})

export const uploadServiceUrl = 'https://apeh-review-backend.azurewebsites.net/api/items/'

watch(datasource, (value) => {
  history.pushState(history.state, '', '?datasource=' + value)
})
