<script setup lang="ts">
import { data, datasource } from '@/data'
import { breadcrumb, getSetting, getStatus } from '@/store'
import { count, findChildren, findRootConcepts, statusStyle } from '@/utils'
import type { DataNode } from 'ant-design-vue/es/tree'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
const router = useRouter()
const route = useRoute()

const sider = ref<HTMLDivElement>()

const root = computed(findRootConcepts)

const titles = computed(() => {
  const titles: Record<string, string> = {
    home: 'Home',
    concept: 'Concepts',
    topic: 'Topics'
  }
  for (let unit = 1; unit <= data.value.max_unit; unit++) {
    titles[`TP-${unit}`] = `Unit ${unit}. ${data.value.units[unit]}`
  }
  for (const topic of Object.keys(data.value.topics)) {
    titles[`TP-${topic}`] = `${topic}. ${data.value.topics[topic].name}`
  }
  return titles
})

const treeData = computed(() => {
  const tree: DataNode[] = [{ key: 'home', title: 'Home' }]

  function buildTree(node: DataNode) {
    const id = node.key as string
    node.children = node.children || []
    const children = findChildren(id)
    for (const child of children) {
      const childNode: DataNode = {
        key: child,
        title: child + (data.value.concepts[child].custom ? ' (*)' : ''),
        children: [],
        style: statusStyle[getStatus(child)]
      }
      buildTree(childNode)
      node.children.push(childNode)
    }
  }

  const topicNode = { key: 'topic', title: 'Topics', children: [] as DataNode[] }
  let curUnit = 0
  let curNode = null
  for (const topic of Object.keys(data.value.topics).sort((a, b) => {
    const [unitA, topicA] = a.split('.').map(Number)
    const [unitB, topicB] = b.split('.').map(Number)
    return unitA - unitB || topicA - topicB
  })) {
    const unit = topic.split('.').map(Number)[0]
    if (curUnit !== unit || curNode === null) {
      curUnit = unit
      curNode = {
        key: `TP-${unit}`,
        title: `Unit ${unit}. ${data.value.units[unit]}`,
        children: [] as DataNode[]
      }
      // titles[`TP-${unit}`] = `Unit ${unit}`
      topicNode.children.push(curNode)
    }
    curNode.children.push({
      key: `TP-${topic}`,
      title: `${topic}. ${data.value.topics[topic].name}`
    })
    // titles[`TP-${topic}`] = `${topic}. ${data.topics[topic].name}`
  }
  tree.push(topicNode)

  const conceptNode = {
    key: 'concept',
    title: 'Concepts',
    children: [] as DataNode[]
  }
  for (const id of root.value) {
    const node: DataNode = {
      key: id,
      title: id,
      children: [],
      style: statusStyle[getStatus(id)]
    }
    buildTree(node)
    conceptNode.children.push(node)
  }
  tree.push(conceptNode)

  // console.log('rebuild tree', tree)
  return tree
})

const selected = ref(['concept'])
const expanded = ref(['concept', 'topic'])

watch(datasource, () => {
  setTimeout(() => {
    selected.value = ['concept']
    expanded.value = ['concept', 'topic']
    if (getSetting('expandDefault')) {
      expandAll()
    }
  }, 20)
})

