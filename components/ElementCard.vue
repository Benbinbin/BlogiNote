<script setup lang="ts">
import { Ref } from 'vue'

const props = defineProps({
  elem: {
    type: Object,
    default: () => {
      return {}
    }
  },
  order: {
    type: Number,
    default: 1
  },
  count: {
    type: Number,
    default: 1
  }
})

const emits = defineEmits(['spanAll'])

const headingElem = ref(null)

/**
 *
 * heading style mapping
 *
 */
const headingArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const headingColorMap = {
  h1: 'text-gray-800',
  h2: 'text-purple-500',
  h3: 'text-red-500',
  h4: 'text-green-500',
  h5: 'text-blue-500',
  h6: 'text-gray-500'
}

const headingBtnMap = {
  h1: {
    expand: 'text-white bg-gray-500 hover:bg-gray-400 active:bg-gray-500 border-gray-500',
    collapse: 'text-gray-400 hover:text-gray-500 active:text-white active:bg-gray-500 border-gray-500'
  },
  h2: {
    expand: 'text-white bg-purple-500 hover:bg-purple-400 active:bg-purple-500 border-purple-500',
    collapse: 'text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border-purple-500'
  },
  h3: {
    expand: 'text-white bg-red-500 hover:bg-red-400 active:bg-red-500 border-red-500',
    collapse: 'text-red-400 hover:text-red-500 active:text-white active:bg-red-500 border-red-500'
  },
  h4: {
    expand: 'text-white bg-green-500 hover:bg-green-400 active:bg-green-500 border-green-500',
    collapse: 'text-green-400 hover:text-green-500 active:text-white active:bg-green-500 border-green-500'
  },
  h5: {
    expand: 'text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-500 border-blue-500',
    collapse: 'text-blue-400 hover:text-blue-500 active:text-white active:bg-blue-500 border-blue-500'
  },
  h6: {
    expand: 'text-white bg-gray-500 hover:bg-gray-400 active:bg-gray-500 border-gray-500',
    collapse: 'text-gray-400 hover:text-gray-500 active:text-white active:bg-gray-500 border-gray-500'
  }
}

const borderColorMap = {
  h1: 'border-gray-100',
  h2: 'border-purple-100',
  h3: 'border-red-100',
  h4: 'border-green-100',
  h5: 'border-blue-100',
  h6: 'border-gray-100'
}

/**
 *
 * expand or collapse heading section
 */
const initCollapseHeadings = ref(new Set<string>())
const collapseHeadings = inject('collapseHeadings', initCollapseHeadings)

const toggleExpandStateHandler = () => {
  const id = props.elem.node.props.id
  if (collapseHeadings.value.has(id)) {
    collapseHeadings.value.delete(id)
  } else {
    collapseHeadings.value.add(id)
  }
}

/**
 *
 * active heading
 *
 */
const highlightTitle = ref(false)

const activeHeadingId = inject<Ref<string>>('activeHeadingId')
const setActiveHeadingId = inject<(string) => void>('setActiveHeadingId')

const highlightColorMap = {
  h1: 'bg-gray-100',
  h2: 'bg-purple-100',
  h3: 'bg-red-100',
  h4: 'bg-green-100',
  h5: 'bg-blue-100',
  h6: 'bg-gray-100'
}

watch(activeHeadingId, () => {
  if (activeHeadingId.value === props.elem.node.props.id && headingElem.value) {
    headingElem.value.scrollIntoView(true)
    highlightTitle.value = true
    const timer = setTimeout(() => {
      highlightTitle.value = false
      clearTimeout(timer)
      setActiveHeadingId('')
    }, 2000)
  }
})

/**
 *
 * layout
 *
 */
const layout = ref('waterfall')

