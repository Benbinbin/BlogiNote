<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: ''
  },
  blank: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- <a :href="href">
    <slot />
  </a> -->

  <NuxtLink :href="href">
    <slot />
  </NuxtLink>
</template>
