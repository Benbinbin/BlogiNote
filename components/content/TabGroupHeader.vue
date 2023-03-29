<script setup lang="ts">
const props = defineProps({
  tabNameArr: {
    type: Array,
    required: true,
  },
  activeTabIndex: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(['update:activeTabIndex'])

const tabsHeaderContainer = ref<HTMLElement | null>(null) // get the tabs header DOM

/**
  *
  * scroll the tabs header
  *
  */
const showScrollBtn = ref(true)

const scrollPos = ref<'start' | 'middle' | 'end'>('start')

const rejudgeShowScrollBtn = () => {
  // show of hide the scroll button
  if (tabsHeaderContainer.value) {
    if (tabsHeaderContainer.value.scrollWidth <= tabsHeaderContainer.value.clientWidth) {
      showScrollBtn.value = false
    } else {
      showScrollBtn.value = true
    }

    if (tabsHeaderContainer.value.scrollLeft + tabsHeaderContainer.value.clientWidth >= tabsHeaderContainer.value.scrollWidth) {
      scrollPos.value = 'end'
    } else if (tabsHeaderContainer.value.scrollLeft === 0) {
      scrollPos.value = 'start'
    } else {
      scrollPos.value = 'middle'
    }
  }
}

const windowSize = useWindowSize()
onMounted(() => {
  rejudgeShowScrollBtn()

  // watch window size change
  // and rejudge showing scroll or note
  watch(() => windowSize.value.width, () => {
    rejudgeShowScrollBtn()
  })
})

const scrollTabsHeaderHandler = (direction:('left' | 'right')) => {
  if (!tabsHeaderContainer.value) { return }
  const containerWidth = tabsHeaderContainer.value.clientWidth

  if (direction === 'left') {
    tabsHeaderContainer.value.scrollLeft -= containerWidth
  } else if (direction === 'right') {
    tabsHeaderContainer.value.scrollLeft += containerWidth
  }
}

const tabsHeaderScrollingHandler = () => {
  if (tabsHeaderContainer.value) {
    if (tabsHeaderContainer.value.scrollLeft + tabsHeaderContainer.value.clientWidth >= tabsHeaderContainer.value.scrollWidth) {
      scrollPos.value = 'end'
    } else if (tabsHeaderContainer.value.scrollLeft === 0) {
      scrollPos.value = 'start'
    } else {
      scrollPos.value = 'middle'
    }
  }
}
</script>

<template>
  <div class="w-full p-2 flex justify-between items-center sticky top-0 z-30 bg-gray-100 shadow-md rounded-t">
    <div
      v-if="props.tabNameArr.length > 1"
      ref="tabsHeaderContainer"
      class="tabs-header grow flex justify-start items-center gap-2 overflow-x-auto scroll-smooth"
      @scroll.passive="tabsHeaderScrollingHandler"
    >
      <button
        v-for="(tab, index) in props.tabNameArr"
        :key="index"
        class="shrink-0 px-4 py-2 text-sm rounded transition-colors duration-300"
        :class="index === props.activeTabIndex ? 'bg-gray-300 hover:bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'"
        @click="emits('update:activeTabIndex', index)"
      >
        {{ tab }}
      </button>
    </div>
    <div
      v-show="showScrollBtn"
      class="shrink-0 pl-2 hidden sm:flex items-center gap-0.5"
    >
      <button
        v-show="showScrollBtn"
        :disabled="scrollPos === 'start'"
        class="shrink-0 p-2 items-center bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-300"
        :class="scrollPos === 'start' ? 'opacity-30' : ''"
        @click="scrollTabsHeaderHandler('left')"
      >
        <IconCustom
          name="ic:round-keyboard-arrow-left"
          class="w-4 h-4"
        />
      </button>
      <button
        v-show="showScrollBtn"
        :disabled="scrollPos === 'end'"
        class="shrink-0 p-2 items-center bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-300"
        :class="scrollPos === 'end' ? 'opacity-30' : ''"
        @click="scrollTabsHeaderHandler('right')"
      >
        <IconCustom
          name="ic:round-keyboard-arrow-right"
          class="w-4 h-4"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs-header {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>