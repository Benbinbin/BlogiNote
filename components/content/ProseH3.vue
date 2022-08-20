<script setup lang="ts">
defineProps<{ id: string }>()

const flexiMode = useFlexiMode()
</script>

<template>
  <h3 :id="id">
    <a v-if="flexiMode==='blog'" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
