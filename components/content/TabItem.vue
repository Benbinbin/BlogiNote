<script setup lang="ts">
const props = defineProps({
  name: {
    default: 'Tab',
    type: String
  }
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>

</style>
