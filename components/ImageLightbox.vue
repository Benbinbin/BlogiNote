<script setup lang="ts">
import type { ZoomImageType } from '../composables/states'
const showZoomImage = useShowZoomImage()
const zoomImage = useZoomImage()
const currentZoomImg = useCurrentZoomImage()
const zoomImageList = useZoomImageList()
const showBlurBg = ref(false)

/**
 *
 * zoom image
 *
 */
const zoomImageState = useShowZoomImage()

const changeCurrentZoomImage = (target:('prev' | 'next')) => {
  if (zoomImageList.value.length === 0) { return }
  const index = zoomImageList.value.findIndex((item) => {
    return item.src === currentZoomImg.value?.src
  })
  if (index === -1) { return }

  if (target === 'prev') {
    if (index === 0) {
      currentZoomImg.value = zoomImageList.value[zoomImageList.value.length - 1]
    } else {
      currentZoomImg.value = zoomImageList.value[index - 1]
    }
  } else if (target === 'next') {
    if (index === zoomImageList.value.length - 1) {
      currentZoomImg.value = zoomImageList.value[0]
    } else {
      currentZoomImg.value = zoomImageList.value[index + 1]
    }
  }
}

const lightboxKeyListener = function (event:KeyboardEvent) {
  if (event.key === 'Escape') {
    // press Esc key to hide lightbox
    zoomImageState.value = 'hiding'
  } else if (event.key === 'ArrowLeft') {
    changeCurrentZoomImage('prev')
    transformInitial()
  } else if (event.key === 'ArrowRight') {
    changeCurrentZoomImage('next')
    transformInitial()
  }
}

onMounted(() => {
  watch(showZoomImage, () => {
    if (document) {
      if (showZoomImage.value !== 'hidden') {
        document.addEventListener('keyup', lightboxKeyListener)
      } else {
        document.removeEventListener('keyup', lightboxKeyListener)
      }
    }
  })
})

// onUnmounted(() => {
//   document.removeEventListener('keyup', lightboxKeyListener)
// })

/**
 *
 * image list scroll
 *
 */
const zoomImageListContainer = ref<HTMLElement | null>(null)
const showScrollBtns = ref(false)
const windowSize = useWindowSize()
onMounted(() => {
  if (!zoomImageListContainer.value) { return }
  if (zoomImageListContainer.value.scrollWidth > zoomImageListContainer.value.offsetWidth) { showScrollBtns.value = true }

  watch(() => windowSize.value.width, () => {
    if (zoomImageListContainer.value && zoomImageListContainer.value.scrollWidth > zoomImageListContainer.value.offsetWidth) {
      showScrollBtns.value = true
    } else {
      showScrollBtns.value = false
    }
  })
})

const scrollPos = ref<'start' | 'middle' | 'end'>('start')
const scrollingHandler = () => {
  if (!zoomImageListContainer.value) { return }
  if (zoomImageListContainer.value.scrollLeft === 0) {
    scrollPos.value = 'start'
  } else if (zoomImageListContainer.value.scrollLeft + zoomImageListContainer.value.offsetWidth >= zoomImageListContainer.value.scrollWidth) {
    scrollPos.value = 'end'
  } else {
    scrollPos.value = 'middle'
  }
}

const scrollHandler = (direction:('left' | 'right')) => {
  if (!zoomImageListContainer.value) { return }
  if (direction === 'left') {
    zoomImageListContainer.value.scrollLeft -= zoomImageListContainer.value.offsetWidth
  } else if (direction === 'right') {
    zoomImageListContainer.value.scrollLeft += zoomImageListContainer.value.offsetWidth
  }
}

// set current zoom image when click the image list item
const setCurrentZoomImg = (item: ZoomImageType) => {
  currentZoomImg.value = item
  transformInitial()
}

const image = ref<HTMLElement | null>(null) // get the image DOM

const width = ref(0)
const height = ref(0)
const opacity = ref(1)
const scale = ref(1)
let translateX = 0
let translateY = 0
let translateStartPointX = 0
let translateStartPointY = 0
const transformValue = ref('translate(0px, 0px) scale(1)')

