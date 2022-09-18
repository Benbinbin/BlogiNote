<script setup lang="ts">
const props = defineProps<{ data: any }>()

// defineEmits(['showSeriesModal'])
const showSeriesModal = useState('showSeriesModal')

/**
 *
 * show title or not
 *
 */
const showTitle = ref(true)

if (props.data.body.children.length > 0 && props.data.body.children[0].tag === 'h1' && props.data.body.children[0]?.children[0]?.type === 'text' && props.data.body.children[0].children[0].value === props.data.title) {
  showTitle.value = false
}

// const themeOptions = useTheme()
const appConfig = useAppConfig()
/**
 *
 * show article created or last update time
 *
 */
let showTime = true
// if ('articlePage' in themeOptions.value && 'showTime' in themeOptions.value.articlePage) {
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
let showOutdatedWarningComponent = false
// if (themeOptions.value?.articlePage?.outdated?.show) {
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
 * show or hide tags
 */
const showTags = ref(true)

/**
 *
 * article tree
 * transform markdown data to tree structure
 *
 */
const articleTree = []
const headingArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const headingIdArr = []

// the default node setting for currentH1
// just prepare for special situation when the article missing the H1 heading
const defaultH1 = {
  node: {
    type: 'element',
    tag: 'h1',
    props: { id: '_default_heading_1' },
    children: [{
      type: 'text',
      value: 'Article'
    }]
  },
  type: 'h1',
  children: [],
  content: []
}

let currentH1 = null
let currentH2 = null
let currentH3 = null
let currentH4 = null
let currentH5 = null
let currentH6 = null

let currentParent = null

props.data.body.children.forEach((elem) => {
  if (articleTree.length === 0 && elem.tag !== 'h1') {
    currentH1 = defaultH1
    currentParent = currentH1

    articleTree.push(currentH1)
  }

  if (headingArr.includes(elem.tag)) {
    if (elem.tag !== 'h1') { headingIdArr.push(elem.props.id) }

    switch (elem.tag) {
      case 'h1':
        currentH1 = {
          node: elem,
          type: 'h1',
          children: [],
          content: []
        }
        articleTree.push(currentH1)
        currentParent = currentH1
        break
      case 'h2':
        currentH2 = {
          node: elem,
          type: 'h2',
          children: [],
          content: []
        }
        currentH1.children.push(currentH2)
        currentParent = currentH2
        break
      case 'h3':
        currentH3 = {
          node: elem,
          type: 'h3',
          children: [],
          content: []
        }

        if (!currentH2) {
          currentParent.children.push(currentH3)
        } else {
          currentH2.children.push(currentH3)
        }

        currentParent = currentH3
        break
      case 'h4':
        currentH4 = {
          node: elem,
          type: 'h4',
          children: [],
          content: []
        }

        if (!currentH3) {
          currentParent.children.push(currentH3)
        } else {
          currentH3.children.push(currentH4)
        }

        currentParent = currentH4
        break
      case 'h5':
        currentH5 = {
          node: elem,
          type: 'h5',
          children: [],
          content: []
        }

        if (!currentH4) {
          currentParent.children.push(currentH5)
        } else {
          currentH4.children.push(currentH5)
        }
        currentParent = currentH5
        break
      case 'h6':
        currentH6 = {
          node: elem,
          type: 'h6',
          children: [],
          content: []
        }

        if (!currentH5) {
          currentParent.children.push(currentH6)
        } else {
          currentH5.children.push(currentH6)
        }
        currentParent = currentH6
    }
  } else {
    currentParent.content.push({
      node: elem,
      type: elem.tag
    })
  }
})

/**
 *
 * layout
 *
 */
const layout = ref<'waterfall' | 'compact' | 'card'>('waterfall')

const divideColumns = ref(1)
provide('divideColumns', divideColumns)

const recommendColumns = ref(1)
provide('recommendColumns', recommendColumns)

const autoChangeColumns = ref(true)

let resizeTimerForColumns = null

onMounted(() => {
  if (document.documentElement.clientWidth && window) {
    if (document.documentElement.clientWidth >= 1000) {
      recommendColumns.value = Math.max(Math.floor(document.documentElement.clientWidth / 500), 1)
      divideColumns.value = recommendColumns.value

      if (articleTree.length > 1) { layout.value = 'compact' }
    }

    window.addEventListener('resize', () => {
      if (resizeTimerForColumns) {
        clearTimeout(resizeTimerForColumns)
      }

      resizeTimerForColumns = setTimeout(() => {
        recommendColumns.value = Math.max(Math.floor(document.documentElement.clientWidth / 500), 1)
        if (autoChangeColumns.value) {
          divideColumns.value = recommendColumns.value
        }

        resizeTimerForColumns = null
      }, 300)
    })
  }
})

const changeDivideColumnsHandler = (event) => {
  if (event.shiftKey) {
    divideColumns.value += 1
  } else if (event.ctrlKey || event.metaKey) {
    divideColumns.value = Math.max(divideColumns.value - 1, 1)
  } else {
    let columns = divideColumns.value + 1
    if (columns > recommendColumns.value) { columns = 1 }
    divideColumns.value = columns
  }
}

