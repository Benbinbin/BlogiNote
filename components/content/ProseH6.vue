<template>
  <h6 :id="id">
    <NuxtLink :href="`#${id}`">
      <slot />
    </NuxtLink>
  </h6>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
