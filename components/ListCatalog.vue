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
  if(value === 'sidebarList') {
    toggleCatalogFloat.value = false
  } else {
    toggleCatalogFloat.value = true
  }
  catalogType.value = value
}

const toggleFloatCatalogTypeHandler = () => {
  if(catalogType.value === 'floatTree') {
    changeCatalogType('floatList')
  } else {
    changeCatalogType('floatTree')
  }
}

const toggleCatalogFloatHandler = () => {
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
const syncCatalogToggleState = useState('syncCatalogToggleState')

// const changeToggleAllCatalogItemState = inject<(value: 'expand' | 'collapse' | '') => void>('changeToggleAllCatalogItemState') as Function
const collapseAllHeadingsHandler = inject('collapseAllHeadingsHandler') as () => void
const expandAllHeadingsHandler = inject('expandAllHeadingsHandler') as () => void
</script>

<template>
  <div class="group">
    <!-- control buttons container -->
    <div
      class="catalog-btn-container shrink-0 py-2 flex items-center gap-x-8 overflow-x-auto transition-opacity duration-500"
      :class="catalogType === 'sidebarList' ? 'justify-start opacity-100 xl:opacity-10 group-hover:xl:opacity-100' : 'justify-between'"
    >
      <div class="flex items-center gap-2">
        <button
          class="catalog-btn flex border-purple-400"
          :class="syncCatalogToggleState ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="syncCatalogToggleState = !syncCatalogToggleState"
        >
          <IconCustom
            name="ic:outline-link"
            class="w-4 h-4"
          />
        </button>

        <button
          class="catalog-btn flex text-green-400 hover:text-green-500 active:text-white bg-green-100 active:bg-green-500 border-green-400"
          @click="expandAllHeadingsHandler"
        >
          <IconCustom
            name="ic:outline-unfold-more"
            class="w-4 h-4"
          />
        </button>

        <button
          class="catalog-btn flex text-red-400 hover:text-red-500 bg-red-100 active:text-white active:bg-red-500 border-red-400"
          @click="collapseAllHeadingsHandler"
        >
          <IconCustom
            name="ic:outline-unfold-less"
            class="w-4 h-4"
          />
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="catalog-btn flex border-purple-400"
          :class="catalogType === 'floatTree' ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="toggleFloatCatalogTypeHandler"
        >
          <IconCustom
            name="ic:outline-account-tree"
            class="w-4 h-4"
          />
        </button>
        <button
          class="catalog-btn hidden xl:flex border-purple-400"
          :class="(catalogType === 'floatTree' || catalogType === 'floatList') ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="toggleCatalogFloatHandler"
        >
          <IconCustom
            :name="catalogType === 'sidebarList' ? 'mingcute:miniplayer-line' : 'mingcute:expand-player-line'"
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
        <ListCatalogItem
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
#catalog-container, .catalog-btn-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
.catalog-btn {
  @apply shrink-0 p-2 sm:p-1 justify-center items-center border transition-colors duration-300 rounded
}
</style>
