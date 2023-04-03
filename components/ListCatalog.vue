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
 * manual toggle catalog float state
 *
 */
const toggleSidebarFloatForBlog = useToggleBlogSidebarFloat()

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
  <div>
    <!-- control buttons container -->
    <div
      class="sidebar-btn-container py-2 flex justify-start items-center gap-x-8 overflow-x-auto"
    >
      <div class="flex items-center gap-2">
        <button
          class="sidebar-btn flex text-purple-400 hover:text-purple-500 active:text-white bg-purple-100 active:bg-purple-500 border border-purple-400"
          @click="toggleAllCatalogState = 'expand'"
        >
          <IconCustom
            name="ic:round-link"
            class="w-4 h-4"
          />
        </button>

        <button
          class="sidebar-btn flex text-green-400 hover:text-green-500 active:text-white bg-green-100 active:bg-green-500 border border-green-400"
          @click="toggleAllCatalogState = 'expand'"
        >
          <IconCustom
            name="ic:round-unfold-more"
            class="w-4 h-4"
          />
        </button>

        <button
          class="sidebar-btn flex bg-red-100 text-red-400 hover:text-red-500 active:text-white active:bg-red-500 border border-red-400"
          @click="toggleAllCatalogState = 'collapse'"
        >
          <IconCustom
            name="ic:round-unfold-less"
            class="w-4 h-4"
          />
        </button>

        <slot />
      </div>

      <button
        class="shrink-0 hidden xl:flex p-1 justify-center items-center text-purple-400 hover:text-purple-500 bg-purple-100 border border-purple-400 rounded transition-colors duration-300"
        @click="toggleSidebarFloatForBlog = !toggleSidebarFloatForBlog"
      >
        <IconCustom
          name="clarity:window-restore-line"
          class="w-4 h-4"
        />
      </button>
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
  @apply shrink-0 p-2 sm:p-1 justify-center items-center transition-colors duration-300 rounded
}
</style>
