<script setup lang="ts">
import type { NavItem, QueryBuilderParams } from '@nuxt/content/dist/runtime/types'

const flexiMode = useFlexiMode()

const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let articleFolder

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title === 'Article') !== -1) {
  articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
}

const queryCategoryArticlesParams: QueryBuilderParams = {
  limit: 5,
  only: ['title', 'description', '_path', 'cover', 'series', 'seriesOrder', 'tags']
}

const showSeriesModal = ref(false)
const seriesModalName = ref('')
const setSeriesModal = (series) => {
  if (series) {
    seriesModalName.value = series
    showSeriesModal.value = true
  } else {
    seriesModalName.value = ''
    showSeriesModal.value = false
  }
}

watch(showSeriesModal, () => {
  const body = document.body

  if (body && showSeriesModal.value) {
    body.classList.add('modal-open')
  }

  if (body && !showSeriesModal.value) {
    body.classList.remove('modal-open')
  }
})

const indexKeyListener = function (event) {
  if (event.key === 'Escape') {
    setSeriesModal('')
  }
}

onMounted(() => {
  if (document) {
    document.addEventListener('keyup', indexKeyListener)
  }
})

onUnmounted(() => {
  document.removeEventListener('keyup', indexKeyListener)
})
</script>

<template>
  <div>
    <NuxtLayout name="base">
      <div class="container px-8 py-16 mx-auto ">
        <div
          class="p-8 sm:p-16 w-full flex flex-col sm:flex-row justify-between items-center sm:item-start gap-16 rounded-xl"
          :class="flexiMode === 'blog' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'"
        >
          <ContentDoc class="index-page-content-container space-y-8">
            <template #not-found>
              <div class="index-page-content-container space-y-8">
                <h1>
                  Hi
                </h1>
                <p>
                  This website shows blogs and notes.
                </p>
              </div>
            </template>
          </ContentDoc>
          <img src="/avatar.png" alt="avatar" class="hidden sm:block w-28 h-28 rounded-full">
        </div>
      </div>
      <div v-if="articleFolder" class="container p-8 mx-auto space-y-8">
        <template v-for="category in articleFolder.children as NavItem[]">
          <section v-if="category.children" :key="category._path" class="w-full sm:w-4/5 mx-auto space-y-4">
            <div class="flex justify-between items-start">
              <h2
                class="pl-1 font-bold text-lg border-l-8"
                :class="flexiMode === 'blog' ? 'text-purple-500 border-purple-500' : 'text-green-500 border-green-500'"
              >
                {{ category.title }}
              </h2>
              <NuxtLink
                :to="{ path: '/list', query: { category: category.title.toLowerCase() } }"
                class="p-2 text-xs font-bold transition-colors duration-300 rounded-lg"
                :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-100 hover:bg-purple-50 ' : 'text-green-500 bg-green-100 hover:bg-green-50'"
              >
                More
              </NuxtLink>
            </div>
            <div
              class=" scroll-container sm:px-4 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:divide-y
                sm:divide-gray-200"
            >
              <ContentList v-slot="{ list }" :path="category._path" :query="queryCategoryArticlesParams">
                <div
                  v-for="article in list"
                  :key="article._path"
                  class="pb-4 hidden sm:block relative z-10 space-y-2 rounded-xl"
                >
                  <div
                    v-if="article.cover"
                    :style="`background-image: url('/covers/${article.cover}'); `"
                    class="w-1/5 h-[90%] absolute bottom-0 right-0 -z-10 bg-contain bg-right-top bg-no-repeat"
                  >
                    <div
                      class="absolute inset-0"
                      style="background: linear-gradient(30deg, rgba(249,250,251,1) 50%, rgba(249,250,251,0.8) 100%)"
                    />
                  </div>

                  <NuxtLink :to="article._path" class="group block py-4 transition-colors duration-300 space-y-2">
                    <h3
                      class="font-bold text-2xl text-gray-600 group-hover:text-blue-400 transition-colors duration-500"
                    >
                      {{ article.title || "This Post Hasn't Title Yet" }}
                    </h3>
                    <p v-if="article.description" class="text-gray-600">
                      {{ article.description }}
                    </p>
                  </NuxtLink>

                  <div v-if="article.tags" class="grow flex flex-wrap gap-2">
                    <NuxtLink
                      v-for="tag in article.tags"
                      :key="tag"
                      :to="{ path: '/list', query: { tags: [tag] } }"
                      class="px-2 py-1 text-xs text-blue-400 hover:text-blue-500 bg-blue-50 transition-colors duration-300 rounded"
                    >
                      #{{ tag }}
                    </NuxtLink>
                  </div>
                  <button
                    v-if="article.series"
                    class="px-2 py-1 flex justify-center items-center space-x-1 text-green-400 hover:text-green-500 bg-green-50 transition-colors duration-300 rounded"
                    @click="setSeriesModal(article.series)"
                  >
                    <IconCustom name="bi:collection" class="w-4 h-4" />
                    <p class="text-xs">
                      {{ article.series }}
                    </p>
                  </button>
                </div>
                <div
                  v-for="article in list"
                  :key="article._path"
                  class="shrink-0 flex flex-col sm:hidden relative z-10 border border-blue-100 rounded-lg overflow-hidden"
                  :class="list.length >= 2 ? 'w-5/6' : 'w-full'"
                >
                  <div
                    v-if="article.cover"
                    :style="`background-image: url('/covers/${article.cover}'); `"
                    class="w-2/3 h-2/3 absolute bottom-0 right-0 -z-10 bg-contain bg-right-bottom bg-no-repeat"
                  >
                    <div
                      class="absolute inset-0"
                      style="background: linear-gradient(135deg, rgba(249,250,251,1) 60%, rgba(249,250,251,0.8) 80%, rgba(249,250,251,0.6) 100%);"
                    />
                  </div>

                  <NuxtLink
                    :to="article._path"
                    class="grow text-xl p-6 text-gray-600 hover:text-blue-400 transition-colors duration-300 space-y-4"
                  >
                    <h3 class="font-bold">
                      {{ article.title || "This Post Hasn't Title Yet" }}
                    </h3>
                    <p v-if="article.description" class="text-gray-600 text-sm">
                      {{ article.description }}
                    </p>
                  </NuxtLink>
                  <div class="shrink-0 px-6 pb-6 flex justify-between items-start gap-2">
                    <div v-if="article.tags" class="scroll-container grow flex sm:flex-wrap gap-1 overflow-x-auto">
                      <NuxtLink
                        v-for="tag in article.tags"
                        :key="tag"
                        :to="{ path: '/list', query: { tags: [tag, 'HTML'] } }"
                        class="shrink-0 px-2 py-1 text-xs text-blue-400 hover:text-blue-500 bg-blue-50 transition-colors duration-300 rounded"
                      >
                        #{{ tag }}
                      </NuxtLink>
                    </div>
                    <button
                      v-if="article.series"
                      class="shrink-0 px-2 py-1 flex justify-center items-center text-green-400 hover:text-green-500 bg-green-50 transition-colors duration-300 rounded"
                      @click="setSeriesModal(article.series)"
                    >
                      <IconCustom name="bi:collection" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ContentList>
            </div>
          </section>
        </template>
      </div>
    </NuxtLayout>
    <SeriesModal v-if="showSeriesModal && seriesModalName" :series="seriesModalName" @close="setSeriesModal('')" />
  </div>
</template>

<style lang="scss">
.index-page-content-container {
  h1 {
    @apply font-bold text-5xl;
  }

  p {
    @apply text-2xl opacity-50;
  }
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.modal-open {
  overflow: hidden;
}
</style>
