<script setup lang="ts">
const props = defineProps<{data: any}>()

// defineEmits(['showSeriesModal'])
const showSeriesModal = useState('showSeriesModal')

// const themeOptions = useTheme()
const appConfig = useAppConfig()

/**
 *
 * show article created or last update time
 *
 */
let showTime = true
// if ('articlePage' in appConfig.theme && 'showTime' in appConfig.theme.articlePage) {
showTime = appConfig.theme.articlePage.showTime
// }

if ('showTime' in props.data) {
  showTime = props.data.showTime
}

/**
 *
 * show outdated warning
 *
 */
let showOutdatedWarningComponent = true
// if (appConfig?.theme?.articlePage?.outdated?.show) {
showOutdatedWarningComponent = appConfig.theme.articlePage.outdated.show
// }

if ('showOutdatedWarning' in props.data) {
  showOutdatedWarningComponent = props.data.showOutdatedWarning
}

/**
 *
 * get article category
 *
 */
const category = ref('')
if (props.data._path) {
  const pathArr = props.data._path.split('/')

  if (pathArr.length > 3 && pathArr[1] === 'article') {
    category.value = pathArr[2]
  }
}

/**
 *
 * catalog
 * toc for markdown article
 *
 */
// const showCatalog = useShowBlogCatalog()
const showCatalog = useState<Boolean>('showBlogCatalog', () => {
  return appConfig.theme.articlePage.showBlogCatalog
})

const article = ref(null)

// set active heading
const activeHeadings = ref(new Set<string>())
provide('activeHeadings', activeHeadings)

let observer
onMounted(() => {
  // get headings list
  if (article.value) {
    const headingDomList = article.value.querySelectorAll('h2, h3, h4, h5, h6')
    // set intersection observer
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')
        if (entry.intersectionRatio > 0) {
          activeHeadings.value.add(id)
        } else {
          activeHeadings.value.delete(id)
        }
      })
    })

    if (headingDomList.length > 0) {
      headingDomList.forEach((heading) => {
        observer.observe(heading)
      })
    }
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

/**
 *
 * show or hide tags
 */
const showTags = ref(true)
</script>

<template>
  <div ref="article">
    <div
      v-if="props.data.cover"
      class="my-4 w-full h-60 lg:h-72 xl:h-80 bg-cover bg-center bg-no-repeat"
      :style="`background-image: url('${props.data.cover}')`"
    />
    <div class="py-8 selection:text-white selection:bg-purple-400">
      <h1 class="py-4 text-3xl md:text-5xl font-bold text-center">
        {{ props.data.title || "Article" }}
      </h1>
      <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        <NuxtLink
          v-if="category"
          :to="{ path: '/list', query: { category: category } }"
          target="_blank"
          class="p-2 flex items-center gap-1 text-gray-300 hover:text-white hover:bg-purple-500 focus:outline-purple-500 focus:outline-none rounded transition-colors duration-300"
        >
          <IconCustom name="material-symbols:category-rounded" class="shrink-0 w-4 h-4" />
          <span class="text-xs">{{ category }}</span>
        </NuxtLink>
        <div v-if="showTime" class="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <div
            v-if="props.data.created"
            class="flex items-center gap-1 text-gray-300 hover:text-gray-400 transition-colors duration-300"
          >
            <IconCustom name="mdi:pencil-circle" class="w-4 h-4" />
            <span class="text-xs">Created Time: {{ (new Date(props.data.created)).toLocaleDateString() }}</span>
          </div>
          <div
            v-if="props.data.updated"
            class="flex items-center gap-1 text-gray-300 hover:text-gray-400 transition-colors duration-300"
          >
            <IconCustom name="mdi:clock" class="w-4 h-4" />
            <span class="text-xs">Updated Time: {{ (new Date(props.data.updated)).toLocaleDateString() }}</span>
          </div>
        </div>
        <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <button
            v-if="props.data.series"
            class="p-2 flex items-center gap-1 text-gray-300 hover:text-white hover:bg-green-500 focus:outline-green-500 focus:outline-none rounded transition-colors duration-300"
            @click="showSeriesModal=true"
          >
            <IconCustom name="bi:collection" class="shrink-0 w-4 h-4" />
            <span class="text-xs">{{ props.data.series }}</span>
          </button>
          <button
            v-if="props.data.tags"
            class="p-2 hidden sm:flex items-center gap-1 focus:outline-blue-500 rounded transition-colors duration-300"
            :class="showTags ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'text-gray-300 hover:text-white hover:bg-blue-500 '"
            @click="showTags = !showTags"
          >
            <IconCustom name="bi:collection" class="shrink-0 w-4 h-4" />
            <span class="text-xs">Tags</span>
          </button>
        </div>
      </div>

      <ClientOnly>
        <OutdatedWarning
          v-if="showTime && showOutdatedWarningComponent && (props.data.updated || props.data.created)"
          :date="props.data.updated || props.data.created"
          :type="props.data.updated ? 'last updated' : 'created'"
        />
      </ClientOnly>

      <hr class="w-1/3 mx-auto my-4">

      <div
        v-if="props.data.tags && props.data.tags.length>0"
        v-show="showTags"
        class="p-2 tags-container flex sm:flex-wrap justify-start sm:justify-center items-center overflow-x-auto gap-2"
      >
        <NuxtLink
          v-for="tag in props.data.tags"
          :key="tag"
          :to="{ path: '/list', query: { tags: [tag] } }"
          target="_blank"
          class="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-blue-500 rounded focus:outline-blue-500 transition-colors duration-300"
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </div>

    <ContentRenderer
      :value="props.data"
      class="article-container markdown-blog-container selection:text-white selection:bg-purple-400"
    >
      <template #empty>
        <div class="mx-auto font-bold">
          <p>Article is empty</p>
        </div>
      </template>
    </ContentRenderer>

    <CatalogSidebarForBlog
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      :catalogs="props.data.body.toc.links"
    />

    <button
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      class="p-2 hidden sm:flex justify-center items-center fixed bottom-16 right-4 z-40 border transition-colors duration-300 rounded-lg"
      :class="showCatalog ? 'text-purple-500 bg-purple-100 hover:bg-purple-50 border-purple-200' : 'text-gray-500 bg-white hover:bg-gray-100 border-gray-200'"
      @click="showCatalog = !showCatalog"
    >
      <IconCustom name="entypo:list" class="w-5 h-5" />
    </button>
  </div>
</template>

<style lang="scss">

.tags-container {
  &::-webkit-scrollbar {
    display: none;
  }
}

.markdown-blog-container {
  // hide the h1 element if it's the first dom in the .markdown-blog-container
  & > h1:first-child {
    @apply hidden
  }

  h1 {
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply before:font-light before:mr-1 before:text-purple-300 sm:before:opacity-50 hover:sm:before:opacity-100 before:transition-opacity before:duration-300;
  }

  h2 {
    @apply py-4 text-2xl md:text-3xl before:content-['H2'] before:text-sm md:before:text-lg sm:-translate-x-6;
  }

  h3 {
    @apply py-4 text-xl md:text-2xl before:content-['H3'] before:text-sm md:before:text-base sm:-translate-x-5;
  }

  h4 {
    @apply py-2 text-lg md:text-xl before:content-['H4'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h5 {
    @apply py-2 text-lg md:text-xl before:content-['H5'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h6 {
    @apply py-2 text-lg md:text-xl before:content-['H6'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }
}
</style>
