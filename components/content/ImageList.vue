<script setup lang="ts">
const { flatUnwrap } = useUnwrap()

const props = defineProps({
  height: {
    type: String,
    default: '400px'
  }
})

const imgContainer = ref(null)
const scrollPos = ref<'start' | 'middle' | 'end'>('start')

const imgLength = ref(0)

const showImgIndex = ref(1)
const showImgAlt = ref('')

const showSidebar = ref(false)
const sidebarImgList = ref([])

onMounted(() => {
  if (imgContainer.value) {
    const imgList = imgContainer.value.querySelectorAll('img')

    imgLength.value = imgList.length
    if (imgLength.value > 0) {
      imgList.forEach((item) => {
        sidebarImgList.value.push({
          src: item.src,
          alt: item.alt
        })
      })

      if (imgLength.value > 1) { showSidebar.value = true }

      watch(showImgIndex, () => {
        if (sidebarImgList.value.length > 0) {
          showImgAlt.value = sidebarImgList.value[showImgIndex.value - 1]?.alt
        }
      }, { immediate: true })
    }
  }
})

const onAfterEnterLeft = (el) => {
  el.classList.add('-translate-x-full')
}

const onAfterEnterBottom = (el) => {
  el.classList.add('translate-y-full')
}

const scrollTopHandler = (pos) => {
  if (!imgContainer.value) { return }
  if (pos === 'start') {
    imgContainer.value.scrollTop = 0
  } else if (pos === 'end') {
    imgContainer.value.scrollTop = imgContainer.value.scrollHeight - imgContainer.value.clientHeight
  } else {
    imgContainer.value.scrollTop = pos * imgContainer.value.clientHeight
  }
}

const scrollLeftHandler = (pos) => {
  if (!imgContainer.value) { return }
  if (pos === 'start') {
    imgContainer.value.scrollLeft = 0
  } else if (pos === 'end') {
    imgContainer.value.scrollLeft = imgContainer.value.scrollWidth - imgContainer.value.clientWidth
  } else {
    imgContainer.value.scrollLeft = pos * imgContainer.value.clientWidth
  }
}

let scrollTop = 0
let scrollLeft = 0

const scrollingHandler = () => {
  if (!imgContainer.value) { return }

  if (imgContainer.value.scrollTop !== scrollTop) {
    const scrollTopDistance = imgContainer.value.scrollTop
    scrollTop = imgContainer.value.scrollTop

    if (scrollTopDistance === 0) {
      scrollPos.value = 'start'
    } else if (scrollTopDistance + imgContainer.value.clientHeight >= imgContainer.value.scrollHeight) {
      scrollPos.value = 'end'
    } else {
      scrollPos.value = 'middle'
    }

    showImgIndex.value = Math.ceil(scrollTopDistance / imgContainer.value.clientHeight) + 1
  } else if (imgContainer.value.scrollLeft !== scrollLeft) {
    const scrollLeftDistance = imgContainer.value.scrollLeft
    scrollLeft = imgContainer.value.scrollLeft

    if (scrollLeftDistance === 0) {
      scrollPos.value = 'start'
    } else if (scrollLeftDistance + imgContainer.value.clientWidth >= imgContainer.value.scrollWidth) {
      scrollPos.value = 'end'
    } else {
      scrollPos.value = 'middle'
    }

    showImgIndex.value = Math.round(scrollLeftDistance / imgContainer.value.clientWidth) + 1
  }
}

