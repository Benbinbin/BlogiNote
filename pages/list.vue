<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

interface MyCustomParsedContent extends ParsedContent {
  tags: string[]
}

const route = useRoute()

/**
 *
 * build the theme filter options
 *
 */
// the fetchContentNavigation() composable seems not work with queryBuilder argument at latest @nuxt/content version
// https://github.com/nuxt/content/issues/1399
// need to use where method to build a more complex queryBuilder
// const queryBuilder = queryContent().where({ _path: { $contains: '/article' } })
// const { data: articleArr } = await useAsyncData('articleFolder', () => fetchContentNavigation(queryBuilder))

const { data: navTree } = await useAsyncData('rootFolder', () => fetchContentNavigation())

// const articleFolder = articleArr.value[0]

let articleFolder
const themeArr = []

if (Array.isArray(navTree.value)) {
  articleFolder = navTree.value.find(item => item._path === '/article')

  if (articleFolder?.children && articleFolder.children.length > 0) {
    articleFolder.children.forEach((item) => {
      if ('children' in item) {
        themeArr.push(item)
      }
    })
  }
}

const getTheme = (path = '') => {
  let theme = ''
  const pathArr = path.split('/')

  if (pathArr.length === 3 && pathArr[1] === 'article') {
    theme = pathArr[2]
  }

  return theme
}

const currentTheme = ref('all')
const showMoreTheme = ref(false)

const toggleTheme = (theme) => {
  if (currentTheme.value === theme) {
    currentTheme.value = 'all'
  } else {
    currentTheme.value = theme
  }
  currentTags.value = []
  currentSeries.value = 'all'

  changeURLHash()
}

/**
 *
 * build the tag and series filter options
 *
 */
const showMoreFilter = ref(true)

let tagSet, seriesSet

const tagArr = []
const seriesArr = []

interface ArrayObject {
  [key: string]: string[]
}

const themeTags: ArrayObject = {}
const themeSeries: ArrayObject = {}

// get article's tags and series in different catalog
if (articleFolder && articleFolder.children.length > 0) {
  for (const item of articleFolder.children) {
    if ('children' in item) {
      const themeTagsArr = []
      const themeSeriesArr = []

      const { data } = await useAsyncData(`${item._path}-filter`, () => queryContent<MyCustomParsedContent>(`${item._path}`).where({ _type: 'markdown' }).only(['tags', 'series']).find())

      data.value.forEach((article) => {
        if (article.tags) {
          themeTagsArr.push(...article.tags)
          tagArr.push(...article.tags)
        }
        if (article.series) {
          themeSeriesArr.push(article.series)
          seriesArr.push(article.series)
        }
      })

      // get theme
      const theme = getTheme(item._path)

      if (theme) {
        themeTags[theme] = [...new Set(themeTagsArr)]
        themeSeries[theme] = [...new Set(themeSeriesArr)]
      }
    } else if (item._type && item._type === 'markdown') {
      if (item.tags) {
        tagArr.push(...item.tags)
      }

      if (item.series) {
        seriesArr.push(item.series)
      }
    }
  }

  tagSet = new Set(tagArr)
  seriesSet = new Set(seriesArr)
}

// set current tags
const currentTags = ref([])
const showMoreTag = ref(false)

