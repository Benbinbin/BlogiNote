<script setup lang="ts">
import type { Ref } from 'vue'

const props = defineProps<{
  item: CatalogItemType,
  depth: number
}>()

interface CatalogItemType {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItemType[]
}

const catalogType = useState('catalogType')

/**
 *
 * color style
 *
 */
// #region color
interface BtnBgColorItemType {
  withChildren: string;
  withoutChildren: string;
}

interface BtnBgColorMapType {
  [key: number]: BtnBgColorItemType,
}

const btnBgColorMap: BtnBgColorMapType = {
  2: {
    withChildren: 'bg-purple-500',
    withoutChildren: 'bg-purple-200',
  },
  3: {
    withChildren: 'bg-red-500',
    withoutChildren: 'bg-red-200',
  },
  4: {
    withChildren: 'bg-green-500',
    withoutChildren: 'bg-green-200',
  },
  5: {
    withChildren: 'bg-blue-500',
    withoutChildren: 'bg-blue-200',
  },
  6: {
    withChildren: 'bg-gray-500',
    withoutChildren: 'bg-gray-200',
  }
}

interface TextColorItemType {
  normal: string;
  hover: string;
}

interface TextColorMapType {
  [key: number]: TextColorItemType
}

const textColorMap: TextColorMapType = {
  2: {
    normal: 'text-purple-500',
    hover: 'hover:text-purple-500'
  },
  3: {
    normal: 'text-red-500',
    hover: 'hover:text-red-500'
  },
  4: {
    normal: 'text-green-500',
    hover: 'hover:text-green-500'
  },
  5: {
    normal: 'text-blue-500',
    hover: 'hover:text-blue-500'
  },
  6: {
    normal: 'text-gray-500',
    hover: 'hover:text-gray-500'
  }
}

interface textDecorationOrBgColorMapType {
  [key: number]: string,
}

const textDecorationColorMap: textDecorationOrBgColorMapType = {
  2: 'decoration-purple-500',
  3: 'decoration-red-500',
  4: 'decoration-green-500',
  5: 'decoration-blue-500',
  6: 'decoration-gray-500',
}

const textHoverBgColorMap: textDecorationOrBgColorMapType = {
  2: 'hover:bg-purple-100',
  3: 'hover:bg-red-100',
  4: 'hover:bg-green-100',
  5: 'hover:bg-blue-100',
  6: 'hover:bg-gray-100',
}

interface BorderColorItemType {
  active: string;
  expand: string;
  collapse: string;
}

interface BorderColorMapType {
  [key: number]: BorderColorItemType
}

const borderColorMap: BorderColorMapType = {
  2: {
    active: 'border-purple-500',
    expand: 'border-purple-300',
    collapse: 'border-purple-100'
  },
  3: {
    active: 'border-red-500',
    expand: 'border-red-300',
    collapse: 'border-red-100'
  },
  4: {
    active: 'border-green-500',
    expand: 'border-green-300',
    collapse: 'border-green-100'
  },
  5: {
    active: 'border-blue-500',
    expand: 'border-blue-300',
    collapse: 'border-blue-100'
  },
  6: {
    active: 'border-gray-500',
    expand: 'border-gray-300',
    collapse: 'border-gray-100'
  }
}
// #endregion

/**
 *
 * active heading
 *
 */
const activeHeading = inject<string | undefined>(`activeH${props.depth}Heading`)

/**
 *
 * toggle heading
 * (collapse or expand)
 *
 */
// record and sync collapse headings
const collapsedHeadingsSet = inject('collapsedHeadingsSet') as Ref<Set<string>>

const expand = computed(() => !collapsedHeadingsSet.value.has(props.item.id) )

const collapseHeadingHandler = inject('collapseHeadingHandler') as (headingId: string) => void
const expandHeadingHandler = inject('expandHeadingHandler') as (headingId: string) => void

const toggleCatalogHandler = () => {
  // expand.value = !expand.value
  // changeToggleAllCatalogItemState('')

  if(collapsedHeadingsSet.value.has(props.item.id)) {
    expandHeadingHandler(props.item.id)
  } else {
    collapseHeadingHandler(props.item.id)
  }
}
</script>

<template>
  <li>
    <div
      class="shrink-0 px-2 flex items-center"
    >
      <div
        class="shrink-0 self-stretch pr-4 py-2 flex justify-center items-center border-r"
        :class="activeHeading === props.item.id ? ` ${borderColorMap[props.depth].active} border-solid` : `${borderColorMap[props.depth].expand} border-dashed`"
      >
        <p
          class="text-xs font-thin"
          :class="`${textColorMap[props.depth].normal}`"
        >
          H{{ props.depth }}
        </p>
      </div>

      <button
        class="shrink-0 flex justify-center items-center border-[3px] rounded-full -translate-x-2.5"
        :class="props.item.children ? `${borderColorMap[props.depth].expand} ${btnBgColorMap[props.depth].withChildren}` : `${borderColorMap[props.depth].collapse} ${btnBgColorMap[props.depth].withoutChildren}`"
        :disabled="!props.item.children"
        @click="toggleCatalogHandler"
      >
        <IconCustom
          v-if="props.item.children"
          name="ion:add"
          class="w-3.5 h-3.5 text-white transition-transform duration-500 delay-300"
          :class="expand ? 'rotate-45' : 'rotate-0'"
        />
        <div
          v-else
          class="w-3.5 h-3.5"
        />
      </button>

      <a
        :href="`#${props.item.id}`"
        class="py-2 px-2 text-sm text-left underline transition-colors duration-300 rounded"
        :class="activeHeading === props.item.id ? `${textColorMap[props.depth].normal} ${textColorMap[props.depth].hover} ${textHoverBgColorMap[props.depth]} ${textDecorationColorMap[props.depth]}` : `text-gray-500 ${textColorMap[props.depth].hover} ${textHoverBgColorMap[props.depth]} decoration-transparent`"
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
        :class="catalogType === 'floatList' ? 'ml-5' : ''"
      >
        <!-- recursive components to show the tree structure -->
        <ListCatalogItem
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