// click to set zoom image
// the ligtbox which contains a copy of this image will enlarge as large as possible to the page center
// also set the a list image to select at lightbox
const showZoomImage = useShowZoomImage()
const zoomImage = useZoomImage()
const zoomImageList = useZoomImageList()
const currentZoomImage = useCurrentZoomImage()
const doubleClickHandler = (event) => {
  if (event.target) {
    const imageRect = event.target.getBoundingClientRect()
    zoomImage.value = {
      src: event.target.src,
      width: imageRect.width,
      height: imageRect.height,
      x: imageRect.x,
      y: imageRect.y
    }

    currentZoomImage.value = zoomImage.value

    if (imgLength.value > 0) {
      const imgList = imgContainer.value.querySelectorAll('img')

      imgList.forEach((item) => {
        const imgRect = item.getBoundingClientRect()
        zoomImageList.value.push({
          src: item.src,
          alt: item.alt,
          width: imgRect.width,
          height: imgRect.height,
          x: imgRect.x,
          y: imgRect.y
        })
      })
    }

    showZoomImage.value = 'show'
  }
}
</script>
<template>
  <div class="sm:mx-8 lg:mx-0 mt-4 mb-20 sm:mb-4 relative z-10 border border-gray-200 rounded-lg">
    <div
      class="image-list-header p-2 relative z-10 flex justify-between items-center gap-2 bg-gray-100 rounded-t-lg shadow shadow-gray-200 "
    >
      <div class="shrink-0 flex space-x-2 items-center">
        <button
          class="btn flex"
          :class="showSidebar ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-400 bg-purple-100 hover:text-purple-500'"
          @click="showSidebar = !showSidebar"
        >
          <IconCustom
            name="bi:layout-sidebar"
            class="w-4 h-4 -rotate-90 sm:rotate-0"
          />
        </button>
        <span class="text-center text-xs text-gray-400">
          {{ showImgIndex }}/{{ imgLength }}
        </span>
      </div>
      <span class="image-text-container grow text-center text-xs text-gray-400 overflow-x-auto">
        {{ showImgAlt }}
      </span>
      <div
        v-show="sidebarImgList.length > 1"
        class="shrink-0 flex space-x-2 items-center"
      >
        <button
          :disabled="scrollPos === 'start'"
          class="btn hidden sm:flex text-purple-400 hover:text-purple-500 active:text-white bg-purple-100 active:bg-purple-500"
          :class="scrollPos === 'start' ? 'opacity-30' : 'opacity-100'"
          @click="scrollTopHandler('start')"
        >
          <IconCustom
            name="material-symbols:vertical-align-top-rounded"
            class="w-4 h-4"
          />
        </button>
        <button
          :disabled="scrollPos === 'end'"
          class="btn hidden sm:flex text-purple-400 hover:text-purple-500 active:text-white bg-purple-100 active:bg-purple-500"
          :class="scrollPos === 'end' ? 'opacity-30' : 'opacity-100'"
          @click="scrollTopHandler('end')"
        >
          <IconCustom
            name="material-symbols:vertical-align-bottom-rounded"
            class="w-4 h-4"
          />
        </button>

        <button
          :disabled="scrollPos === 'start'"
          class="btn flex sm:hidden text-purple-400 hover:text-purple-500 active:text-white bg-purple-100 active:bg-purple-500"
          :class="scrollPos === 'start' ? 'opacity-30' : 'opacity-100'"
          @click="scrollLeftHandler('start')"
        >
          <IconCustom
            name="material-symbols:vertical-align-bottom-rounded"
            class="w-4 h-4 rotate-90"
          />
        </button>
        <button
          :disabled="scrollPos === 'end'"
          class="btn flex sm:hidden text-purple-400 hover:text-purple-500 active:text-white bg-purple-100 active:bg-purple-500"
          :class="scrollPos === 'end' ? 'opacity-30' : 'opacity-100'"
          @click="scrollLeftHandler('end')"
        >
          <IconCustom
            name="material-symbols:vertical-align-top-rounded"
            class="w-4 h-4 rotate-90"
          />
        </button>
      </div>
    </div>
    <div
      ref="imgContainer"
      class="image-list-container flex sm:flex-col bg-gray-50 rounded-b-lg overflow-auto snap-mandatory snap-both"
      :style="`height: ${props.height}`"
      @scroll.passive="scrollingHandler"
    >
      <template v-for="(item, index) of (flatUnwrap($slots.default(), ['p'])) as any">
        <div
          v-if="item?.type?.tag === 'img'"
          :key="index"
          class="shrink-0 w-full h-full flex justify-center items-center"
        >
          <img
            :src="item.props.src"
            :alt="item.props.alt"
            @dblclick="doubleClickHandler"
          >
        </div>
      </template>
    </div>
    <Transition
      enter-from-class="translate-x-0"
      enter-active-class="transition-transform duration-200 ease-in"
      enter-to-class="-translate-x-full"
      leave-from-class="-translate-x-full"
      leave-active-class="transition-transform duration-75 ease-out"
      leave-to-class="translate-x-0"
      @after-enter="onAfterEnterLeft"
    >
      <div
        v-show="sidebarImgList.length > 0 && showSidebar"
        class="sidebar-image-list p-2 absolute left-0 inset-y-0 -z-10 hidden sm:flex flex-col space-y-2 bg-gray-100 rounded-lg border border-gray-200 overflow-y-auto overscroll-y-none"
      >
        <button
          v-for="(item, index) in sidebarImgList"
          :key="index"
          class="shrink-0 w-12 h-12 ring rounded overflow-hidden"
          :class="showImgIndex - 1 === index ? 'ring-purple-400' : 'ring-transparent'"
          @click="scrollTopHandler(index)"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            class="mx-auto max-h-full"
          >
        </button>
      </div>
    </Transition>
    <Transition
      enter-from-class="translate-y-0"
      enter-active-class="transition-transform duration-200 ease-in"
      enter-to-class="translate-y-full"
      leave-from-class="translate-y-full"
      leave-active-class="transition-transform duration-75 ease-out"
      leave-to-class="translate-y-0"
      @after-enter="onAfterEnterBottom"
    >
      <div
        v-show="sidebarImgList.length > 0 && showSidebar"
        class="sidebar-image-list p-2 absolute inset-x-0 bottom-0 -z-10 flex sm:hidden space-x-2 bg-gray-100 rounded-lg border border-gray-200 overflow-x-auto"
      >
        <button
          v-for="(item, index) in sidebarImgList"
          :key="index"
          class="shrink-0 w-12 h-12 ring rounded overflow-hidden"
          :class="showImgIndex - 1 === index ? 'ring-purple-400' : 'ring-transparent'"
          @click="scrollLeftHandler(index)"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            class="mx-auto max-h-full"
          >
        </button>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.image-list-container, .image-text-container {
  &::-webkit-scrollbar {
    display: none;
  }
}

.image-list-container {
  @apply scroll-smooth;

  img {
    @apply max-h-full snap-center;
  }
}

.image-list-header {
  .btn {
    @apply p-1.5 justify-center items-center rounded transition-colors duration-300;
  }
}

.sidebar-image-list::-webkit-scrollbar {
  display: none;
}
</style>
