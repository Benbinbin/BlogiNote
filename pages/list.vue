<script setup lang="ts">
import type { NavItem, ParsedContent } from '@nuxt/content/dist/runtime/types'

interface MyCustomParsedContent extends ParsedContent {
  tags: string[]
}

const route = useRoute()

/**
 *
 * category filter
 *
 */
const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let articleFolder

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title.toLowerCase() === 'article') !== -1) {
  articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
}

const currentCategory = ref(route.query.category as string || 'all')
const showMoreCategory = ref(false)

const setCategory = (value) => {
  currentTags.value = []
  currentSeries.value = 'all'
  currentCategory.value = value
}

/**
 *
 * tag and series filter
 *
 */
const showMoreFilter = ref(false)

let tagSet, seriesSet

const tagArr = []
const seriesArr = []

interface ArrayObject {
  [key: string]: string[]
}

const categoryTags: ArrayObject = {}
const categorySeries: ArrayObject = {}

if (articleFolder && articleFolder.children.length > 0) {
  for (const category of articleFolder.children as NavItem[]) {
    const { data } = await useAsyncData(`${category.title}-tags`, () => queryContent<MyCustomParsedContent>('article', category.title.toLowerCase()).only(['tags', 'series']).find())

    const categoryTagsArr = []
    const categorySeriesArr = []
    data.value.forEach((item) => {
      if (item.tags) {
        categoryTagsArr.push(...item.tags)
        tagArr.push(...item.tags)
      }
      if (item.series) {
        categorySeriesArr.push(item.series)
        seriesArr.push(item.series)
      }
    })

    categoryTags[category.title.toLowerCase()] = [...new Set(categoryTagsArr)]
    categorySeries[category.title.toLowerCase()] = [...new Set(categorySeriesArr)]
  }

  tagSet = new Set(tagArr)
  seriesSet = new Set(seriesArr)
}

const currentTags = ref([])

if (typeof route.query.tags === 'string') {
  currentTags.value = [route.query.tags]
} else if (Array.isArray(route.query.tags)) {
  currentTags.value = route.query.tags
}

const toggleTag = (tag) => {
  if (tag === 'all') {
    currentTags.value = []
    return
  }

  if (currentTags.value.length > 0) {
    const index = currentTags.value.findIndex(element => element === tag)
    if (index !== -1) {
      currentTags.value.splice(index, 1)
    } else {
      currentTags.value.push(tag)
    }
  } else {
    currentTags.value.push(tag)
  }
}

const currentSeries = ref(route.query.series as string || 'all')

const showMoreTag = ref(false)
const showMoreSeries = ref(false)

watch([currentCategory, currentTags, currentSeries], () => {
  navigateTo({
    path: '/list',
    query: {
      category: currentCategory.value,
      tags: currentTags.value,
      series: currentSeries.value
    }
  })
}, {
  deep: true
})

/**
 *
 * query article list
 *
 */

function getArticleList () {
  let contentQuery

  if (route.query.category && route.query.category !== 'all') {
    contentQuery = queryContent('article', route.query.category as string)
  } else {
    contentQuery = queryContent('article')
  }

  if (route.query.tags) {
    let tags = []
    if (typeof route.query.tags === 'string') {
      tags = [route.query.tags]
    } else if (Array.isArray(route.query.tags)) {
      tags = route.query.tags
    }

    if (tags.length > 0) {
      contentQuery.where({ tags: { $in: tags } })
    }
  }

  if (route.query.series && route.query.series !== 'all') {
    contentQuery.where({ series: { $eq: route.query.series } })
  }

  contentQuery.only(['title', 'description', '_path', 'contentType', 'cover', 'series', 'seriesOrder', 'tags'])

  return contentQuery.find()
}

const { pending, data: result, refresh } = await useAsyncData('articles', () => getArticleList())

watch(() => route.fullPath, () => {
  if (route.path !== '/list') { return }
  refresh()
}, {
  immediate: true
})

/**
 *
 * show article list detail
 */
const showListDetail = useShowListDetail()

</script>

