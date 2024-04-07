<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheSider from '@/components/TheSider.vue'
import { breadcrumb } from '@/store'
</script>

<template>
  <!-- <div class="content">
    <header class="header"><the-header></the-header></header>
    <aside class="sidebar"></aside>
    <main class="main"><router-view :key="$route.fullPath"></router-view></main>
  </div> -->
  <a-layout class="layout">
    <a-layout-header class="header"><TheHeader></TheHeader></a-layout-header>
    <a-layout>
      <a-layout-sider width="300" class="scroll sidebar"><TheSider></TheSider></a-layout-sider>
      <a-layout-content class="scroll content">
        <a-layout class="content-layout">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item v-for="item in breadcrumb" :key="item">{{ item }}</a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout-content class="main">
            <router-view :key="$route.fullPath"></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
    <!-- <a-layout-footer class="footer">Created with ❤️ by David</a-layout-footer> -->
  </a-layout>
</template>

<style scoped>
.scroll {
  overflow-y: auto;
}
.header {
}
.sidebar {
  background: #fff;
}
.content {
}
.content-layout {
  padding: 0 1.5em 1.5em;
}
.breadcrumb {
  margin: 1em 0;
}
.main {
  background: #fff;
  padding: 1.5em;
  min-height: 280px;
}
.footer {
  background: #00152920;
  padding: 1em;
  text-align: center;
}
@media (min-width: 1024px) {
  .layout {
    overflow-y: hidden;
    height: 100vh;
  }
}
</style>