/**
 *
 * catalog
 * toc for markdown article
 *
 */
// const showCatalog = useShowNoteCatalog()
const showCatalog = useState<Boolean>('showNoteCatalog', () => {
  return appConfig.theme.articlePage.showNoteCatalog
})

// collapse heading section
const collapseHeadings = ref(new Set<string>())
provide('collapseHeadings', collapseHeadings)

const toggleCollapseHeadings = (id) => {
  if (collapseHeadings.value.has(id)) {
    collapseHeadings.value.delete(id)
  } else {
    collapseHeadings.value.add(id)
  }
}
provide('toggleCollapseHeadings', toggleCollapseHeadings)

// collapse or expand all heading section
const toggleAllHeadings = (value) => {
  if (value === 'expand') {
    collapseHeadings.value.clear()
  } else {
    collapseHeadings.value = new Set(headingIdArr)
  }
}
provide('toggleAllHeadings', toggleAllHeadings)

/**
 *
 * set active heading
 * change url anchor for scroll
 *
 */
const activeHeadingId = ref('')
provide('activeHeadingId', activeHeadingId)

const setActiveHeadingId = (id) => {
  activeHeadingId.value = id
}
provide('setActiveHeadingId', setActiveHeadingId)
</script>

<template>
  <div>
    <div class="p-4 selection:text-white selection:bg-purple-400">
      <h1 v-if="showTitle" class="py-4 text-3xl md:text-5xl font-bold text-center">
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
            class="flex items-center gap-1 text-xs text-gray-300 hover:text-gray-400 transition-colors duration-300"
          >
            <IconCustom name="mdi:pencil-circle" class="w-4 h-4" />
            <span>Created Time: {{ (new Date(props.data.created)).toLocaleDateString() }}</span>
          </div>
          <div
            v-if="props.data.updated"
            class="flex items-center gap-1 text-xs text-gray-300 hover:text-gray-400 transition-colors duration-300"
          >
            <IconCustom name="mdi:clock" class="w-4 h-4" />
            <span>Updated Time: {{ (new Date(props.data.updated)).toLocaleDateString() }}</span>
          </div>
        </div>
        <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <button
            v-if="props.data.series"
            class="p-2 flex items-center gap-1 text-gray-300 hover:text-white  hover:bg-green-500 focus:outline-green-500 focus:outline-none rounded transition-colors duration-300"
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

      <hr class="w-1/3 mx-auto my-2 sm:my-4">

      <div
        v-if="props.data.tags && props.data.tags.length>0"
        v-show="showTags"
        class="py-2 tags-container flex sm:flex-wrap justify-start sm:justify-center items-center overflow-x-auto gap-2"
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

    <div
      class="markdown-note-container selection:text-white selection:bg-green-400"
      :class="layout === 'compact' ? 'gap-x-2': ''"
      :style="layout === 'compact' ? `columns: ${divideColumns}` : ''"
    >
      <ElementCard
        v-for="(elem, index) in articleTree"
        :key="index"
        :elem="elem"
        :order="index+1"
        :count="articleTree.length"
        :class="layout === 'compact' ? 'p-2 mb-2 border rounded break-inside-avoid' : ''"
      />
    </div>

    <CatalogSidebarForNote
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      :catalogs="props.data.body.toc.links"
    />

    <div class="hidden md:block fixed top-20 right-4 z-20">
      <button
        class="p-1 flex justify-center items-center absolute -top-4 -left-4 rounded-full"
        :class="autoChangeColumns ? 'text-yellow-500 bg-yellow-100 hover:bg-yellow-50 border border-yellow-200' : 'text-gray-500 bg-gray-100 hover:bg-gray-50 border border-gray-200'"
        @click="autoChangeColumns = !autoChangeColumns"
      >
        <IconCustom name="fluent:desktop-sync-24-regular" class="w-4 h-4" />
      </button>
      <button
        class="p-2 flex justify-center items-center text-green-500 bg-green-100 hover:bg-green-50 border border-green-200 transition-colors duration-300 rounded-lg"
        @click="changeDivideColumnsHandler"
      >
        <span class="w-5 h-5">{{ divideColumns }}</span>
      </button>
    </div>

    <button
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      class="p-2 hidden sm:flex justify-center items-center fixed bottom-16 right-4 z-40 border transition-colors duration-300 rounded-lg"
      :class="showCatalog ? 'text-green-500 bg-green-100 hover:bg-green-50 border-green-200' : 'text-gray-500 bg-white hover:bg-gray-100 border-gray-200'"
      @click="showCatalog = !showCatalog"
    >
      <IconCustom name="entypo:list" class="w-5 h-5" />
    </button>
  </div>
</template>

<style lang="scss">

.markdown-note-container {
  h1 {
    @apply py-6 md:py-8 text-3xl md:text-5xl text-center;
  }

  h2 {
    @apply py-4 md:py-6 text-2xl;
  }

  h3 {
    @apply text-xl;
  }

  h4 {
    @apply text-lg;
  }

  h5 {
    @apply text-base;
  }
}
</style>
