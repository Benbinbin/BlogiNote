<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div class="py-4 flex justify-center items-center">
    <div class="flex flex-col md:flex-row gap-4 text-xs text-gray-400 text-center">
      <p v-if="appConfig.bloginote.author">
        Copyright &copy {{ (new Date()).getFullYear() }}

        <a
          v-if="appConfig.bloginote.email"
          :href="`mailto:${appConfig.bloginote.email}`"
          class="text-blue-400"
        >{{
          appConfig.bloginote.author }}</a>
        <span v-else>{{ appConfig.bloginote.author }}</span>
      </p>
      <p>
        Theme <a
          href="https://github.com/Benbinbin/BlogiNote"
          target="_blank"
          class="text-blue-400"
        >BlogiNote</a>
      </p>
      <p>
        Icons from <a
          href="https://icones.js.org/"
          target="_blank"
          class="text-blue-400"
        >Icônes</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