const resetTransform = (type = 'screen') => {
  if (type === 'origin') {
    width.value = 0
    height.value = 0
  }

  opacity.value = 1
  scale.value = 1
  translateX = 0
  translateY = 0
  translateStartPointX = 0
  translateStartPointY = 0
  transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
}

/**
 *
 * show or hide transition
 * refer to https://github.dev/mvoloskov/fast-image-zoom
 *
 */
// toggle image class name
const toggleImageClassName = (action = 'add') => {
  if (!image.value) { return }
  if (action === 'add') {
    image.value.classList.add('transition-all')
    image.value.classList.add('duration-100')
    image.value.classList.add('ease-in-out')
  } else {
    image.value.classList.remove('transition-all')
    image.value.classList.remove('duration-100')
    image.value.classList.remove('ease-in-out')
  }
}

// image init size and position before zoom
const transitionInitial = () => {
  if (!currentZoomImg.value || !document?.documentElement || !window) { return }

  // the zoomImage init size
  width.value = currentZoomImg.value.width
  height.value = currentZoomImg.value.height

  // get the translate and scale between current/expect state and zoomImage init position
  const windowWidth = document.documentElement.clientWidth
  translateX = -(windowWidth / 2 - (currentZoomImg.value.x + currentZoomImg.value.width / 2))
  // const windowHeight = document.documentElement.clientHeight
  const windowHeight = window.innerHeight // the zoom animation may be weird when mobile browser with url bar because the window height

  translateY = -(windowHeight / 2 - (currentZoomImg.value.y + currentZoomImg.value.height / 2))
  scale.value = 1

  transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
}

// zoomImage init size before transform
const transformInitial = () => {
  if (currentZoomImg.value && document.documentElement && window) {
    const windowWidth = document.documentElement.clientWidth
    // const windowHeight = document.documentElement.clientHeight
    const windowHeight = window.innerHeight // the zoom animation may be weird when mobile browser with url bar because the window height

    const widthScale = windowWidth / currentZoomImg.value.width
    const widthScaleSafe = widthScale * currentZoomImg.value.height <= windowHeight

    const currentZoomImgWidthHeightRatio = currentZoomImg.value.width / currentZoomImg.value.height

    if (widthScaleSafe) {
      width.value = windowWidth
      height.value = width.value / currentZoomImgWidthHeightRatio
    } else {
      height.value = windowHeight
      width.value = height.value * currentZoomImgWidthHeightRatio
    }
  }

  translateX = 0
  translateY = 0
  scale.value = 1
  transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
}

const onBeforeEnter = () => {
  toggleImageClassName('add')
  transitionInitial()
}

const onAfterEnter = () => {
  transformInitial()
  showBtns.value = true
}

const transitionEndHandler = () => {
  if (showZoomImage.value === 'show') {
    showBlurBg.value = true
    toggleImageClassName('remove')
  }
}

const onBeforeLeave = () => {

  if (currentZoomImg.value && zoomImage.value && currentZoomImg.value.src === zoomImage.value.src) {
    toggleImageClassName('add')
    currentZoomImg.value = zoomImage.value
  } else {
    showZoomImage.value = 'hidden'
    resetTransform('origin')
    showBtns.value = false

    zoomImage.value = null
    currentZoomImg.value = null
    zoomImageList.value = []

    // clean pointers when zoom image hidden for some weird case
    pointerA = null
    pointerB = null
    startPointerA = null
    startPointerB = null
  }
  showBlurBg.value = false
}

const onLeave = () => {
  transitionInitial()
}

const onAfterLeave = () => {
  toggleImageClassName('remove')

  showZoomImage.value = 'hidden'
  resetTransform('origin')
  showBtns.value = false

  zoomImage.value = null
  currentZoomImg.value = null
  zoomImageList.value = []

  // clean pointers when zoom image hidden for some weird case
  pointerA = null
  pointerB = null
  startPointerA = null
  startPointerB = null
}

