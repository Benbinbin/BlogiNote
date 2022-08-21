<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import fileTypeMap from '@/utils/fileType.json'

const flexiMode = useFlexiMode()

const queryBuilder = queryContent().where({ _path: { $contains: '/article' } })
const { data } = await useAsyncData('articleFolder', () => fetchContentNavigation(queryBuilder))

/**
 *
 * note mode
 * data in a tree structure
 *
 */
const articleFolder = data.value[0]
const currentTree = ref([])
currentTree.value = articleFolder.children

let folderNavPath = []

const folderNavArr = ref([
  {
    title: 'Root',
    path: []
  }
])

const setTreeHandler = (path, type = 'drill-down') => {
  if (type === 'drill-down') {
    folderNavPath = folderNavPath.concat(path)
  } else if (type === 'reset') {
    folderNavPath = path
  }

  let treeTemp = articleFolder.children

  const folderNavArrTemp = [
    {
      title: 'Root',
      path: []
    }
  ]
  let folderNavPathTemp = []

  if (folderNavPath.length > 0) {
    folderNavPath.forEach((index) => {
      folderNavPathTemp = folderNavPathTemp.concat(index)
      folderNavArrTemp.push({
        title: treeTemp[index].title,
        path: folderNavPathTemp
      })
      treeTemp = treeTemp[index].children
    })
  }

  currentTree.value = treeTemp
  folderNavArr.value = folderNavArrTemp
}

/**
 *
 * blog mode
 * fetch 5 articles to show in home page
 *
 */
const queryCategoryArticlesParams: QueryBuilderParams = {
  limit: 5,
  only: ['title', 'description', '_type', '_path', 'cover', 'series', 'seriesOrder', 'tags']
}

const getFileTypeIcon = (type) => {
  const fileType = fileTypeMap[type]

  if (!fileType) {
    return fileTypeMap.default.iconName
  } else {
    return fileType.iconName
  }
}
</script>

<template>
  <div>
    <Head>
      <Title>Home</Title>
    </Head>
    <NuxtLayout name="base">
      <div v-show="flexiMode === 'blog'" class="container px-8 mx-auto">
        <div class="py-16">
          <div
            class="p-8 sm:p-16 w-full flex flex-col sm:flex-row justify-between items-center sm:item-start gap-16 rounded-xl bg-purple-100 text-purple-600"
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
        <div v-if="articleFolder" class="py-8 space-y-8">
          <template v-for="category in articleFolder.children">
            <section v-if="category.children" :key="category._path" class="w-full sm:w-4/5 mx-auto space-y-4">
              <div class="flex justify-between items-start">
                <h2 class="pl-1 font-bold text-lg border-l-8 text-purple-500 border-purple-500">
                  {{ category.title }}
                </h2>
                <NuxtLink
                  :to="{ path: '/list', query: { category: category.title.toLowerCase() } }"
                  class="p-2 text-xs font-bold transition-colors duration-300 rounded-lg text-purple-500 bg-purple-100 hover:bg-purple-50"
                >
                  More
                </NuxtLink>
              </div>
              <div
                class="scroll-container sm:px-4 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:divide-y
                sm:divide-gray-200"
              >
                <ContentList :path="category._path" :query="queryCategoryArticlesParams">
                  <template #default="{ list }">
                    <template v-for="article in list">
                      <div
                        v-if="article._type==='markdown'"
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
                            style="background: linear-gradient(135deg, rgba(249,250,251,1) 40%, rgba(249,250,251,0.6) 80%, rgba(249,250,251,0.9) 100%)"
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
                        <NuxtLink
                          v-if="article.series"
                          :to="{ path: '/list', query: { series: article.series } }"
                          class="w-fit px-2 py-1 flex justify-center items-center space-x-1 text-green-400 hover:text-green-500 bg-green-50 transition-colors duration-300 rounded"
                        >
                          <IconCustom name="bi:collection" class="w-4 h-4" />
                          <p class="text-xs">
                            {{ article.series }}
                          </p>
                        </NuxtLink>
                      </div>
                      <div
                        v-if="article._type==='markdown'"
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
                          <div
                            v-if="article.tags"
                            class="scroll-container grow flex sm:flex-wrap gap-1 overflow-x-auto"
                          >
                            <NuxtLink
                              v-for="tag in article.tags"
                              :key="tag"
                              :to="{ path: '/list', query: { tags: [tag, 'HTML'] } }"
                              class="shrink-0 px-2 py-1 text-xs text-blue-400 hover:text-blue-500 bg-blue-50 transition-colors duration-300 rounded"
                            >
                              #{{ tag }}
                            </NuxtLink>
                          </div>
                          <NuxtLink
                            v-if="article.series"
                            :to="{ path: '/list', query: { series: article.series } }"
                            class="shrink-0 px-2 py-1 flex justify-center items-center text-green-400 hover:text-green-500 bg-green-50 transition-colors duration-300 rounded"
                          >
                            <IconCustom name="bi:collection" class="w-4 h-4" />
                          </NuxtLink>
                        </div>
                      </div>
                    </template>
                  </template>

                  <template #not-found>
                    <p>No articles found.</p>
                  </template>
                </ContentList>
              </div>
            </section>
          </template>
        </div>
      </div>
      <div
        v-if="articleFolder && articleFolder.children.length > 0"
        v-show="flexiMode === 'note'"
        class="container px-8 mx-auto"
      >
        <div class="flex py-8 justify-between">
          <div class="folder-nav-container flex sm:flex-wrap items-center gap-1 overflow-x-auto">
            <IconCustom name="ph:folder-open-fill" class="shrink-0 w-6 h-6 text-yellow-400" />
            <div
              v-for="(folder, index) in folderNavArr"
              :key="folderNavArr.length>1 ? folder.path.join() : 'root'"
              class="shrink-0 flex items-center gap-1"
            >
              <button
                class="p-2 hover:text-green-500 active:text-white hover:bg-green-100 active:bg-green-500 rounded-md transition-colors duration-300"
                @click="setTreeHandler(folder.path, 'reset')"
              >
                {{ folder.title }}
              </button>
              <span v-if="index+1 < folderNavArr.length" class="text-gray-400">></span>
            </div>
          </div>
        </div>
        <hr class="p-4">
        <div
          class="folders-container w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-col-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 grid-flow-row-dense"
        >
          <template v-for="(item, index) in currentTree">
            <NuxtLink
              v-if="item._type"
              :key="item._path"
              :to="item._path"
              target="_blank"
              class="self-start px-4 py-2 flex items-center gap-1 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded-lg"
            >
              <IconCustom :name="getFileTypeIcon(item._type)" class="w-6 h-6" />
              {{ item.title }}
            </NuxtLink>
            <FolderTree
              v-if="item.children"
              :key="item._path"
              :root-name="item.title"
              :root-tree="item.children"
              :root-index="index"
              @set-tree="setTreeHandler"
            />
          </template>
        </div>
      </div>
    </NuxtLayout>
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

.folders-container {
  grid-auto-rows: 40px
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.folder-nav-container::-webkit-scrollbar {
  display: none;
}
</style>