const toggleTag = (tag) => {
  if (tag === 'all') {
    currentTags.value = []
    changeURLHash()
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

  changeURLHash()
}

// set current series
const currentSeries = ref('all')
const showMoreSeries = ref(false)

const toggleSeries = (series) => {
  if (currentSeries.value === series) {
    currentSeries.value = 'all'
  } else {
    currentSeries.value = series
  }
  changeURLHash()
}

const changeURLHash = () => {
  navigateTo({
    path: '/list',
    query: {
      theme: currentTheme.value,
      tags: currentTags.value,
      series: currentSeries.value
    }
  })
}

// get the init current value after Mounted
onMounted(() => {
  const theme = route.query?.theme as string || 'all'
  currentTheme.value = theme

  let tags = []
  if (typeof route.query?.tags === 'string') {
    tags = [route.query.tags]
  } else if (Array.isArray(route.query?.tags)) {
    tags = route.query.tags
  }
  currentTags.value = tags

  const series = route.query?.series as string || 'all'
  currentSeries.value = series
})

/**
 *
 * get articles
 *
 */
// get all articles data
const { pending, data: articleList } = await useAsyncData('articles', () => {
  return queryContent<MyCustomParsedContent>('article')
    .only(['title', 'description', '_type', '_path', 'contentType', '_type', 'series', 'seriesOrder', 'tags'])
    .sort({ seriesOrder: 1, $numeric: true })
    .find()
})

// filter articles data
const filterArticleList = ref([])

watch(() => route.fullPath, () => {
  if (route.path !== '/list' || articleList.value.length === 0) { return }
  let currentArticleList = articleList.value

  if (route.query?.theme && route.query.theme !== 'all') {
    currentArticleList = currentArticleList.filter((item) => {
      const pathArr = item._path.split('/')
      if (pathArr.length >= 3) {
        const theme = pathArr[2]
        return theme === route.query.theme
      } else {
        return false
      }
    })
  }

  if (route.query?.tags) {
    let tags = []
    if (typeof route.query.tags === 'string') {
      tags = [route.query.tags]
    } else if (Array.isArray(route.query.tags)) {
      tags = route.query.tags
    }

    if (tags.length > 0) {
      currentArticleList = currentArticleList.filter((item) => {
        return tags.some((tag) => {
          if (item.tags) {
            return item.tags.includes(tag)
          } else {
            return false
          }
        })
      })
    }
  }

  if (route.query?.series && route.query.series !== 'all') {
    currentArticleList = currentArticleList.filter((item) => {
      return item.series === route.query.series
    })
  }

  filterArticleList.value = currentArticleList
}, {
  immediate: true
})

/**
 *
 * show article list detail
 */
const showListDetail = ref(true)

/**
 *
 * set the article list icon
 *
 */
const fileTypeMap = useFileTypeMap()
const getFileTypeIcon = (type) => {
  const fileType = fileTypeMap.value[type]

  if (!fileType) {
    return fileTypeMap.value.default.iconName
  } else {
    return fileType.iconName
  }
}
</script>

<template>
  <div>
    <Head>
      <Title>List</Title>
    </Head>
    <NuxtLayout name="base">
      <div class="shrink-0 px-4 sm:px-8 py-4 space-y-4 sm:sticky top-0 inset-x-0 z-10 bg-gray-50">
        <div class="flex items-start sm:space-x-2">
          <button
            class="shrink-0 p-2.5 hidden sm:flex justify-center items-center transition-colors duration-300 rounded"
            :class="showMoreFilter ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
            @click="showMoreFilter = !showMoreFilter"
          >
            <IconCustom
              name="mdi:filter-plus-outline"
              class="w-6 h-6"
            />
          </button>
          <div class="grow max-w-full space-y-2 ">
            <div class="p-2 flex items-start text-sm bg-gray-100 sm:space-x-4">
              <button
                class="shrink-0 px-2 py-1 hidden sm:flex items-center text-gray-500 hover:bg-gray-200 rounded"
                @click="showMoreTheme = !showMoreTheme"
              >
                <IconCustom
                  name="ic:round-keyboard-arrow-right"
                  class="w-5 h-5 transition-transform duration-300"
                  :class="showMoreTheme ? 'rotate-90' : 'rotate-0'"
                />
                <p>
                  Theme
                </p>
              </button>
              <p class="px-2 py-1 sm:hidden">
                Theme
              </p>
              <ul
                class="filter-list-container"
                :class="showMoreTheme ? 'max-h-96' : 'max-h-8'"
              >
                <li class="shrink-0">
                  <button
                    class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded"
                    :class="currentTheme === 'all' ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                    @click="toggleTheme('all')"
                  >
                    <IconCustom
                      name="material-symbols:category-rounded"
                      class="w-5 h-5"
                    />
                    <p>all</p>
                  </button>
                </li>
                <li
                  v-for="item in themeArr"
                  :key="item._path"
                  class="shrink-0"
                >
                  <button
                    class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded"
                    :class="currentTheme === getTheme(item._path) ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                    @click="toggleTheme(getTheme(item._path))"
                  >
                    <IconCustom
                      name="material-symbols:category-rounded"
                      class="shrink-0 w-5 h-5"
                    />
                    <p>
                      {{ getTheme(item._path) }}
                    </p>
                  </button>
                </li>
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
              <div
                v-show="showMoreFilter"
                class="space-y-2"
              >
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
                  <ul
                    v-if="tagSet"
                    class="filter-list-container"
                    :class="showMoreTag ? 'max-h-96' : 'max-h-8'"
                  >
                    <li
                      v-for="tag in ['all', ...tagSet as string[]]"
                      :key="tag"
                      class="shrink-0"
                    >
                      <button
                        class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded disabled:opacity-30"
                        :class="(currentTags.length === 0 && tag === 'all') || currentTags.includes(tag) ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                        :disabled="(tag === 'all' || currentTheme === 'all' || themeTags[currentTheme]?.includes(tag)) ? false : true"
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
                  <ul
                    v-if="seriesSet"
                    class="filter-list-container"
                    :class="showMoreSeries ? 'max-h-96' : 'max-h-8'"
                  >
                    <li
                      v-for="series in ['all', ...seriesSet as string[]]"
                      :key="series"
                      class="shrink-0"
                    >
                      <button
                        class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded disabled:opacity-30"
                        :class="currentSeries === series ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 hover:text-purple-500 bg-purple-100'"
                        :disabled="(series === 'all' || currentTheme === 'all' || themeSeries[currentTheme]?.includes(series)) ? false : true"
                        @click="toggleSeries(series)"
                      >
                        <IconCustom
                          name="bi:collection"
                          class="shrink-0 w-5 h-5"
                        />
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
                @click="toggleTheme('all')"
              >
                <IconCustom
                  name="ant-design:clear-outlined"
                  class="w-4 h-4"
                />
              </button>
              <button
                class="grow py-1 sm:hidden text-purple-500 bg-purple-100 rounded"
                @click="showMoreFilter = !showMoreFilter"
              >
                <IconCustom
                  v-show="!showMoreFilter"
                  name="ic:round-keyboard-arrow-down"
                  class="w-4 h-4"
                />
                <IconCustom
                  v-show="showMoreFilter"
                  name="ic:round-keyboard-arrow-up"
                  class="w-4 h-4"
                />
              </button>
              <button
                class="px-4 py-1 sm:hidden transition-colors duration-300 rounded"
                :class="showListDetail ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 hover:text-green-500 bg-green-50 hover:bg-green-100'"
                @click="showListDetail = !showListDetail"
              >
                <IconCustom
                  v-show="showListDetail"
                  name="ic:round-unfold-less"
                  class="w-4 h-4"
                />
                <IconCustom
                  v-show="!showListDetail"
                  name="ic:round-unfold-more"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>
        <hr>
      </div>

      <div class="shrink-0 mx-4 sm:mx-8 hidden sm:flex justify-between items-center text-sm">
        <button
          class="p-2 flex items-center text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-300 rounded"
          @click="toggleTheme('all')"
        >
          <IconCustom
            name="ant-design:clear-outlined"
            class="w-5 h-5"
          />
          <p class="hidden sm:block">
            Clear Filter
          </p>
        </button>
        <button
          class="p-2 flex items-center transition-colors duration-300 rounded"
          :class="showListDetail ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 hover:text-green-500 bg-green-50 hover:bg-green-100'"
          @click="showListDetail = !showListDetail"
        >
          <IconCustom
            v-show="showListDetail"
            name="ic:round-unfold-less"
            class="w-5 h-5"
          />
          <IconCustom
            v-show="!showListDetail"
            name="ic:round-unfold-more"
            class="w-5 h-5"
          />
          <p class="hidden sm:block">
            {{ showListDetail ? 'Less' : 'More' }} Detail
          </p>
        </button>
      </div>

      <div
        v-if="pending"
        class="grow flex flex-col justify-center items-center space-y-2 text-gray-400"
      >
        <IconCustom
          name="eos-icons:loading"
          class="w-10 h-10"
        />
        <p class="text-xl">
          Loading
        </p>
      </div>
      <div
        v-if="!pending && filterArticleList"
        class="grow container p-4 sm:p-8 mx-auto space-y-4"
      >
        <ul
          :class="showListDetail ? 'space-y-2' : 'grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2'"
        >
          <li
            v-for="item in filterArticleList"
            :key="item._path"
            class="space-y-2"
          >
            <NuxtLink
              :to="item._path"
              class="block px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded-lg space-y-2"
            >
              <div class="flex items-start">
                <IconCustom
                  :name="getFileTypeIcon(item._type)"
                  class="shrink-0 p-1 w-6 h-6 sm:w-7 sm:h-7"
                />
                <h2 class="grow font-bold text-base sm:text-lg">
                  {{ item.title }}
                </h2>
              </div>
              <p
                v-if="item.description"
                v-show="showListDetail"
                class="px-6 text-sm opacity-60"
              >
                {{ item.description }}
              </p>
            </NuxtLink>
            <div
              v-if="item._type==='markdown' && (item.tags || item.series)"
              v-show="showListDetail"
              class="px-10 flex flex-wrap gap-2 text-xs"
            >
              <button
                v-for="tag in item.tags"
                :key="tag"
                class="px-2 py-1 transition-colors duration-300 rounded"
                :class="(currentTags.length === 0 && tag === 'all') || currentTags.includes(tag) ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-blue-400 hover:text-blue-500 bg-blue-100'"
                @click="toggleTag(tag)"
              >
                #{{ tag }}
              </button>
              <button
                v-if="item.series"
                class="px-2 py-1 flex justify-center items-center space-x-1 transition-colors duration-300 rounded"
                :class="currentSeries === item.series ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 hover:text-green-500 bg-green-100'"
                @click="toggleSeries(item.series)"
              >
                <IconCustom
                  name="bi:collection"
                  class="shrink-0 w-4 h-4"
                />
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
