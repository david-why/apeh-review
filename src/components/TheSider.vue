<script setup lang="ts">
import { breadcrumb, getStatus } from '@/store'
import { count, findChildren, findRootConcepts, getData, statusStyle } from '@/utils'
import type { DataNode } from 'ant-design-vue/es/tree'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
const router = useRouter()
const route = useRoute()

const sider = ref<HTMLDivElement>()

const data = getData()
const root = findRootConcepts()

const titles: Record<string, string> = {
  home: 'Home',
  concept: 'Concepts',
  topic: 'Topics'
}

for (let unit = 1; unit <= data.max_unit; unit++) {
  titles[`TP-${unit}`] = `Unit ${unit}`
}
for (const topic of Object.keys(data.topics)) {
  titles[`TP-${topic}`] = `${topic}. ${data.topics[topic].name}`
}

const treeData = computed(() => {
  const tree: DataNode[] = [{ key: 'home', title: 'Home' }]

  function buildTree(node: DataNode) {
    const id = node.key as string
    node.children = node.children || []
    const children = findChildren(id)
    for (const child of children) {
      const childNode: DataNode = {
        key: child,
        title: child + (data.concepts[child].custom ? ' (*)' : ''),
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
  for (const topic of Object.keys(data.topics).sort((a, b) => {
    const [unitA, topicA] = a.split('.').map(Number)
    const [unitB, topicB] = b.split('.').map(Number)
    return unitA - unitB || topicA - topicB
  })) {
    const unit = topic.split('.').map(Number)[0]
    if (curUnit !== unit || curNode === null) {
      curUnit = unit
      curNode = { key: `TP-${unit}`, title: `Unit ${unit}`, children: [] as DataNode[] }
      // titles[`TP-${unit}`] = `Unit ${unit}`
      topicNode.children.push(curNode)
    }
    curNode.children.push({ key: `TP-${topic}`, title: `${topic}. ${data.topics[topic].name}` })
    // titles[`TP-${topic}`] = `${topic}. ${data.topics[topic].name}`
  }
  tree.push(topicNode)

  const conceptNode = {
    key: 'concept',
    title: 'Concepts',
    children: [] as DataNode[]
  }
  for (const id of root) {
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

function onSelect(selectedKeys: (string | number)[], info: { node: { key: string | number } }) {
  if (sider.value) {
    const node = document.evaluate(
      `//*[text()="${titles[info.node.key] || info.node.key}"]`,
      sider.value,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
    if (node instanceof HTMLElement) {
      node.scrollIntoView()
    }
  }
  const key = info.node.key
  if (typeof key !== 'string') {
    return
  }
  if (key.startsWith('KC-')) {
    if (!expanded.value.includes(key)) {
      expanded.value = expanded.value.concat([key])
    }
    if (route.name === 'concept' && route.params.id === key) {
      return
    }
    router.push({ name: 'concept', params: { id: key } })
  } else if (key.startsWith('TP-')) {
    if (!expanded.value.includes(key)) {
      expanded.value = expanded.value.concat([key])
    }
    const id = key.substring(3)
    if (route.name === 'topic' && route.params.id === id) {
      return
    }
    router.push({ name: 'topic', params: { id } })
  } else {
    router.push({ name: key })
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

function afterEach(to: RouteLocationNormalized) {
  // console.log('beforeEach', to)
  if (inAfterEach) {
    return
  }
  inAfterEach = true
  try {
    if (to.name === 'concept' || to.name === 'topic') {
      breadcrumb.value = [
        'Home',
        to.name.substring(0, 1).toUpperCase() + to.name.substring(1) + 's'
      ]
      if (!to.params.id) {
        return
      }
      const current = to.params.id as string
      setSelect(to.name === 'topic' ? `TP-${current}` : current)
      let parent = current
      while (parent.includes('.')) {
        breadcrumb.value.splice(2, 0, parent)
        if (!expanded.value.includes(parent)) {
          expanded.value = expanded.value.concat([parent])
        }
        parent = parent.split('.').slice(0, -1).join('.')
      }
      if (to.name === 'topic') {
        breadcrumb.value.splice(2, 0, `Unit ${current.split('.')[0]}`)
      }
    } else {
      const name = to.name as string
      breadcrumb.value = [name.substring(0, 1).toUpperCase() + name.substring(1)]
      selected.value = [name]
    }
  } finally {
    inAfterEach = false
  }
}

router.afterEach(afterEach)

function onKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    console.log('I want to break free')
    if (ev.target && ev.target instanceof HTMLElement) {
      ev.target.blur()
    }
    return
  }
  if (
    ev.repeat ||
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
      ev.preventDefault()
      const parent = current.split('.').slice(0, -1).join('.')
      setSelect(parent)
      return
    } else if (current.startsWith('KC-')) {
      ev.preventDefault()
      setSelect('concept')
      return
    } else if (current.startsWith('TP-')) {
      ev.preventDefault()
      setSelect('topic')
      return
    } else if (current === 'topic' || current === 'concept') {
      ev.preventDefault()
      setSelect('home')
      return
    }
  } else if (ev.key === 'ArrowDown') {
    const current = selected.value[0]
    if (current.startsWith('KC-')) {
      const children = findChildren(current)
      if (children.length > 0) {
        ev.preventDefault()
        setSelect(children[0])
        return
      }
    } else if (current.startsWith('TP-') && !current.includes('.')) {
      ev.preventDefault()
      setSelect(current + '.1')
      return
    } else if (current.startsWith('TP-')) {
      const children = data.topics[current.substring(3)].concepts
      if (children.length) {
        ev.preventDefault()
        setSelect(children[0])
        return
      }
    } else if (current === 'concept') {
      ev.preventDefault()
      setSelect(root[0])
      return
    } else if (current === 'topic') {
      ev.preventDefault()
      setSelect('TP-1')
      return
    } else if (current === 'home') {
      ev.preventDefault()
      setSelect('topic')
      return
    }
  } else if (ev.key === 'ArrowRight') {
    const current = selected.value[0]
    if (current.startsWith('TP-')) {
      if (current.includes('.')) {
        const [unit, topic] = current.substring(3).split('.').map(Number)
        const next = `${unit}.${topic + 1}`
        if (data.topics[next]) {
          ev.preventDefault()
          setSelect(`TP-${next}`)
          return
        }
      } else {
        const unit = Number(current.substring(3))
        if (unit + 1 <= data.max_unit) {
          ev.preventDefault()
          setSelect(`TP-${unit + 1}`)
          return
        }
      }
    } else if (current.startsWith('KC-')) {
      const siblings =
        count(current, '.') > 1 ? findChildren(current.split('.').slice(0, -1).join('.')) : root
      const idx = siblings.indexOf(current)
      if (idx < siblings.length - 1) {
        ev.preventDefault()
        setSelect(siblings[idx + 1])
        return
      }
    } else if (current === 'topic') {
      ev.preventDefault()
      setSelect('concept')
      return
    }
  } else if (ev.key === 'ArrowLeft') {
    const current = selected.value[0]
    if (current.startsWith('TP-')) {
      if (current.includes('.')) {
        const [unit, topic] = current.substring(3).split('.').map(Number)
        const prev = `${unit}.${topic - 1}`
        if (data.topics[prev]) {
          ev.preventDefault()
          setSelect(`TP-${prev}`)
          return
        }
      } else {
        const unit = Number(current.substring(3))
        if (unit - 1 >= 1) {
          ev.preventDefault()
          setSelect(`TP-${unit - 1}`)
          return
        }
      }
    } else if (current.startsWith('KC-')) {
      const siblings =
        count(current, '.') > 1 ? findChildren(current.split('.').slice(0, -1).join('.')) : root
      const idx = siblings.indexOf(current)
      if (idx > 0) {
        ev.preventDefault()
        setSelect(siblings[idx - 1])
        return
      }
    } else if (current === 'concept') {
      ev.preventDefault()
      setSelect('topic')
      return
    }
  } else if (ev.key === 'PageUp') {
    ev.preventDefault()
    router.back()
  } else if (ev.key === 'PageDown') {
    ev.preventDefault()
    router.forward()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="sider-container" ref="sider">
    <p><a-button @click="expandAll">Expand all</a-button></p>
    <p>
      <a-tree
        :tree-data="treeData"
        v-model:selected-keys="selected"
        v-model:expanded-keys="expanded"
        @select="onSelect"
      ></a-tree>
    </p>
  </div>
</template>

<style scoped>
.sider-container {
  padding: 0.5em;
}
</style>
