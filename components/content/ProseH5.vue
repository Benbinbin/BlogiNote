<template>
  <h5 :id="id">
    <NuxtLink :href="`#${id}`">
      <slot />
    </NuxtLink>
  </h5>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
