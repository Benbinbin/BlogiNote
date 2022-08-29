<script setup lang="ts">
// const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <div class="py-4 flex justify-center items-center">
    <div class="flex flex-col md:flex-row gap-4 text-xs text-gray-400 text-center">
      <p v-if="$theme.value?.author">
        Copyright &copy {{ (new Date()).getFullYear() }}

        <a v-if="$theme.value?.email" :href="`mailto:${$theme.value.email}`" class="text-blue-400">{{
          $theme.value.author }}</a>
        <span v-else>{{ $theme.value.author }}</span>
      </p>
      <p>
        blog theme <a href="https://github.com/Benbinbin/BlogiNote" target="_blank" class="text-blue-400">BlogiNote</a>
      </p>
      <p>
        Icons from <a href="https://icones.js.org/" target="_blank" class="text-blue-400">Icônes</a>, <a
          href="https://icons8.com/"
          target="_blank"
          class="text-blue-400"
        >Icons8</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
