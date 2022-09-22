<script setup lang="ts">
// import type { NavItem } from '@nuxt/content/dist/runtime/types'

const props = defineProps({
  footerCatalog: {
    type: Boolean,
    default: false
  },
  footerFlexiMode: {
    type: Boolean,
    default: false
  }
})

// const route = useRoute()

const appConfig = useAppConfig()

/**
 *
 * toggle more options
 *
 */
const showMoreOptions = ref(false)

/**
 *
 *  toggle category options
 *
 */
const showCategoryOptions = ref(false)

/**
 * set sub nav panel
 */
const { data: navTree } = await useAsyncData('rootFolder', () => fetchContentNavigation())

let articleFolder
const categoryArr = []

if (Array.isArray(navTree.value)) {
  articleFolder = navTree.value.find(item => item._path === '/article')

  if (articleFolder?.children && articleFolder.children.length > 0) {
    articleFolder.children.forEach((item) => {
      if ('children' in item) {
        categoryArr.push(item)
      }
    })
  }
}

const getCategory = (path = '') => {
  let category = ''
  const pathArr = path.split('/')

  if (pathArr.length === 3 && pathArr[1] === 'article') {
    category = pathArr[2]
  }

  return category
}

/**
 *
 * toggle flexible mode
 *
 */
const flexiMode = useFlexiMode()

const changeFlexiMode = () => {
  if (flexiMode.value === 'blog') {
    flexiMode.value = 'note'
  } else {
    flexiMode.value = 'blog'
  }
}

/**
 *
 * toggle catalog
 *
 */
// const showBlogCatalog = useShowBlogCatalog()
const showBlogCatalog = useState('showBlogCatalog')
// const showNoteCatalog = useShowNoteCatalog()
const showNoteCatalog = useState('showNoteCatalog')
const toggleCatalogHandler = () => {
  if (flexiMode.value === 'blog') {
    showBlogCatalog.value = !showBlogCatalog.value
  } else {
    showNoteCatalog.value = !showNoteCatalog.value
  }
}
</script>

<template>
  <div class="relative">
    <div
      class="py-0.5 sm:hidden sticky bottom-0 inset-x-0 flex justify-between items-center bg-gray-50 border-t border-gray-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] shadow-gray-200"
    >
      <button
        v-show="!showCategoryOptions"
        class="min-w-[60px] px-2 py-3 relative z-10 flex justify-center items-center bg-gray-50"
        :class="showMoreOptions ? 'shrink-0' : 'grow'"
        :style="showMoreOptions ? 'box-shadow: 4px 0 4px -4px rgb(0,0,0,0.1),2px 0 2px -2px rgb(0,0,0,0.1)' : ''"
        @click="showMoreOptions = !showMoreOptions"
      >
        <div class="flex flex-col justify-center items-center gap-1">
          <img
            :src="appConfig.theme.avatar"
            alt="avatar"
            class="w-6 h-6"
          >
          <p
            class="text-xs"
            :class="showMoreOptions ? (flexiMode === 'blog' ? 'text-purple-500' : 'text-green-500') : 'text-gray-500'"
          >
            More
          </p>
        </div>
      </button>

      <Transition
        enter-from-class="-translate-x-full opacity-0"
        enter-active-class="transition-all duration-300 ease-in"
        enter-to-class="translate-x-0 opacity-100"
      >
        <div
          v-show="showMoreOptions"
          class="options-container px-4 relative -z-10 grow flex items-center gap-4 text-sm overflow-x-auto"
        >
          <NuxtLink
            to="/"
            class="option-item"
            :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
            @click="showMoreOptions = false"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="option-item"
            :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
            @click="showMoreOptions = false"
          >
            About
          </NuxtLink>
          <NuxtLink
            v-if="appConfig.theme.subscribePage"
            to="/subscribe"
            class="option-item"
            :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
            @click="showMoreOptions = false"
          >
            Subscribe
          </NuxtLink>
        </div>
      </Transition>

      <button
        v-show="!showMoreOptions"
        class="min-w-[60px] px-2 py-3 relative z-10 flex justify-center items-center space-y-1 text-gray-500 bg-gray-50"
        :class="showCategoryOptions ? 'shrink-0' : 'grow'"
        :style="showCategoryOptions ? 'box-shadow: 4px 0 4px -4px rgb(0,0,0,0.1), 2px 0 2px -2px rgb(0,0,0,0.1)' : ''"
        @click="showCategoryOptions = !showCategoryOptions"
      >
        <div class="flex flex-col justify-center items-center gap-1">
          <IconCustom name="ic:round-category" class="w-6 h-6" />
          <p class="text-xs">
            Category
          </p>
        </div>
      </button>

      <Transition
        enter-from-class="-translate-x-full opacity-0"
        enter-active-class="transition-all duration-300 ease-in"
        enter-to-class="translate-x-0 opacity-100"
      >
        <div
          v-show="showCategoryOptions"
          class="options-container px-4 relative -z-10 grow flex items-center gap-4 text-sm overflow-x-auto"
        >
          <NuxtLink
            to="/list"
            class="option-item"
            :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
            @click="showCategoryOptions = false"
          >
            all
          </NuxtLink>
          <NuxtLink
            v-for="category in categoryArr"
            :key="category._path"
            :to="{ path: '/list', query: { category: getCategory(category._path) } }"
            class="option-item"
            :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
            @click="showCategoryOptions = false"
          >
            {{ category.title }}
          </NuxtLink>
        </div>
      </Transition>

      <button
        v-if="props.footerCatalog"
        v-show="!showMoreOptions && !showCategoryOptions"
        class="grow px-2 py-3 flex justify-center items-center space-y-1 bg-gray-50"
        :class="showBlogCatalog ? (flexiMode === 'blog' ? 'text-purple-500': 'text-green-500'): 'text-gray-500'"
        @click="toggleCatalogHandler"
      >
        <div class="flex flex-col justify-center items-center gap-1">
          <IconCustom name="entypo:list" class="w-6 h-6" />
          <p class="text-xs">
            Catalog
          </p>
        </div>
      </button>

      <button
        v-if="props.footerFlexiMode"
        v-show="!showMoreOptions && !showCategoryOptions"
        :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
        class="grow flex justify-center items-center"
        @click="changeFlexiMode"
      >
        <div class="mx-2 w-11 h-11 flex flex-col justify-center items-center gap-1 transition-colors duration-300 rounded-lg" :class="flexiMode === 'blog' ? 'flex-col bg-purple-100' : 'bg-green-100'">
          <div class="shrink-0 w-2 h-2 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-500' : 'bg-green-500'" />
          <div class="shrink-0 space-y-1">
            <div class="w-1.5 h-1.5 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
            <div class="w-1.5 h-1.5 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.options-container::-webkit-scrollbar {
  display: none;
}

.option-item {
  @apply shrink-0 px-4 py-2 border rounded;
}

.sub-nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.sub-nav-item-card {
  @apply p-4 flex flex-col justify-center items-center space-y-2 text-purple-500 bg-purple-50 hover:bg-purple-100 border border-purple-400 rounded
}
</style>