function onSelect(selectedKeys: (string | number)[], info: { node: { key: string | number } }) {
  const key = info.node.key
  if (sider.value) {
    const node = document.evaluate(
      `//*[text()="${titles.value[key] || key}" or text()="${key + ' (*)'}"]`,
      sider.value,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
    if (node instanceof HTMLElement) {
      node.scrollIntoView()
    }
  }
  if (typeof key !== 'string') {
    return
  }
  if (!expanded.value.includes(key)) {
    expanded.value = expanded.value.concat([key])
  }
  if (key.startsWith('KC-')) {
    if (route.name === 'concept' && route.params.id === key) {
      return
    }
    if (route.name !== 'concept' || route.params.id !== key) {
      router.push({ name: 'concept', params: { id: key } })
    }
  } else if (key.startsWith('TP-')) {
    const id = key.substring(3)
    if (route.name === 'topic' && route.params.id === id) {
      return
    }
    if (route.name !== 'topic' || route.params.id !== id) {
      router.push({ name: 'topic', params: { id } })
    }
  } else {
    if (route.name !== key || route.params.id) {
      router.push({ name: key })
    }
  }
}

function setSelect(key: string) {
  selected.value = [key]
  onSelect([key], { node: { key } })
}

function expandAll() {
  const nodes: string[] = []
  function expandChildren(node: DataNode) {
    if (node.children) {
      nodes.push(node.key as string)
      for (const child of node.children) {
        expandChildren(child)
      }
    }
  }
  for (const node of treeData.value) {
    expandChildren(node)
  }
  expanded.value = nodes
}

let inAfterEach = false

function beforeEach(to: RouteLocationNormalized) {
  if (inAfterEach) {
    return
  }
  inAfterEach = true
  try {
    if (to.name === 'concept' || to.name === 'topic') {
      breadcrumb.value = [
        { name: 'Home', to: { name: 'home' } },
        {
          name: to.name.substring(0, 1).toUpperCase() + to.name.substring(1) + 's',
          to: to.params.id ? { name: to.name } : undefined
        }
      ]
      if (!to.params.id) {
        setSelect(to.name)
        return
      }
      const current = to.params.id as string
      setSelect(to.name === 'topic' ? `TP-${current}` : current)
      let parent = current
      while (parent.includes('.')) {
        breadcrumb.value.splice(2, 0, {
          name: parent,
          to: parent === current ? undefined : { name: to.name, params: { id: parent } }
        })
        if (!expanded.value.includes(parent)) {
          expanded.value = expanded.value.concat([parent])
        }
        parent = parent.split('.').slice(0, -1).join('.')
      }
      if (to.name === 'topic') {
        breadcrumb.value.splice(2, 0, {
          name: `Unit ${current.split('.')[0]}`,
          to: current.includes('.')
            ? { name: 'topic', params: { id: current.split('.')[0] } }
            : undefined
        })
      }
    } else {
      const name = to.name as string
      breadcrumb.value = [{ name: name.substring(0, 1).toUpperCase() + name.substring(1) }]
      selected.value = [name]
    }
  } finally {
    inAfterEach = false
  }
}

function onKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    console.log('I want to break free')
    if (ev.target && ev.target instanceof HTMLElement) {
      ev.target.blur()
    }
    return
  }
  if (
    // ev.repeat ||
    ev.ctrlKey ||
    ev.metaKey ||
    ev.altKey ||
    ev.shiftKey ||
    ev.target instanceof HTMLInputElement
  ) {
    return
  }
  if (ev.key === 'ArrowUp') {
    const current = selected.value[0]
    if (
      (current.startsWith('KC-') && count(current, '.') > 1) ||
      (current.startsWith('TP-') && current.includes('.'))
    ) {
      const parent = current.split('.').slice(0, -1).join('.')
      setSelect(parent)
    } else if (current.startsWith('KC-')) {
      setSelect('concept')
    } else if (current.startsWith('TP-')) {
      setSelect('topic')
    } else if (current === 'topic' || current === 'concept') {
      setSelect('home')
    }
  } else if (ev.key === 'ArrowDown') {
    const current = selected.value[0]
    if (current.startsWith('KC-')) {
      const children = findChildren(current)
      if (children.length > 0) {
        setSelect(children[0])
      }
    } else if (current.startsWith('TP-') && !current.includes('.')) {
      setSelect(current + '.1')
    } else if (current.startsWith('TP-')) {
      const children = data.value.topics[current.substring(3)].concepts
      if (children.length) {
        setSelect(children[0])
      }
    } else if (current === 'concept') {
      setSelect(root.value[0])
    } else if (current === 'topic') {
      setSelect('TP-1')
    } else if (current === 'home') {
      setSelect('topic')
    }
  } else if (ev.key === 'ArrowRight') {
    const current = selected.value[0]
    if (current.startsWith('TP-')) {
      if (current.includes('.')) {
        const [unit, topic] = current.substring(3).split('.').map(Number)
        const next = `${unit}.${topic + 1}`
        if (data.value.topics[next]) {
          setSelect(`TP-${next}`)
        }
      } else {
        const unit = Number(current.substring(3))
        if (unit + 1 <= data.value.max_unit) {
          setSelect(`TP-${unit + 1}`)
        }
      }
    } else if (current.startsWith('KC-')) {
      const siblings =
        count(current, '.') > 1
          ? findChildren(current.split('.').slice(0, -1).join('.'))
          : root.value
      const idx = siblings.indexOf(current)
      if (idx < siblings.length - 1) {
        setSelect(siblings[idx + 1])
      }
    } else if (current === 'topic') {
      setSelect('concept')
    }
  } else if (ev.key === 'ArrowLeft') {
    const current = selected.value[0]
    if (current.startsWith('TP-')) {
      if (current.includes('.')) {
        const [unit, topic] = current.substring(3).split('.').map(Number)
        const prev = `${unit}.${topic - 1}`
        if (data.value.topics[prev]) {
          setSelect(`TP-${prev}`)
        }
      } else {
        const unit = Number(current.substring(3))
        if (unit - 1 >= 1) {
          setSelect(`TP-${unit - 1}`)
        }
      }
    } else if (current.startsWith('KC-')) {
      const siblings =
        count(current, '.') > 1
          ? findChildren(current.split('.').slice(0, -1).join('.'))
          : root.value
      const idx = siblings.indexOf(current)
      if (idx > 0) {
        setSelect(siblings[idx - 1])
      }
    } else if (current === 'concept') {
      setSelect('topic')
    }
  } else if (ev.key === 'PageUp') {
    router.back()
  } else if (ev.key === 'PageDown') {
    router.forward()
  } else {
    return
  }
  ev.preventDefault()
}

const removeAfterEach = ref()

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  removeAfterEach.value = router.afterEach(beforeEach)
  if (getSetting('expandDefault')) {
    expandAll()
  }
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  removeAfterEach.value()
})
</script>

<template>
  <div class="sider-container" ref="sider">
    <p>
      <a-tree
        :tree-data="treeData"
        v-model:selected-keys="selected"
        v-model:expanded-keys="expanded"
        @select="onSelect"
      ></a-tree>
    </p>
    <p><a-button @click="expandAll">Expand all</a-button></p>
  </div>
</template>

<style scoped>
.sider-container {
  padding: 0.5em;
}
</style>