const showBtns = ref(false)

const clickHandler = (state:Boolean) => {
  if (state && zoomImage.value) {
    // show or hide the control buttons
    showBtns.value = !showBtns.value
  } else {
    // begin hiding the image
    showZoomImage.value = 'hiding'
  }
}

// scroll mouse to zoom
// listening the wheel event set the scale transform to zoom the image
// (the transform origin is center as default, so it need to set the x and y translate at the same time to compensate offset by the zoom effect) make the zoom center point is the same as mouse point
// base on wheel event so it support mouse scroll or pinch in trackpad
// refer to https://stackoverflow.com/a/70251437/10699431
const miniScale = 0.2
const maxScale = 10
const scrollToZoomHandler = (event:WheelEvent) => {
  if (image.value && showZoomImage.value === 'show' && zoomImage.value) {
    event.stopPropagation()
    event.preventDefault()
    // wheelDelta seem from the mousewheel event (which is Deprecated), not from the wheel event
    // const delta = (event.wheelDelta ? event.wheelDelta : -event.deltaY)
    const delta = -event.deltaY

    // pinch in the trackpad is imitate the wheel event
    // but the Ctrl key will be always true
    const dScale = event.ctrlKey ? 0.05 : 0.2

    // zoom the image
    const currentScale = delta > 0 ? (scale.value + dScale) : (scale.value - dScale)

    if (currentScale < miniScale || currentScale > maxScale) { return }

    scale.value = currentScale

    // get the mouse position relative to image (left-top as reference point)
    const mouseRelativeX = event.offsetX
    const mouseRelativeY = event.offsetY

    // adjust the x and y translate (on the opposite direction) to compensate the offset when scale to imitate scale origin as the mouse point
    const coefficient = delta > 0 ? dScale : -dScale

    translateX += (-mouseRelativeX * coefficient) + (image.value.clientWidth * coefficient / 2)
    translateY += (-mouseRelativeY * coefficient) + (image.value.clientHeight * coefficient / 2)

    transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
  }
}

/**
 *
 * pinch to zoom or drag to move
 * listening the pointer event
 *
 */
let startPointerA:(PointerEvent | null) = null
let startPointerB: (PointerEvent | null) = null
let pointerA: (PointerEvent | null) = null
let pointerB: (PointerEvent | null) = null
let originRelativeX = 0
let originRelativeY = 0
let prevDistance = 0

const getDistance = (a:PointerEvent, b:PointerEvent) => {
  return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2)
}

const pointerDownHandler = (event:PointerEvent) => {
  if (!showZoomImage.value) { return }

  if (!pointerA) {
    startPointerA = event
    pointerA = startPointerA
  } else if (!pointerB) {
    startPointerB = event
    pointerB = startPointerB
  }

  if (startPointerA && startPointerB && pointerA && pointerB) {
    // calculate the distance as reference value before the move event
    prevDistance = getDistance(pointerA, pointerB)

    // get the pinch center of this two pointer relative to image
    originRelativeX = (startPointerA.offsetX + startPointerB.offsetX) / 2
    originRelativeY = (startPointerA.offsetY + startPointerB.offsetY) / 2
  }

  translateStartPointX = translateX
  translateStartPointY = translateY
}

