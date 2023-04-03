<script setup lang="ts">
const props = defineProps<{
  catalogs: CatalogItem[]
}>()

interface CatalogItem {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItem[]
}

const sidebar = ref(null)
// sidebar size and position
const sidebarWidth = ref(300)
const sidebarHeight = ref(300)
const sidebarLeft = ref(16)
const sidebarBottom = ref(80)

const sidebarFloatForBlog = useBlogSidebarFloat()

const resetFloatSidebarHandler = () => {
  sidebarWidth.value = 300
  sidebarHeight.value = 300
  sidebarLeft.value = 16
  // if (document.documentElement.clientWidth <= 640) {
  sidebarBottom.value = 80
  // } else {
  // sidebarBottom.value = 16
  // }
}

/**
 *
 * set the sidebar init state
 * and auto adjust the sidebar float state when resize window
 *
 */
const windowSize = useWindowSize()
onMounted(() => {
  const setSidebarWidth = () => {
    sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
  }

  // base on the page init state to set the sidebar init state
  if (document.documentElement.clientWidth < 1280) {
    if (document.documentElement.clientWidth <= 640) {
      sidebarBottom.value = 80
    }

    sidebarFloatForBlog.value = true
  } else {
    setSidebarWidth()
  }

  // watch the window size
  // and adjust the width of the fixed sidebar (not the float sidebar)
  watch(() => windowSize.value.width, () => {

    if (document.documentElement.clientWidth < 1280 && !sidebarFloatForBlog.value) {
      // when the window resize smaller than 1280px at the first time
      // and if the sidebar not toggle to float manually

      // reset the size and position of the float catalog
      if (!toggleSidebarFloatForBlog.value) {
        resetFloatSidebarHandler()
        resetCatalogListScaleHandler()
      }

      // auto float the catalog
      sidebarFloatForBlog.value = true
    } else if (document.documentElement.clientWidth >= 1280 && !toggleSidebarFloatForBlog.value && sidebarFloatForBlog.value) {
      // when the window resize bigger (or equal) than 1280px at the first time
      // and if the sidebar not toggle to float manually

      // change the float state to fixed
      sidebarFloatForBlog.value = false
    }

    // set the fixed sidebar width when window resize
    if (!sidebarFloatForBlog.value && !toggleSidebarFloatForBlog.value) {
      setSidebarWidth()
    }
  })
})

/**
 *
 * manual toggle catalog float state
 *
 */
const toggleSidebarFloatForBlog = useToggleBlogSidebarFloat()

onMounted(() => {
  watch(toggleSidebarFloatForBlog, () => {
    if (toggleSidebarFloatForBlog.value) {
      // when manually change the fixed state to float
      resetFloatSidebarHandler()
      resetCatalogListScaleHandler()
      sidebarFloatForBlog.value = true
    } else {
      // when change the float state to fixed
      // reset the fixed sidebar width
      sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
      sidebarFloatForBlog.value = false
    }
  })
})

/**
 *
 * tree catalog type interaction
 *
 */
const catalogList = ref<HTMLElement | null>(null) // get the catalog DOM
const catalogListScale = ref(1)
const catalogListTranslateX = ref(0)
const catalogListTranslateY = ref(0)

const resetCatalogListScaleHandler = () => {
  catalogListScale.value = 1
  catalogListTranslateX.value = 0
  catalogListTranslateY.value = 0
}

// toggle catalog type between "tree" and "list"
const floatBlogCatalogType = useFloatBlogCatalogType()
const catalogContainer = ref<HTMLElement | null>(null) // get the catalog container DOM

const toggleFloatCatalogTypeHandler = () => {
  if (floatBlogCatalogType.value === 'tree') {
    floatBlogCatalogType.value = 'list'
  } else if (floatBlogCatalogType.value === 'list') {
    floatBlogCatalogType.value = 'tree'
  }
}



/**
 *
 * expand or collapse all catalog
 *
 */
// set value to "expand" or "collapse" or ""
const toggleAllCatalogState = ref<'expand' | 'collapse' | ''>('')
provide('toggleAllCatalogState', toggleAllCatalogState)

const changeToggleAllCatalogState = (value: 'expand' | 'collapse' | '') => {
  toggleAllCatalogState.value = value
}
provide('changeToggleAllCatalogState', changeToggleAllCatalogState)
</script>

<template>
  <aside
    id="sidebar"
    ref="sidebar"
    tabindex="0"
    class="flex flex-col justify-center fixed z-30 top-1/2 right-0 -translate-y-1/2 select-none"
  >
    <ListCatalog
      :catalogs="props.catalogs"
      class="grow max-h-[70vh] pr-2 py-2 flex flex-col gap-y-2 justify-center items-center"
      :style="`width: ${sidebarWidth}px`"
    />
  </aside>
</template>

<style scoped lang="scss">
.resize-btn-indicator {
  @apply opacity-10 group-hover:opacity-100 transition-opacity duration-300;
}
#catalog-container, .sidebar-btn-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
.sidebar-btn {
  @apply shrink-0 p-2 sm:p-1 justify-center items-center transition-colors duration-300 rounded
}
</style>
