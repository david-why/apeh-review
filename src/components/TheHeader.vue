<script setup lang="ts">
// import { computed } from 'vue'
// import { useRouter } from 'vue-router'
// const router = useRouter()

// const selectedKeys = computed({
//   get: () => [router.currentRoute.value.name as string],
//   set: (val) => {
//     router.push({ name: val[0] })
//   }
// })
</script>

<template>
  <div class="header-content">
    <div class="logo-container">
      <a-button class="logo-btn" type="ghost" @click="$router.push('/')">
        🌍 David's APEH Review Tree
      </a-button>
    </div>
    <!-- <a-menu v-model:selected-keys="selectedKeys" theme="dark" mode="horizontal">
      <a-menu-item key="home">Home</a-menu-item>
      <a-menu-item key="concept">Concepts</a-menu-item>
      <a-menu-item key="topic">Topics</a-menu-item>
    </a-menu> -->
  </div>
</template>

<style scoped>
.header-content {
  height: 100%;
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.65);
}
.logo-container {
  float: left;
  display: flex;
  align-items: center;
  height: 100%;
}
.logo-btn {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  padding: 0;
  height: fit-content;
  margin-right: 1.5em;
}
</style>