const pointerMoveHandler = (event:PointerEvent) => {
  if (!image.value || !showZoomImage.value) { return }
  if (pointerA && pointerB) {
    event.preventDefault()

    // use current event to update the pointer
    if (event.pointerId === pointerA.pointerId) {
      pointerA = event
    } else if (event.pointerId === pointerB.pointerId) {
      pointerB = event
    }

    // calculate the two points current distance in this move event
    const currentDistance = getDistance(pointerA, pointerB)

    // pinch in the touch screen
    const divisor = 100

    const distanceDiff = (currentDistance - prevDistance) / divisor

    const currentScale = scale.value + distanceDiff
    if (currentScale < miniScale || currentScale > maxScale) { return }

    scale.value = currentScale

    // adjust the x and y translate (on the opposite direction) to compensate the offset when scale to imitate scale origin as the mouse point
    translateX += (-originRelativeX * distanceDiff) + (image.value.clientWidth * distanceDiff / 2)
    translateY += (-originRelativeY * distanceDiff) + (image.value.clientHeight * distanceDiff / 2)

    // update the previous distance as reference value for next move event
    prevDistance = currentDistance

    transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
  } else if ((startPointerA && pointerA) || (startPointerB && pointerB)) {
    let prevPointer
    if (pointerA && event.pointerId === pointerA.pointerId) {
      prevPointer = startPointerA
      pointerA = event
    } else if (pointerB && event.pointerId === pointerB.pointerId) {
      prevPointer = startPointerB
      pointerB = event
    }

    if(prevPointer) {
      translateX = translateStartPointX + (event.clientX - prevPointer.clientX)
      translateY = translateStartPointY + (event.clientY - prevPointer.clientY)

      transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
    }

    // set some style change when swipe from the initial transform state (scale = 1 translate x and y = 0)
    if (scale.value === 1 && translateStartPointX === 0 && translateStartPointY === 0) {
      const imageRect = image.value.getBoundingClientRect()
      if (Math.abs(translateY) > Math.abs(translateX)) {
        opacity.value = 1 - Math.abs(translateY) / imageRect.height < 0.2 ? 0.2 : 1 - Math.abs(translateY) / imageRect.height
      } else {
        opacity.value = 1 - Math.abs(translateX) / imageRect.width < 0.2 ? 0.2 : 1 - Math.abs(translateX) / imageRect.width
      }
    }
  }
}

const pointerCancelHandler = (event:PointerEvent) => {
  // swipe from the initial transform state (scale = 1 translate x and y = 0) can trigger hide lightbox or change zoom image feature
  if (image.value && scale.value === 1 && translateStartPointX === 0 && translateStartPointY === 0) {
    const imageRect = image.value.getBoundingClientRect()

    // swipe up/down to hide lightbox
    const escapeThreshold = Math.abs(translateY) - imageRect.height / 4
    if (escapeThreshold > 0) {
      clickHandler(false)
    } else {
      opacity.value = 1
    }

    // swipe left/right to change zoom image
    if (zoomImageList.value.length > 1) {
      const changeImageThreshold = Math.abs(translateX) - imageRect.width / 4

      if (changeImageThreshold > 0) {
        if (translateX > 0) {
          changeCurrentZoomImage('prev')
        } else {
          changeCurrentZoomImage('next')
        }

        transformInitial()
      } else {
        opacity.value = 1
      }
    }
  }

  if (pointerA && event.pointerId === pointerA.pointerId) {
    pointerA = null
    startPointerA = null
  } else if (pointerB && event.pointerId === pointerB.pointerId) {
    pointerB = null
    startPointerB = null
  }

  translateStartPointX = translateX
  translateStartPointY = translateY

  if (!pointerA || !pointerB) {
    // reset the previous distance as reference value for next move event
    prevDistance = 0
    originRelativeX = 0
    originRelativeY = 0
  }
}
</script>

