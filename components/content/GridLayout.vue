<script setup lang="ts">
const props = defineProps<{
  gridClass?: string
}>()
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="px-6 py-8 max-w-full" :class="props.gridClass ? props.gridClass : 'grid-container'">
      <ContentSlot :use="$slots.default" unwrap="p" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  justify-content: center;
}
</style>
