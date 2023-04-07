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

const showCatalog = useState<boolean>('showCatalog')

type CatalogType = '' | 'floatList' | 'floatTree' | 'sidebarList'
const catalogType = useState<CatalogType>('catalogType', () => '')
// manual toggle catalog float state
const toggleCatalogFloat = useState<Boolean>('toggleCatalogFloat', () => false)

// fixed sidebar catalog width
const sidebarWidth = ref(0)

// float catalog size and position init state
const floatCardWidth = ref(300)
const floatCardHeight = ref(300)
const floatCardLeft = ref(16)
const floatCardBottom = ref(80)

/**
 *
 * set the catalog init state
 * and auto adjust the catalog state when resize window
 *
 */
const windowSize = useWindowSize()

onMounted(() => {
  // base on the page init state to set the catalog init state
  sidebarWidth.value = (windowSize.value.width - 896) / 2

  if (!toggleCatalogFloat.value) {
    // if user didn't manually set the catalog to float previously
    // set the catalog type automatically based on page width
    if (windowSize.value.width < 1280) {
    // if the page width is small
    // less than 1280px, the 'xl' breakpoint in tailwind CSS
    // set the catalog to float list
      catalogType.value = 'floatList'
    } else {
      // if the page width is large
      // set the catalog to fixed sidebar
      catalogType.value = 'sidebarList'
    }
  }

  // watch the window size and adjust the catalog state automatically
  watch(() => windowSize.value.width, () => {
    // set the fixed sidebar width when window resize
    sidebarWidth.value = (windowSize.value.width - 896) / 2

    if (windowSize.value.width < 1280 && catalogType.value !== 'floatList' && catalogType.value !== 'floatTree') {
      // when the window resize smaller than 1280px
      // and if the catalog type is not float
      // auto float the catalog
      catalogType.value = 'floatList'
    } else if (windowSize.value.width >= 1280 && !toggleCatalogFloat.value) {
      // when the window resize bigger again
      // and if the sidebar not toggle to float manually
      // change the float state to fixed sidebar
      catalogType.value = 'sidebarList'
    }
  })
})
</script>

<template>
  <div>
    <aside
      v-if="catalogType === 'sidebarList'"
      id="sidebar"
      class="flex flex-col justify-center fixed z-30 top-1/2 right-0 -translate-y-1/2 select-none"
    >
      <ListCatalog
        :catalogs="props.catalogs"
        class="grow max-h-[70vh] pr-2 py-2 flex flex-col gap-y-2 justify-center items-center"
        :style="`width: ${sidebarWidth}px`"
      />
    </aside>
    <ResizableFloatCard
      v-if="catalogType === 'floatList' || catalogType === 'floatTree'"
      v-slot="{contentWidth, contentHeight}"
      :show-reset-button="showCatalog && (catalogType=== 'floatList' || catalogType === 'floatTree')"
      :start-width="floatCardWidth"
      :start-height="floatCardHeight"
      :position-point="'leftBottom'"
      :start-x="floatCardLeft"
      :start-y="floatCardBottom"
    >
      <ListCatalog
        v-show="catalogType==='floatList'"
        :catalogs="props.catalogs"
        class="grow flex flex-col-reverse justify-between items-stretch overflow-hidden"
      />

      <TreeCatalog
        v-show="catalogType === 'floatTree'"
        :catalogs="props.catalogs"
        :width="contentWidth"
        :height="contentHeight"
        class="grow flex flex-col overflow-hidden"
      />
    </ResizableFloatCard>
  </div>
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
