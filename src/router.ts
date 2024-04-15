import ConceptView from '@/views/ConceptView.vue'
import HomeView from '@/views/HomeView.vue'
import TopicView from '@/views/TopicView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

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
  ],
  scrollBehavior() {
    const el = document.getElementById('main-content')
    if (el) {
      el.scrollTo(0, 0)
    }
  }
})

export default router