<template>
  <div
    v-show="showZoomImage !== 'hidden'"
    class="w-screen h-screen fixed inset-0 z-[999] flex justify-center items-center cursor-zoom-out"
    :class="(showZoomImage !== 'hidden' && showBlurBg) ? 'touch-none bg-white/90 backdrop-blur' : ''"
    @click="clickHandler(false)"
    @wheel="$event.preventDefault()"
  >
    <Transition
      @before-enter="onBeforeEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <img
        v-show="showZoomImage === 'show' && currentZoomImg"
        ref="image"
        class="mx-auto will-change-transform cursor-move touch-none"
        :src="currentZoomImg ? currentZoomImg.src : ''"
        :alt="currentZoomImg ? currentZoomImg.alt : ''"
        :style="`width: ${width}px; height: ${height}px; opacity: ${opacity};transform: ${transformValue}`"
        draggable="false"
        @transitionend="transitionEndHandler"
        @dblclick="resetTransform('screen')"
        @click.stop.prevent="clickHandler(true)"
        @wheel="scrollToZoomHandler"
        @pointerdown="pointerDownHandler"
        @pointermove="pointerMoveHandler"
        @pointercancel="pointerCancelHandler"
        @pointerup="pointerCancelHandler"
      >
    </Transition>

    <Transition
      enter-from-class="-translate-x-20 opacity-0"
      enter-active-class="transition-all duration-200 ease"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="-translate-x-20 opacity-0"
    >
      <button
        v-show="showBtns"
        class="h-fit px-4 sm:px-2 py-2 flex justify-center items-center fixed top-4 left-4 z-[1000] text-xs text-purple-400 hover:text-purple-500 active:text-white bg-purple-100 border border-purple-500 active:bg-purple-500 rounded"
        @click.stop.prevent="resetTransform('screen')"
      >
        {{ Math.round(scale * 100) }}%
      </button>
    </Transition>
    <Transition
      enter-from-class="translate-x-20 opacity-0"
      enter-active-class="transition-all duration-200 ease"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="translate-x-20 opacity-0"
    >
      <button
        v-show="showBtns"
        class="h-fit px-4 sm:px-2 py-2 flex justify-center items-center gap-1 bg-red-100 text-xs text-red-400 hover:text-red-500 active:text-white
        active:bg-red-500 border border-red-500 fixed top-4 right-4 z-[1000] rounded"
        @click.stop.prevent="clickHandler(false)"
      >
        <span>Esc</span>
        <IconCustom
          name="ic:round-close"
          class="w-4 h-4"
        />
      </button>
    </Transition>

    <Transition
      enter-from-class="translate-y-28 opacity-0"
      enter-active-class="transition-all duration-200 ease"
      enter-to-class="translate-y-0 opacity-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="translate-y-28 opacity-0"
    >
      <div
        v-show="showBtns && zoomImageList.length > 1"
        class="p-2 absolute  bottom-20 sm:bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center gap-x-2 bg-gray-100 rounded-lg border border-gray-200 cursor-default"
        @click.stop
      >
        <button
          v-show="showScrollBtns"
          :disabled="scrollPos === 'start'"
          class="btn bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-500"
          :class="scrollPos === 'start' ? ' opacity-30' : ('opacity-100')"
          @click.stop.prevent="scrollHandler('left')"
        >
          <IconCustom
            name="material-symbols:arrow-left-rounded"
            class="w-6 h-6"
          />
        </button>
        <div
          ref="zoomImageListContainer"
          class="zoom-image-list max-w-[80vw] p-2 flex items-center gap-x-2  overflow-x-auto overscroll-x-none"
          @scroll.passive="scrollingHandler"
        >
          <button
            v-for="(item, index) in zoomImageList"
            :key="index"
            class="shrink-0 w-16 h-16 sm:w-20 sm:h-20 ring sm:ring-4 focus:outline-none rounded overflow-hidden"
            :class="currentZoomImg && currentZoomImg.src === item.src ? 'ring-purple-400' : 'ring-transparent'"
            @click.stop.prevent="setCurrentZoomImg(item)"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              class="mx-auto max-h-full"
            >
          </button>
        </div>
        <button
          v-show="showScrollBtns"
          :disabled="scrollPos === 'end'"
          class="btn bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-500"
          :class="scrollPos === 'end' ? 'opacity-30' : 'opacity-100'"
          @click.stop.prevent="scrollHandler('right')"
        >
          <IconCustom
            name="material-symbols:arrow-right-rounded"
            class="w-6 h-6"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>

.zoom-image-list {
  @apply scroll-smooth;

  &::-webkit-scrollbar {
    display: none;
  }
}

.btn {
  @apply shrink-0 h-20 hidden sm:flex justify-center items-center active:text-white border rounded;
}
</style>
