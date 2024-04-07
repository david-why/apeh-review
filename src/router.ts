import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ConceptView from '@/views/ConceptView.vue'
import TopicView from '@/views/TopicView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/concept/:id?',
      name: 'concept',
      component: ConceptView
    },
    {
      path: '/topic/:id?',
      name: 'topic',
      component: TopicView
    }
  ]
})

export default router
