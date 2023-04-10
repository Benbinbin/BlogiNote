<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const appConfig = useAppConfig()

// const queryBuilder = queryContent().where({ _path: { $contains: '/article' } })
// const { data } = await useAsyncData('articleFolder', () => fetchContentNavigation(queryBuilder))
const { data: navTree } = await useAsyncData('rootFolder', () => fetchContentNavigation())

// const articleFolder = data.value[0]

let articleFolder
const themeArr:NavItem[] = []

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

const showSubNav = ref(false)

let timer:(null | ReturnType<typeof setTimeout>) = null

/**
 *
 * sub nav menu
 *
 */
// show or hide sub nav menu
const setSubNav = (show:boolean) => {
  if (show) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    showSubNav.value = true
  }

  if (!show) {
    timer = setTimeout(() => {
      showSubNav.value = false
      timer = null
    }, 500)
  }
}

// fix the sub nav menu translate value after transition effect
const onAfterEnter = (el:HTMLElement) => {
  el.classList.add('translate-y-full')
}

// control the scroll behavior
// fix the overscroll bug
const subNavDOM = ref<null | HTMLElement>(null)
const scrollWheelHandler = (event: WheelEvent) => {
  if(subNavDOM.value) {
    overscrollWheelHandler(event, subNavDOM.value)
  }
}

/**
 *
 * search modal
 *
 */
const showSearchModal = useState('showSearchModal')
</script>

<template>
  <nav class="relative">
    <div
      class="px-4 py-3 grid grid-cols-3 items-center gap-2 text-sm bg-gray-50 border-b"
      :class="showSubNav ? 'border-gray-200' : 'border-gray-50 shadow-md shadow-gray-200'"
    >
      <div class="flex justify-start items-center">
        <NuxtLink to="/">
          <img
            :src="appConfig.bloginote.avatar"
            alt="avatar"
            class="w-10 h-10 rounded-full"
          >
        </NuxtLink>
      </div>
      <div class="flex justify-center items-center gap-6">
        <button
          class="btn hidden sm:block text-purple-500 hover:bg-purple-100"
          @mouseover="setSubNav(true)"
          @mouseleave="setSubNav(false)"
          @click="showSubNav=!showSubNav"
        >
          Theme
        </button>
        <NuxtLink
          to="/about"
          class="btn text-purple-500 hover:bg-purple-100"
        >
          About
        </NuxtLink>
        <NuxtLink
          v-if="appConfig.bloginote.subscribePage"
          to="/subscribe"
          class="btn text-purple-500 hover:bg-purple-100"
        >
          Subscribe
        </NuxtLink>
      </div>
      <div class="flex justify-end items-center gap-4">
        <button
          class="self-stretch px-4 py-1.5 flex justify-center items-center gap-2 text-gray-600 border border-gray-400 rounded-md opacity-50 hover:opacity-100 transition-opacity duration-300"
          @click="showSearchModal=true"
        >
          <IconCustom
            name="tabler:search"
            class="w-4 h-4"
          />
          <span class="hidden lg:block text-sm">Search</span>
          <span class="hidden md:flex justify-center items-center gap-1 text-xs ">
            <code class="px-2 py-0.5 border rounded bg-gray-200">Ctrl</code>
            <code class="px-2 py-0.5 border rounded bg-gray-200">K</code>
          </span>
        </button>
        <slot
          name="header-nav-right"
        />
      </div>
    </div>
    <Transition
      enter-from-class="translate-y-0 opacity-0"
      enter-active-class="transition-all duration-300 ease-in"
      enter-to-class="translate-y-full opacity-100"
      leave-from-class="translate-y-full opacity-100"
      leave-active-class="transition-all duration-[1500ms] ease-out"
      leave-to-class="-translate-y-full opacity-0"
      @after-enter="onAfterEnter"
    >
      <div
        v-show="showSubNav"
        ref="subNavDOM"
        class="sub-nav-scroll-container w-full max-h-[60vh] overflow-y-auto overscroll-y-container absolute -z-10 bottom-0 inset-x-0 hidden sm:flex justify-center items-start bg-gray-50 shadow-md shadow-gray-200"
        @mouseover="setSubNav(true)"
        @mouseleave="setSubNav(false)"
        @wheel="scrollWheelHandler"
      >
        <div class="sub-nav-items-container max-w-full px-6 py-8">
          <NuxtLink
            to="/list"
            class="sub-nav-item-card text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-100"
            @click="showSubNav=false"
          >
            <IconCustom
              name="material-symbols:category-rounded"
              class="w-8 h-8"
            />
            <p class="py-2 font-bold text-center">
              All
            </p>
          </NuxtLink>
          <NuxtLink
            v-for="theme in themeArr"
            :key="theme._path"
            :to="{ path: '/list', query: { theme: getTheme(theme._path) } }"
            class="sub-nav-item-card text-purple-500 bg-purple-50 hover:bg-purple-100 border-purple-100"
            @click="showSubNav=false"
          >
            <IconCustom
              name="material-symbols:category-rounded"
              class="w-8 h-8"
            />
            <p class="py-2 font-bold text-center">
              {{ theme.title }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped lang="scss">

.btn {
  @apply p-2 font-bold transition-colors duration-300 rounded-md
}

.sub-nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.sub-nav-items-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  justify-content: center;
}

.sub-nav-item-card {
  @apply p-4 flex flex-col justify-center items-center space-y-2 border transition-colors duration-300 rounded-lg
}
</style>
