<script setup lang="ts">
const props = defineProps<{
  catalogs: CatalogItem[]
}>()

interface CatalogItem {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItem[]
}


</script>

<template>
  <div />
</template>

<style scoped>

</style>