const setLayoutHandler = (value: 'waterfall' | 'compact' | 'card') => {
  layout.value = value

  if (layout.value === 'compact') {
    // divideColumns.value = 3
    emits('spanAll', true)
  } else if (childrenSpanAllNum.value === 0) {
    emits('spanAll', false)
  }

  if (headingElem.value) {
    nextTick(() => {
      headingElem.value.scrollIntoView(true)
      highlightTitle.value = true
      const timer = setTimeout(() => {
        highlightTitle.value = false
        clearTimeout(timer)
      }, 2000)
    })
  }
}

const toggleLayoutForContent = () => {
  if (layout.value === 'waterfall') {
    setLayoutHandler('compact')
  } else {
    setLayoutHandler('waterfall')
  }
}

// compact layout
const childrenSpanAllNum = ref(0)

const childrenSpanAllHandler = (state) => {
  if (state) {
    childrenSpanAllNum.value += 1
  } else {
    childrenSpanAllNum.value -= 1
  }
}

watch(childrenSpanAllNum, (newNum, oldNum) => {
  if (oldNum > 0 && newNum === 0) {
    emits('spanAll', false)
  } else if (oldNum === 0 && newNum > 0) {
    emits('spanAll', true)
  }
})

// divide columns
const childrenDivideColumns = ref(1)
const divideColumns = inject<Ref<number>>('divideColumns')

watch(divideColumns, () => {
  if (syncChangeColumns.value) {
    childrenDivideColumns.value = Math.min(divideColumns.value, props.elem.children.length)
  }
})

const syncChangeColumns = ref(true)

const changeSyncState = () => {
  syncChangeColumns.value = !syncChangeColumns.value

  if (syncChangeColumns.value) {
    childrenDivideColumns.value = divideColumns.value
  }
}

onMounted(() => {
  if ((props.elem.children && props.elem.children.length > 1) && document.documentElement.clientWidth && document.documentElement.clientWidth >= 1000) {
    const recommendColumns = Math.floor(document.documentElement.clientWidth / 500)

    childrenDivideColumns.value = Math.min(recommendColumns, props.elem.children.length)

    layout.value = 'compact'
    emits('spanAll', true)
  }
})

const changeChildrenDivideColumns = (event) => {
  if (event.shiftKey) {
    childrenDivideColumns.value += 1
  } else if (event.ctrlKey || event.metaKey) {
    childrenDivideColumns.value = Math.max(childrenDivideColumns.value - 1, 1)
  } else {
    let columns = childrenDivideColumns.value + 1
    if (columns > divideColumns.value) { columns = 1 }
    childrenDivideColumns.value = columns
  }
}
</script>

