<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div class="py-4 flex justify-center items-center">
    <div class="flex flex-col md:flex-row gap-4 text-xs text-gray-400 text-center">
      <p v-if="appConfig.theme.author">
        Copyright &copy {{ (new Date()).getFullYear() }}

        <a v-if="appConfig.theme.email" :href="`mailto:${appConfig.theme.email}`" class="text-blue-400">{{
          appConfig.theme.author }}</a>
        <span v-else>{{ appConfig.theme.author }}</span>
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
