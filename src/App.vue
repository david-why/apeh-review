<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheSider from '@/components/TheSider.vue'
import { breadcrumb } from '@/store'
</script>

<template>
  <a-layout class="layout">
    <a-layout-header class="header"><TheHeader></TheHeader></a-layout-header>
    <a-layout>
      <a-layout-sider width="300" class="scroll sidebar"><TheSider></TheSider></a-layout-sider>
      <a-layout-content id="main-content" class="scroll content">
        <a-layout class="content-layout">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item
              v-for="item in breadcrumb"
              :key="item.name"
              :href="item.to ? 'javascript:void(0)' : undefined"
              @click="item.to && $router.push(item.to)"
              >{{ item.name }}</a-breadcrumb-item
            >
          </a-breadcrumb>
          <a-layout-content class="main">
            <router-view :key="$route.fullPath"></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.scroll {
  overflow-y: auto;
}
.header {
  height: 56px;
  line-height: 56px;
}
.sidebar {
  background: #fff;
}
.content-layout {
  padding: 0 0 1em 1em;
}
.breadcrumb {
  margin: 1em 0;
}
.main {
  background: #fff;
  padding: 1em;
  min-height: 280px;
}
.footer {
  background: #00152920;
  padding: 1em;
  text-align: center;
}
.layout {
  overflow-y: hidden;
  height: 100vh;
}
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>
