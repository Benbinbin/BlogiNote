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

/**
 *
 * manual change catalog type
 *
 */
const catalogType = useState('catalogType')
const toggleCatalogFloat = useState('toggleCatalogFloat')
const changeCatalogType = (value: 'floatList' | 'floatTree' | 'sidebarList') => {
  if(value === 'floatList') {
    toggleCatalogFloat.value = false
  } else {
    toggleCatalogFloat.value = true
  }
  catalogType.value = value
}

const toggleCatalogFlat = () => {
  if(catalogType.value === 'sidebarList') {
    changeCatalogType('floatList')
  } else {
    changeCatalogType('sidebarList')
  }
}

/**
 *
 * expand or collapse catalog
 *
 */
const syncCatalogItemExpandOrCollapseState = useState('syncCatalogItemExpandOrCollapseState')

const changeToggleAllCatalogItemState = inject<(value: 'expand' | 'collapse' | '') => void>('changeToggleAllCatalogItemState') as Function
</script>

<template>
  <div>
    <!-- control buttons container -->
    <div
      class="sidebar-btn-container py-2 flex justify-start items-center gap-x-8 overflow-x-auto"
    >
      <div class="flex items-center gap-2">
        <button
          class="sidebar-btn border-purple-400"
          :class="syncCatalogItemExpandOrCollapseState ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="syncCatalogItemExpandOrCollapseState = !syncCatalogItemExpandOrCollapseState"
        >
          <IconCustom
            name="ic:round-link"
            class="w-4 h-4"
          />
        </button>

        <button
          class="sidebar-btn text-green-400 hover:text-green-500 active:text-white bg-green-100 active:bg-green-500 border-green-400"
          @click="changeToggleAllCatalogItemState('expand')"
        >
          <IconCustom
            name="ic:round-unfold-more"
            class="w-4 h-4"
          />
        </button>

        <button
          class="sidebar-btn text-red-400 hover:text-red-500 bg-red-100 active:text-white active:bg-red-500 border-red-400"
          @click="changeToggleAllCatalogItemState('collapse')"
        >
          <IconCustom
            name="ic:round-unfold-less"
            class="w-4 h-4"
          />
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="sidebar-btn border-purple-400"
          :class="catalogType === 'floatTree' ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="changeCatalogType('floatTree')"
        >
          <IconCustom
            name="icon-park-outline:tree-diagram"
            class="w-4 h-4"
          />
        </button>
        <button
          class="sidebar-btn border-purple-400"
          :class="catalogType === 'floatTree' ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="toggleCatalogFlat"
        >
          <IconCustom
            name="clarity:window-restore-line"
            class="w-4 h-4"
          />
        </button>
      </div>
    </div>
    <!-- catalog content -->
    <div
      id="catalog-container"
      ref="catalogContainer"
      class="flex flex-col scroll-smooth overscroll-none overflow-y-auto"
    >
      <ul
        ref="catalogList"
        class="shrink-0 overscroll-none"
      >
        <CatalogItem
          v-for="catalog in props.catalogs"
          :key="catalog.id"
          :item="catalog"
          :depth="catalog.depth"
        />
      </ul>
    </div>
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
  @apply shrink-0 p-2 sm:p-1 flex justify-center items-center border transition-colors duration-300 rounded
}
</style>
