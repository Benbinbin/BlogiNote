<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

// const props = defineProps({
//   footerCatalog: {
//     type: Boolean,
//     default: false
//   },
// })

const appConfig = useAppConfig()

/**
 *
 * toggle more options
 *
 */
const showFooterNavMoreOptions = useState<Boolean>('showFooterNavMoreOptions', () => false)

/**
 *
 * toggle theme options
 *
 */
const showFooterNavThemeOptions = useState<Boolean>('showFooterNavThemeOptions', () => false)

/**
 *
 * set sub nav panel
 *
 */
const { data: navTree } = await useAsyncData('rootFolder', () => fetchContentNavigation())

let articleFolder
const themeArr: NavItem[] = []

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

/**
 *
 * search modal
 *
 */
const showSearchModal = useState('showSearchModal')
</script>

<template>
  <div class="relative">
    <div
      class="py-0.5 sm:hidden sticky bottom-0 inset-x-0 flex justify-between items-center bg-gray-50 border-t border-gray-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] shadow-gray-200"
    >
      <button
        v-show="!showFooterNavThemeOptions"
        class="min-w-[60px] px-2 py-3 relative z-10 flex justify-center items-center bg-gray-50"
        :class="showFooterNavMoreOptions ? 'shrink-0' : 'grow'"
        :style="showFooterNavMoreOptions ? 'box-shadow: 4px 0 4px -4px rgb(0,0,0,0.1),2px 0 2px -2px rgb(0,0,0,0.1)' : ''"
        @click="showFooterNavMoreOptions = !showFooterNavMoreOptions"
      >
        <div class="flex flex-col justify-center items-center gap-1">
          <img
            :src="appConfig.bloginote.avatar"
            alt="avatar"
            class="w-6 h-6"
          >
          <p
            class="text-xs"
            :class="showFooterNavMoreOptions ? 'text-purple-500' : 'text-gray-500'"
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
          v-show="showFooterNavMoreOptions"
          class="options-container px-4 relative -z-10 grow flex items-center gap-4 text-sm overflow-x-auto"
        >
          <NuxtLink
            to="/"
            class="option-item text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500"
            @click="showFooterNavMoreOptions = false"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="option-item text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500"
            @click="showFooterNavMoreOptions = false"
          >
            About
          </NuxtLink>
          <NuxtLink
            v-if="appConfig.bloginote.subscribePage"
            to="/subscribe"
            class="option-item text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500"
            @click="showFooterNavMoreOptions = false"
          >
            Subscribe
          </NuxtLink>
        </div>
      </Transition>

      <button
        v-show="!showFooterNavMoreOptions"
        class="min-w-[60px] px-2 py-3 relative z-10 flex justify-center items-center space-y-1 bg-gray-50"
        :class="showFooterNavThemeOptions ? 'shrink-0 text-purple-500' : 'grow text-gray-500'"
        :style="showFooterNavThemeOptions ? 'box-shadow: 4px 0 4px -4px rgb(0,0,0,0.1), 2px 0 2px -2px rgb(0,0,0,0.1)' : ''"
        @click="showFooterNavThemeOptions = !showFooterNavThemeOptions"
      >
        <div class="flex flex-col justify-center items-center gap-1">
          <IconCustom
            name="ic:round-category"
            class="w-6 h-6"
          />
          <p
            class="text-xs"
          >
            Theme
          </p>
        </div>
      </button>

      <Transition
        enter-from-class="-translate-x-full opacity-0"
        enter-active-class="transition-all duration-300 ease-in"
        enter-to-class="translate-x-0 opacity-100"
      >
        <div
          v-show="showFooterNavThemeOptions"
          class="options-container px-4 relative -z-10 grow flex items-center gap-4 text-sm overflow-x-auto"
        >
          <NuxtLink
            to="/list"
            class="option-item text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500"
            @click="showFooterNavThemeOptions = false"
          >
            all
          </NuxtLink>
          <NuxtLink
            v-for="theme in themeArr"
            :key="theme._path"
            :to="{ path: '/list', query: { theme: getTheme(theme._path) } }"
            class="option-item text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-500"
            @click="showFooterNavThemeOptions = false"
          >
            {{ theme.title }}
          </NuxtLink>
        </div>
      </Transition>

      <button
        v-show="!showFooterNavMoreOptions && !showFooterNavThemeOptions"
        class="grow px-2 py-3 flex justify-center items-center space-y-1 text-gray-500 bg-gray-50"
        @click="showSearchModal=true"
      >
        <div class="flex flex-col justify-center items-center gap-1">
          <IconCustom
            name="tabler:search"
            class="w-6 h-6"
          />
          <p class="text-xs">
            Search
          </p>
        </div>
      </button>

      <slot
        name="footer-nav-right"
      />
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
