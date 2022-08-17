<script setup lang="ts">
// import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{ data: any }>()

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
const showCatalog = useShowNoteCatalog()

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

    <div class="hidden md:block fixed top-20 right-4 z-40">
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
      v-if="data?.body?.toc"
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
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
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
