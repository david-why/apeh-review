<script setup lang="ts">
import CompletionCounter from '@/components/CompletionCounter.vue'
import { data } from '@/data'
</script>

<template>
  <div class="header-content">
    <a-button class="logo-btn" type="ghost" @click="$router.push('/')">
      {{ data.emoji }} David's {{ data.short_name }} Review Tree
    </a-button>
    <CompletionCounter></CompletionCounter>
  </div>
</template>

<style scoped>
.header-content {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.65);
}
.logo-btn {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  padding: 0;
  height: fit-content;
  margin-right: 1.5em;
}
</style>
