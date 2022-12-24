<script setup lang="ts">

const props = defineProps<{
  article: any
}>()

const getCoverUrl = (relativeURL:string) => {
  if (relativeURL.startsWith('./')) {
    const articleFolderPathArr = props.article._path.split('/').slice(0, -1)
    const imagePathArr = relativeURL.split('/').slice(1)

    return [...articleFolderPathArr, ...imagePathArr].join('/')
  } else {
    return relativeURL
  }
}
</script>

<template>
  <div
    class="pb-4 relative z-10 space-y-2 rounded-xl"
  >
    <div
      v-if="props.article.cover"
      :style="`background-image: url('${getCoverUrl(props.article.cover)}')`"
      class="w-1/5 h-[90%] absolute bottom-0 right-0 -z-10 bg-contain bg-right-top bg-no-repeat"
    >
      <div
        class="absolute inset-0"
        style="background: linear-gradient(135deg, rgba(249,250,251,1) 40%, rgba(249,250,251,0.6) 80%, rgba(249,250,251,0.9) 100%)"
      />
    </div>

    <NuxtLink :to="props.article._path" class="group block py-4 transition-colors duration-300 space-y-2">
      <h3 class="font-bold text-2xl text-gray-600 group-hover:text-blue-400 transition-colors duration-500">
        {{ props.article.title || "This Post Hasn't Title Yet" }}
      </h3>
      <p v-if="props.article.description" class="text-gray-600">
        {{ props.article.description }}
      </p>
    </NuxtLink>

    <div v-if="props.article.tags" class="grow flex flex-wrap gap-2">
      <NuxtLink
        v-for="tag in props.article.tags"
        :key="tag"
        :to="{ path: '/list', query: { tags: [tag] } }"
        class="px-2 py-1 text-xs text-blue-400 hover:text-blue-500 bg-blue-50 transition-colors duration-300 rounded"
      >
        #{{ tag }}
      </NuxtLink>
    </div>
    <NuxtLink
      v-if="props.article.series"
      :to="{ path: '/list', query: { series: props.article.series } }"
      class="w-fit px-2 py-1 flex justify-center items-center space-x-1 text-green-400 hover:text-green-500 bg-green-50 transition-colors duration-300 rounded"
    >
      <IconCustom name="bi:collection" class="w-4 h-4" />
      <p class="text-xs">
        {{ props.article.series }}
      </p>
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>
