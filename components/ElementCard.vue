<script setup lang="ts">
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
  }
})

const emits = defineEmits(['spanAll'])

const headingArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const headingColorMap = {
  h1: 'text-gray-800',
  h2: 'text-purple-500',
  h3: 'text-red-500',
  h4: 'text-green-500',
  h5: 'text-blue-500',
  h6: 'text-gray-500'
}

const headingHighlightBgColorMap = {
  h1: 'bg-gray-100',
  h2: 'bg-purple-100',
  h3: 'bg-red-100',
  h4: 'bg-green-100',
  h5: 'bg-blue-100',
  h6: 'bg-gray-100'
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

const expandState = ref(true)
const headingElem = ref(null)
/**
 *
 * layout
 *
 */
const layout = ref('waterfall')
const divideColumns = ref(0)
const highlightTitle = ref(false)

const setLayoutHandler = (value: 'waterfall' | 'compact' | 'card') => {
  layout.value = value

  if (layout.value === 'compact') {
    divideColumns.value = 3
    emits('spanAll', true)
  } else if (childrenSpanAllNum.value === 0) {
    emits('spanAll', false)
  }

  if (headingElem.value) {
    nextTick(() => {
      headingElem.value.focus()
      highlightTitle.value = true
      const timer = setTimeout(() => {
        highlightTitle.value = false
        clearTimeout(timer)
      }, 1000)
    })
  }
}

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
</script>

<template>
  <div
    class="focus:outline-none"
    :class="(childrenSpanAllNum > 0 || layout === 'compact') ? 'my-2' : ''"
    :style="(childrenSpanAllNum > 0 || layout === 'compact') ? 'column-span: all' : ''"
  >
    <div
      v-if="headingArr.includes(props.elem.type)"
      ref="headingElem"
      tabindex="0"
      class="container mx-auto lg:max-w-4xl p-2 my-1 flex flex-wrap items-center gap-2 rounded-md transition-colors duration-500"
      :class="highlightTitle ? `${headingHighlightBgColorMap[props.elem.type]}` : ''"
      :style="props.elem.type === 'h1' ? 'justify-content: center': 'justify-content: flex-start'"
    >
      <div class="shrink-0 flex gap-0.5">
        <button
          class="p-1 flex justify-center items-center text-xs border rounded-md transition-colors duration-300"
          :class="expandState ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="expandState = !expandState"
        >
          <span>{{ props.elem.type.toUpperCase() }}</span>
        </button>
        <sup class="text-xs opacity-30" :class="`${headingColorMap[props.elem.type]}`">{{ props.order }}</sup>
      </div>

      <ContentRendererMarkdown
        class="shrink-0 font-bold"
        :class="headingColorMap[props.elem.type]"
        :value="{ body: { type: 'root', children: [props.elem.node] } }"
        :excerpt="false"
      />
      <div />

      <div
        class="shrink-0 flex justify-start items-center gap-2 opacity-10 hover:opacity-100 transition-opacity duration-300"
      >
        <button
          class="p-1 flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'waterfall' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="setLayoutHandler('waterfall')"
        >
          <IconCustom name="tabler:layout-list" class="w-4 h-4" />
        </button>
        <button
          class="p-1 flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'compact' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="setLayoutHandler('compact')"
        >
          <IconCustom name="tabler:layout-board" class="w-4 h-4" />
        </button>
        <button
          class="p-1 flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="layout === 'card' ? `${headingBtnMap[props.elem.type].expand}` : `${headingBtnMap[props.elem.type].collapse}`"
          @click="setLayoutHandler('card')"
        >
          <IconCustom name="tabler:versions" class="w-4 h-4" />
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
      v-show="expandState"
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
      v-show="expandState"
      :class="layout === 'compact' ? 'gap-x-2' : ''"
      :style="layout === 'compact' ? `columns: ${divideColumns}` : ''"
    >
      <ElementCard
        v-for="(subElem, index) in props.elem.children"
        :key="index"
        :elem="subElem"
        :order="index+1"
        :class="layout === 'compact' ? `p-2 mb-2 h-fit border rounded break-inside-avoid ${borderColorMap[subElem.type]}` : ''"
        @span-all="childrenSpanAllHandler"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