<template>
  <div>
    <NuxtLayout name="base">
      <div class="shrink-0 px-4 sm:px-8 py-4 space-y-4 sm:sticky top-0 inset-x-0 z-10 bg-gray-50">
        <div class="flex items-start sm:space-x-2">
          <button
            class="shrink-0 p-2.5 hidden sm:flex justify-center items-center transition-colors duration-300 rounded"
            :class="showMoreFilter ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
            @click="showMoreFilter = !showMoreFilter"
          >
            <IconCustom name="mdi:filter-plus-outline" class="w-6 h-6" />
          </button>
          <div class="grow max-w-full space-y-2 ">
            <div class="p-2 flex items-start text-sm bg-gray-100 sm:space-x-4">
              <button
                class="shrink-0 px-2 py-1 hidden sm:flex items-center text-gray-500 hover:bg-gray-200 rounded"
                @click="showMoreCategory = !showMoreCategory"
              >
                <IconCustom
                  name="ic:round-keyboard-arrow-right"
                  class="w-5 h-5 transition-transform duration-300"
                  :class="showMoreCategory ? 'rotate-90' : 'rotate-0'"
                />
                <p>
                  Category
                </p>
              </button>
              <p class="px-2 py-1 sm:hidden">
                Category
              </p>
              <ul v-if="articleFolder" class="filter-list-container" :class="showMoreCategory ? 'max-h-96' : 'max-h-8'">
                <li>
                  <button
                    class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded"
                    :class="currentCategory === 'all' ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                    @click="setCategory('all')"
                  >
                    <IconCustom name="material-symbols:category-rounded" class="w-5 h-5" />
                    <p>all</p>
                  </button>
                </li>
                <template v-for="category in articleFolder.children as NavItem[]">
                  <li v-if="category.children" :key="category._path">
                    <button
                      class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded"
                      :class="currentCategory === category.title.toLowerCase() ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                      @click="setCategory(category.title.toLowerCase())"
                    >
                      <IconCustom name="material-symbols:category-rounded" class="w-5 h-5" />
                      <p>
                        {{ category.title.toLowerCase() }}
                      </p>
                    </button>
                  </li>
                </template>
              </ul>
            </div>

            <Transition
              enter-from-class="-translate-y-8 opacity-0"
              enter-active-class="transition-all duration-300 ease-out"
              enter-to-class="translate-y-0 opacity-100"
              leave-from-class="translate-y-0 opacity-100"
              leave-active-class="transition-all duration-100 ease-in"
              leave-to-class="-translate-y-8 opacity-0"
            >
              <div v-show="showMoreFilter" class="space-y-2">
                <div class="p-2 flex items-start text-sm bg-gray-100 rounded sm:space-x-4">
                  <button
                    class="shrink-0 px-2 py-1 hidden sm:flex items-center text-gray-500 hover:bg-gray-200 rounded"
                    @click="showMoreTag = !showMoreTag"
                  >
                    <IconCustom
                      name="ic:round-keyboard-arrow-right"
                      class="w-5 h-5 transition-transform duration-300"
                      :class="showMoreTag ? 'rotate-90' : 'rotate-0'"
                    />
                    <p>
                      Tags
                    </p>
                  </button>
                  <p class="px-2 py-1 sm:hidden">
                    Tags
                  </p>
                  <ul v-if="tagSet" class="filter-list-container" :class="showMoreTag ? 'max-h-96' : 'max-h-8'">
                    <li v-for="tag in ['all', ...tagSet as string[]]" :key="tag">
                      <button
                        class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded disabled:opacity-30"
                        :class="(currentTags.length === 0 && tag === 'all') || currentTags.includes(tag) ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                        :disabled="(tag === 'all' || currentCategory === 'all' || categoryTags[currentCategory].includes(tag)) ? false : true"
                        @click="toggleTag(tag)"
                      >
                        <p>#{{ tag }}</p>
                      </button>
                    </li>
                  </ul>
                </div>
                <div class="p-2 flex items-start text-sm bg-gray-100 rounded sm:space-x-4">
                  <button
                    class="shrink-0 px-2 py-1 hidden sm:flex items-center text-gray-500 hover:bg-gray-200 rounded"
                    @click="showMoreSeries = !showMoreSeries"
                  >
                    <IconCustom
                      name="ic:round-keyboard-arrow-right"
                      class="w-5 h-5 transition-transform duration-300"
                      :class="showMoreSeries ? 'rotate-90' : 'rotate-0'"
                    />
                    <p>
                      Series
                    </p>
                  </button>
                  <p class="px-2 py-1 sm:hidden">
                    Series
                  </p>
                  <ul v-if="seriesSet" class="filter-list-container" :class="showMoreSeries ? 'max-h-96' : 'max-h-8'">
                    <li v-for="series in ['all', ...seriesSet as string[]]" :key="series">
                      <button
                        class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded disabled:opacity-30"
                        :class="currentSeries === series ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                        :disabled="(series === 'all' || currentCategory === 'all' || categorySeries[currentCategory].includes(series)) ? false : true"
                        @click="currentSeries = series"
                      >
                        <IconCustom name="bi:collection" class="w-5 h-5" />
                        <p>{{ series }}</p>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </Transition>

            <div class="flex items-center space-x-2">
              <button
                class="px-4 py-1 sm:hidden text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-300 rounded"
                @click="setCategory('all')"
              >
                <IconCustom name="ant-design:clear-outlined" class="w-4 h-4" />
              </button>
              <button
                class="grow py-1 sm:hidden text-purple-500 bg-purple-100 rounded"
                @click="showMoreFilter = !showMoreFilter"
              >
                <IconCustom v-show="!showMoreFilter" name="ic:round-keyboard-arrow-down" class="w-4 h-4" />
                <IconCustom v-show="showMoreFilter" name="ic:round-keyboard-arrow-up" class="w-4 h-4" />
              </button>
              <button
                class="px-4 py-1 sm:hidden transition-colors duration-300 rounded"
                :class="showListDetail ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 hover:text-green-500 bg-green-50 hover:bg-green-100'"
                @click="showListDetail = !showListDetail"
              >
                <IconCustom v-show="showListDetail" name="ic:round-unfold-less" class="w-4 h-4" />
                <IconCustom v-show="!showListDetail" name="ic:round-unfold-more" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <hr>
      </div>

      <div class="shrink-0 mx-4 sm:mx-8 hidden sm:flex justify-between items-center text-sm">
        <button
          class="p-2 flex items-center text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-300 rounded"
          @click="setCategory('all')"
        >
          <IconCustom name="ant-design:clear-outlined" class="w-5 h-5" />
          <p class="hidden sm:block">
            Clear Filter
          </p>
        </button>
        <button
          class="p-2 flex items-center transition-colors duration-300 rounded"
          :class="showListDetail ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 hover:text-green-500 bg-green-50 hover:bg-green-100'"
          @click="showListDetail = !showListDetail"
        >
          <IconCustom v-show="showListDetail" name="ic:round-unfold-less" class="w-5 h-5" />
          <IconCustom v-show="!showListDetail" name="ic:round-unfold-more" class="w-5 h-5" />
          <p class="hidden sm:block">
            {{ showListDetail ? 'Less' : 'More' }} Detail
          </p>
        </button>
      </div>

      <div v-if="pending" class="grow flex flex-col justify-center items-center space-y-2 text-gray-400">
        <IconCustom name="eos-icons:loading" class="w-10 h-10" />
        <p class="text-xl">
          Loading
        </p>
      </div>
      <div v-if="!pending && result" class="grow container p-4 sm:p-8 mx-auto space-y-4">
        <ul
          :class="showListDetail ? 'space-y-2' : 'grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2'"
        >
          <li v-for="item in result as ParsedContent" :key="item._path" class="space-y-2">
            <NuxtLink
              :to="item._path"
              class="block px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded-lg space-y-2"
            >
              <div class="flex items-start">
                <IconCustom
                  :name="(!item.contentType || item.contentType === 'blog') ? 'ant-design:file-markdown-filled' : 'bi:filetype-json'"
                  class="shrink-0 p-1 w-6 h-6 sm:w-7 sm:h-7"
                />
                <h2 class="grow font-bold text-base sm:text-lg">
                  {{ item.title }}
                </h2>
              </div>
              <p v-show="showListDetail && item.description" class="px-6 text-sm opacity-60">
                {{ item.description }}
              </p>
            </NuxtLink>
            <div v-if="item.tags || item.series" v-show="showListDetail" class="px-10 flex flex-wrap gap-2 text-xs">
              <button
                v-for="tag in item.tags"
                :key="tag"
                class="px-2 py-1  transition-colors duration-300 rounded"
                :class="(currentTags.length === 0 && tag === 'all') || currentTags.includes(tag) ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-blue-400 hover:text-blue-500 bg-blue-100'"
                @click="toggleTag(tag)"
              >
                #{{ tag }}
              </button>
              <button
                v-if="item.series"
                class="px-2 py-1 flex justify-center items-center space-x-1 transition-colors duration-300 rounded"
                :class="currentSeries === item.series ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 hover:text-green-500 bg-green-100'"
                @click="currentSeries = item.series"
              >
                <IconCustom name="bi:collection" class="w-4 h-4" />
                <p>{{ item.series }}</p>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">

.filter-list-container {
  @apply grow flex sm:flex-wrap gap-2 overflow-x-auto sm:overflow-x-visible sm:overflow-y-hidden transition-all duration-300
}

.filter-list-container::-webkit-scrollbar {
  display: none;
}
</style>