<template>
  <div
    class="elem-card"
    :class="(childrenSpanAllNum > 0 || layout === 'compact') ? 'my-2' : ''"
    :style="(childrenSpanAllNum > 0 || layout === 'compact') ? 'column-span: all' : ''"
  >
    <div
      v-if="headingArr.includes(props.elem.type)"
      ref="headingElem"
      tabindex="0"
      class="container mx-auto lg:max-w-4xl p-2 my-2 flex flex-wrap items-center gap-2 rounded-md"
      :class="highlightTitle ? `title-highlight-pulse ${highlightColorMap[props.elem.type]}` : ''"
      :style="props.elem.type === 'h1' ? 'justify-content: center': 'justify-content: flex-start'"
    >
      <div class="shrink-0 flex gap-0.5">
        <sup v-if="props.count>1" class="text-xs opacity-30" :class="`${headingColorMap[props.elem.type]}`">{{
          `${props.order}/${props.count}` }}</sup>
        <button
          class="p-1 flex justify-center items-center text-xs border rounded-md transition-colors duration-300"
          :class="!collapseHeadings.has(props.elem.node.props.id) ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="toggleExpandStateHandler"
        >
          <span>{{ props.elem.type.toUpperCase() }}</span>
        </button>
      </div>

      <ContentRendererMarkdown
        class="shrink-0 font-bold"
        :class="headingColorMap[props.elem.type]"
        :value="{ body: { type: 'root', children: [props.elem.node] } }"
        :excerpt="false"
      />
      <div />

      <div
        class="shrink-0 flex justify-start items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300"
      >
        <button
          v-show="layout !== 'waterfall'"
          v-if="props.elem.children && props.elem.children.length > 0"
          class="p-1 flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'waterfall' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="setLayoutHandler('waterfall')"
        >
          <IconCustom name="tabler:layout-list" class="w-4 h-4" />
        </button>

        <button
          v-show="layout !== 'card'"
          v-if="props.elem.children && props.elem.children.length > 0"
          class="p-1 flex md:hidden justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'card' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="setLayoutHandler('card')"
        >
          <IconCustom name="tabler:versions" class="w-4 h-4" />
        </button>

        <button
          v-show="layout !== 'compact'"
          v-if="props.elem.children && props.elem.children.length > 0"
          class="p-1 hidden md:flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'compact' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="setLayoutHandler('compact')"
        >
          <IconCustom name="tabler:layout-board" class="w-4 h-4" />
        </button>

        <div
          v-if="props.elem.children && props.elem.children.length > 0"
          v-show="layout === 'compact'"
          class="hidden sm:block relative"
        >
          <button
            class=" flex justify-center items-center absolute -top-3 -right-2 bg-white rounded-full"
            :class="syncChangeColumns ? 'text-yellow-500 hover:text-yellow-400 ' : 'text-gray-500 hover:text-gray-400'"
            @click="changeSyncState"
          >
            <IconCustom v-show="!syncChangeColumns" name="fluent:arrow-sync-circle-20-regular" class="w-5 h-5" />
            <IconCustom v-show="syncChangeColumns" name="fluent:arrow-sync-circle-20-filled" class="w-5 h-5" />
          </button>
          <button
            class="p-1 flex justify-center items-center border  transition-colors duration-300 rounded-md"
            :class="`${ headingBtnMap[props.elem.type].expand }`"
            @click="changeChildrenDivideColumns"
          >
            <span class="w-4 h-4 text-xs">{{ childrenDivideColumns }}</span>
          </button>
        </div>

        <button
          v-if="!props.elem.children || props.elem.children.length === 0"
          class="p-1 hidden md:flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'compact' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="toggleLayoutForContent"
        >
          <IconCustom name="tabler:arrow-autofit-width" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <ContentRendererMarkdown
      v-else
      class="article-container"
      :value="{ body: { type: 'root', children: [props.elem.node] } }"
    />

    <div
      v-if="props.elem.content.length>0"
      v-show="!collapseHeadings.has(props.elem.node.props.id)"
      class="container mx-auto lg:max-w-4xl"
      :class="layout===''"
    >
      <ContentRendererMarkdown
        v-for="(content, index) in props.elem.content"
        :key="index"
        class="article-container"
        :value="{ body: { type: 'root', children: [content.node] } }"
      />
    </div>

    <div
      v-if="props.elem.children && props.elem.children.length > 0"
      v-show="!collapseHeadings.has(props.elem.node.props.id)"
      class="card-container"
      :class="layout === 'compact' ? 'gap-x-2' : (layout === 'card' ? 'flex gap-2 overflow-x-auto' : '')"
      :style="layout === 'compact' ? `columns: ${childrenDivideColumns}` : ''"
    >
      <ElementCard
        v-for="(subElem, index) in props.elem.children"
        :key="index"
        :elem="subElem"
        :order="index+1"
        :count="props.elem.children.length"
        :class="layout === 'compact' ? `p-2 mb-2 h-fit border rounded break-inside-avoid ${borderColorMap[subElem.type]}` : (layout === 'card' ? 'p-2 border rounded' : '')"
        :style="layout === 'card' ? 'width: fit-content; max-width: 90%; height: fit-content; max-height: 60vh; flex-shrink: 0; overflow-y: auto' : ''"
        @span-all="childrenSpanAllHandler"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

.elem-card {
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
}
.title-highlight-pulse {
  animation: pulse 500ms cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {

    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: .5;
    }
  }
}

.card-container {
  &::-webkit-scrollbar {
      display: none;
    }
}
</style>
