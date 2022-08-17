<script setup lang="ts">
import type { Ref } from 'vue'

interface CatalogItem {
  id: string;
  depth?: number;
  text: string;
  children?: CatalogItem[]
}

const props = defineProps<{
  item: CatalogItem,
  depth: number
}>()

const toggleAllCatalogState = inject<Ref<string>>('toggleAllCatalogState')
const changeToggleAllCatalogState = inject<(value: 'expand' | 'collapse' | '') => void>('changeToggleAllCatalogState')

const expand = ref(true)

watch(toggleAllCatalogState, () => {
  if (toggleAllCatalogState.value === 'expand') {
    expand.value = true
  } else if (toggleAllCatalogState.value === 'collapse') {
    expand.value = false
  }
})

const toggleCatalogHandler = () => {
  expand.value = !expand.value
  changeToggleAllCatalogState('')
}

const bgColorMap = {
  2: {
    expand: 'bg-purple-500',
    collapse: 'bg-purple-200',
    collapseWithChildren: 'bg-purple-400'
  },
  3: {
    expand: 'bg-red-500',
    collapse: 'bg-red-200',
    collapseWithChildren: 'bg-red-400'
  },
  4: {
    expand: 'bg-green-500',
    collapse: 'bg-green-200',
    collapseWithChildren: 'bg-green-400'
  },
  5: {
    expand: 'bg-blue-500',
    collapse: 'bg-blue-200',
    collapseWithChildren: 'bg-blue-400'
  },
  6: {
    expand: 'bg-gray-500',
    collapse: 'bg-gray-200',
    collapseWithChildren: 'bg-gray-400'
  }
}

const textColorMap = {
  2: 'text-purple-400',
  3: 'text-red-400',
  4: 'text-green-400',
  5: 'text-blue-400',
  6: 'text-gray-400'
}

const borderColorMap = {
  2: { active: 'border-purple-500', expand: 'border-purple-300', collapse: 'border-purple-100' },
  3: { active: 'border-red-500', expand: 'border-red-300', collapse: 'border-red-100' },
  4: { active: 'border-green-500', expand: 'border-green-300', collapse: 'border-green-100' },
  5: { active: 'border-blue-500', expand: 'border-blue-300', collapse: 'border-blue-100' },
  6: { active: 'border-gray-500', expand: 'border-gray-300', collapse: 'border-gray-100' }
}

// sidebar state float or not
const sidebarFloatForBlog = useBlogSidebarFloat()
const toggleBlogSidebarFloat = useToggleBlogSidebarFloat()
// float catalog type
const floatBlogCatalogType = useFloatBlogCatalogType()

const buttonClass = ref('')
const textClass = ref('')

watch([sidebarFloatForBlog, toggleBlogSidebarFloat, floatBlogCatalogType], () => {
  const buttonClassArr = []
  const textClassArr = []

  if ((sidebarFloatForBlog.value || toggleBlogSidebarFloat.value) && floatBlogCatalogType.value === 'tree') {
    buttonClassArr.push('order-3 translate-x-[10px]')
    textClassArr.push('grow order-2')
  } else {
    buttonClassArr.push('order-2 -translate-x-2.5')
    textClassArr.push('order-3')
  }

  if (props.item.children) {
    if (expand.value) {
      buttonClassArr.push(`${borderColorMap[props.depth].expand} ${bgColorMap[props.depth].expand}`)
    } else {
      buttonClassArr.push(`${borderColorMap[props.depth].collapse} ${bgColorMap[props.depth].collapseWithChildren}`)
    }
  } else if ((sidebarFloatForBlog.value || toggleBlogSidebarFloat.value) && floatBlogCatalogType.value === 'tree') {
    buttonClassArr.push('border-transparent')
  } else {
    buttonClassArr.push(`${borderColorMap[props.depth].collapse} ${bgColorMap[props.depth].collapse}`)
  }

  buttonClass.value = buttonClassArr.join(' ')
  textClass.value = textClassArr.join(' ')
}, {
  immediate: true
})

// active heading
const initActiveHeadings = ref(new Set<string>())
const activeHeadings = inject('activeHeadings', initActiveHeadings)
</script>

<template>
  <li
    draggable="false"
    class="flex"
    :class="(sidebarFloatForBlog || toggleBlogSidebarFloat) && floatBlogCatalogType === 'tree' ? 'flex-row justify-start items-center' : 'flex-col'"
  >
    <div
      class="shrink-0 flex items-center"
      :class="(sidebarFloatForBlog || toggleBlogSidebarFloat) && floatBlogCatalogType === 'tree' ? 'pl-4 w-40 justify-between' : 'px-2'"
    >
      <div
        class="shrink-0 self-stretch order-1 py-2 flex justify-center items-center border-r"
        :class="(sidebarFloatForBlog || toggleBlogSidebarFloat) && floatBlogCatalogType === 'tree' ? 'border-transparent' : (activeHeadings.has(props.item.id) ? `pr-4 ${borderColorMap[props.depth].active} border-solid ` : `pr-4 ${borderColorMap[props.depth].expand} border-dashed`)"
      >
        <p class="text-xs font-thin" :class="`${textColorMap[props.depth]}`">
          H{{ props.depth }}
        </p>
      </div>

      <button
        class="shrink-0 flex justify-center items-center rounded-full border-[3px]"
        :class="buttonClass"
        :disabled="!props.item.children"
        @click="toggleCatalogHandler"
      >
        <IconCustom
          v-if="props.item.children"
          name="ion:add"
          class="w-3.5 h-3.5 text-white transition-transform duration-500 delay-300"
          :class="expand ? 'rotate-45' : 'rotate-0'"
        />
        <div v-else class="w-3.5 h-3.5" />
      </button>

      <a
        :href="`#${props.item.id}`"
        class="py-2 px-2 text-sm text-left text-gray-800 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded"
        :class="textClass"
        :style="activeHeadings.has(props.item.id) ? 'font-weight: bold' : ''"
      >{{
        props.item.text }}</a>
    </div>

    <Transition
      enter-from-class="translate-x-10 opacity-0"
      enter-active-class="transition-all duration-300 ease-in-out"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-100 ease-out"
      leave-to-class="translate-x-10 opacity-0"
    >
      <ul
        v-if="props.item.children"
        v-show="expand"
        :class="(sidebarFloatForBlog || toggleBlogSidebarFloat) && floatBlogCatalogType === 'tree' ? `border-l ${borderColorMap[props.depth].expand} space-y-2 rounded-md` : ''"
      >
        <CatalogItemForBlog
          v-for="subItem in props.item.children"
          :key="subItem.id"
          :item="subItem"
          :depth="subItem.depth || props.depth+1"
        />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>

</style>
