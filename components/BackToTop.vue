<script setup lang="ts">
const clickHandler = () => {
  if (document && document.documentElement && document.documentElement.scrollTop) { document.documentElement.scrollTop = 0 }

  if (document && document.body.scrollTop) { document.body.scrollTop = 0 }
}
</script>

<template>
  <button
    class="p-3 sm:p-2 flex justify-center items-center fixed z-40 bottom-20 sm:bottom-4 right-2 sm:right-4 text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 transition-colors duration-300 rounded-lg"
    @click="clickHandler"
  >
    <IconCustom
      name="material-symbols:keyboard-arrow-up-rounded"
      class="w-5 h-5"
    />
  </button>
</template>

<style scoped>
</style>
