<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const route = useRoute()

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
const { data: navData } = await useAsyncData('rootFolder', () => fetchContentNavigation())

const categoryArr = ref([])

if (Array.isArray(navData.value)) {
  const articleFolder = navData.value.find(elem => elem._path === '/article')
  if (articleFolder && articleFolder.children) {
    categoryArr.value = articleFolder.children
  }
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
const showBlogCatalog = useShowBlogCatalog()
const showNoteCatalog = useShowNoteCatalog()
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
        class="px-4 py-3 relative z-10 flex flex-col justify-center items-center space-y-1 bg-gray-50"
        :class="showMoreOptions ? 'shadow-[4px_0_4px_-4px_rgb(0,0,0,0.1),2px_0_2px_-2px_rgb(0,0,0,0.1)] shadow-gray-300' : ''"
        @click="showMoreOptions = !showMoreOptions"
      >
        <img
          src="/avatar.png"
          alt="avatar"
          class="w-6 h-6 rounded-full ring-2"
          :class="showMoreOptions ? (flexiMode === 'blog' ? 'ring-purple-300' : 'ring-green-300') : 'ring-gray-50'"
        >
        <p
          class="text-xs"
          :class="showMoreOptions ? (flexiMode === 'blog' ? 'text-purple-500' : 'text-green-500') : 'text-gray-500'"
        >
          More
        </p>
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
            to="/rss"
            class="option-item"
            :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
            @click="showMoreOptions = false"
          >
            RSS
          </NuxtLink>
        </div>
      </Transition>

      <button
        v-show="!showMoreOptions"
        class="px-4 py-3 relative z-10 flex flex-col justify-center items-center space-y-1 bg-gray-50"
        :class="showCategoryOptions ? (flexiMode === 'blog' ? 'text-purple-500 shadow-[4px_0_4px_-4px_rgb(0,0,0,0.1),2px_0_2px_-2px_rgb(0,0,0,0.1)] shadow-gray-300' : 'text-green-500 shadow-[4px_0_4px_-4px_rgb(0,0,0,0.1),2px_0_2px_-2px_rgb(0,0,0,0.1)] shadow-gray-300') : 'text-gray-500'"
        @click="showCategoryOptions = !showCategoryOptions"
      >
        <IconCustom name="ic:round-category" class="w-6 h-6" />
        <p class="text-xs">
          Category
        </p>
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
          <template v-for="item in categoryArr as NavItem[]">
            <NuxtLink
              v-if="item.children"
              :key="item._path"
              :to="{ path: '/list', query: { category: item.title.toLowerCase() } }"
              class="option-item"
              :class="flexiMode === 'blog' ? 'text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500' : 'text-green-500 bg-green-50 hover:bg-green-100 border-green-500'"
              @click="showCategoryOptions = false"
            >
              {{ item.title }}
            </NuxtLink>
          </template>
        </div>
      </Transition>

      <button
        v-if="route.path && route.path.startsWith('/article')"
        v-show="!showMoreOptions && !showCategoryOptions"
        class="px-4 py-3 flex flex-col justify-center items-center space-y-1 bg-gray-50"
        :class="flexiMode === 'blog' ? (showBlogCatalog ? 'text-purple-500' : ' text-gray-500') : (showNoteCatalog ? 'text-green-500' : ' text-gray-500')"
        @click="toggleCatalogHandler"
      >
        <IconCustom name="entypo:list" class="w-6 h-6" />
        <p class="text-xs">
          catalog
        </p>
      </button>

      <button
        v-show="!showMoreOptions && !showCategoryOptions"
        :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
        class="mx-6 w-11 h-11 flex justify-center items-center gap-1  transition-colors duration-300 rounded-lg"
        :class="flexiMode === 'blog' ? 'flex-col bg-purple-100 hover:bg-purple-200' : 'flex-row bg-green-100 hover:bg-green-200'"
        @click="changeFlexiMode"
      >
        <div class="shrink-0 w-2 h-2 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-500' : 'bg-green-500'" />
        <div class="shrink-0 space-y-1">
          <div class="w-1.5 h-1.5 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
          <div class="w-1.5 h-1.5 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
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
  @apply px-4 py-2 border rounded;
}

.sub-nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.sub-nav-item-card {
  @apply p-4 flex flex-col justify-center items-center space-y-2 text-purple-500 bg-purple-50 hover:bg-purple-100 border border-purple-400 rounded
}
</style>
