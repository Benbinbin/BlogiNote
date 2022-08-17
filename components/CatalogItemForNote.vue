<script setup lang="ts">
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

/**
 *
 * expand or collapse catalog
 *
 */
const initCollapseHeadings = ref(new Set<string>())
const collapseHeadings = inject('collapseHeadings', initCollapseHeadings)

const toggleCollapseHeadings = inject<(string) => void>('toggleCollapseHeadings')

/**
 *
 * heading style mapping
 *
 */
const bgColorMap = {
  2: { expand: 'bg-purple-500', collapse: 'bg-purple-200' },
  3: { expand: 'bg-red-500', collapse: 'bg-red-200' },
  4: { expand: 'bg-green-500', collapse: 'bg-green-200' },
  5: { expand: 'bg-blue-500', collapse: 'bg-blue-200' },
  6: { expand: 'bg-gray-500', collapse: 'bg-gray-200' }
}

const textColorMap = {
  2: 'text-purple-400',
  3: 'text-red-400',
  4: 'text-green-400',
  5: 'text-blue-400',
  6: 'text-gray-400'
}

const borderColorMap = {
  2: { expand: 'border-purple-200', collapse: 'border-purple-50' },
  3: { expand: 'border-red-200', collapse: 'border-red-50' },
  4: { expand: 'border-green-200', collapse: 'border-green-50' },
  5: { expand: 'border-blue-200', collapse: 'border-blue-50' },
  6: { expand: 'border-gray-200', collapse: 'border-gray-50' }
}

const HeadingBtnTextColorMap = {
  2: 'text-purple-400 hover:text-purple-500',
  3: 'text-red-400 hover:text-red-500',
  4: 'text-green-400 hover:text-green-500',
  5: 'text-blue-400 hover:text-blue-500',
  6: 'text-gray-400 hover:text-gray-500'
}

const headingBtnBgColorMap = {
  2: 'bg-purple-500 hover:bg-purple-400',
  3: 'bg-red-500 hover:bg-red-400',
  4: 'bg-green-500 hover:bg-green-400',
  5: 'bg-blue-500 hover:bg-blue-400',
  6: 'bg-gray-500 hover:bg-gray-400'
}

const headingBtnBorderColorMap = {
  2: 'border-purple-500',
  3: 'border-red-500',
  4: 'border-green-500',
  5: 'border-blue-500',
  6: 'border-gray-500'
}
/**
 *
 * sidebar float state and float catalog type
 *
 */
// sidebar state float or not
const sidebarFloatForNote = useNoteSidebarFloat()
const toggleNoteSidebarFloat = useToggleNoteSidebarFloat()
// float catalog type
const floatNoteCatalogType = useFloatNoteCatalogType()

const buttonStyle = ref('')
const textStyle = ref('')

watch([sidebarFloatForNote, toggleNoteSidebarFloat, floatNoteCatalogType], () => {
  const buttonStyleArr = []
  const textStyleArr = []

  if ((sidebarFloatForNote.value || toggleNoteSidebarFloat.value) && floatNoteCatalogType.value === 'tree') {
    buttonStyleArr.push('order: 3')
    buttonStyleArr.push('transform: translateX(10px)')

    textStyleArr.push('flex-grow: 1')
    textStyleArr.push('order: 2')

    if (!props.item.children) { buttonStyleArr.push('display: none') }
  } else {
    buttonStyleArr.push('order: 2')
    buttonStyleArr.push('transform: translateX(-10px)')

    textStyleArr.push('order: 3')
  }

  buttonStyle.value = buttonStyleArr.join(';')
  textStyle.value = textStyleArr.join(';')
}, {
  immediate: true
})

/**
 *
 * active heading
 *
 */
const setActiveHeadingId = inject<(string) => void>('setActiveHeadingId')
</script>

<template>
  <li
    draggable="false"
    class="flex"
    :class="(sidebarFloatForNote || toggleNoteSidebarFloat) && floatNoteCatalogType === 'tree' ? 'flex-row justify-start items-center' : 'flex-col'"
  >
    <div
      class="shrink-0 flex items-center"
      :class="(sidebarFloatForNote || toggleNoteSidebarFloat) && floatNoteCatalogType === 'tree' ? 'pl-4 w-40 justify-between' : 'px-2'"
    >
      <button
        v-show="(sidebarFloatForNote || toggleNoteSidebarFloat) && floatNoteCatalogType === 'tree'"
        class="shrink-0 order-1 p-1 mr-1 flex justify-center items-center text-xs font-thin border rounded transition-colors duration-300"
        :class="collapseHeadings.has(props.item.id) ? `${HeadingBtnTextColorMap[props.depth]} ${headingBtnBorderColorMap[props.depth]}` : `text-white ${headingBtnBgColorMap[props.depth]} ${headingBtnBorderColorMap[props.depth]}`"
        @click="toggleCollapseHeadings(props.item.id)"
      >
        H{{ props.depth }}
      </button>

      <span
        v-show="!((sidebarFloatForNote || toggleNoteSidebarFloat) && floatNoteCatalogType === 'tree')"
        class="shrink-0 self-stretch order-1 pr-4 py-2 flex justify-center items-center text-xs font-thin border-r border-dashed"
        :class="`${textColorMap[props.depth]}  ${borderColorMap[props.depth].expand}`"
      >
        H{{ props.depth }}
      </span>

      <button
        class="shrink-0 flex justify-center items-center opacity-80 rounded-full border-[3px]"
        :class="collapseHeadings.has(props.item.id) ? `${bgColorMap[props.depth].collapse} ${borderColorMap[props.depth].collapse}` : `${bgColorMap[props.depth].expand} ${borderColorMap[props.depth].expand}`"
        :style="buttonStyle"
        @click="toggleCollapseHeadings(props.item.id)"
      >
        <IconCustom
          v-if="props.item.children"
          name="ion:add"
          class="w-3.5 h-3.5 text-white transition-transform duration-500 delay-300"
          :class="!collapseHeadings.has(props.item.id) ? 'rotate-45' : 'rotate-0'"
        />
        <div v-else class="w-3.5 h-3.5" />
      </button>

      <button
        class="p-2 text-sm text-left text-gray-800 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded"
        :style="textStyle"
        @click="setActiveHeadingId(props.item.id)"
      >
        {{
          props.item.text
        }}
      </button>
      <!-- <a
        :href="`#${props.item.id}`"
        class="p-2 text-sm text-left text-gray-800 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded"
        :class="textClass"
        @click.prevent="setActiveHeadingId(props.item.id)"
      >{{
        props.item.text
      }}</a> -->
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
        v-show="!collapseHeadings.has(props.item.id)"
        :class="(sidebarFloatForNote || toggleNoteSidebarFloat) && floatNoteCatalogType === 'tree' ? `border-l ${borderColorMap[props.depth].expand} space-y-2 rounded-md` : ''"
      >
        <CatalogItemForNote
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
