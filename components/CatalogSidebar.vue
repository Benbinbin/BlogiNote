<script setup lang="ts">
interface CatalogItem {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItem[]
}

const props = defineProps<{
  catalogs: CatalogItem[]
}>()

const flexiMode = useFlexiMode()

const showCatalog = useShowCatalog()

const sidebar = ref(null)
// sidebar size and position
const sidebarWidth = ref(300)
const sidebarHeight = ref(300)
const sidebarLeft = ref(16)
const sidebarBottom = ref(16)

const sidebarFloat = useSidebarFloat()
// reset float sidebar size and position
// const resetFloatSidebar = ref(false)

const resetFloatSidebarHandler = () => {
  sidebarWidth.value = 300
  sidebarHeight.value = 300
  sidebarLeft.value = 16
  if (document.documentElement.clientWidth <= 640) {
    sidebarBottom.value = 80
  } else {
    sidebarBottom.value = 16
  }
}

/**
 *
 * set the sidebar init state
 * and auto adjust the sidebar float state when resize window
 *
 */
onMounted(() => {
  const setSidebarWidth = () => {
    sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
  }

  // base on the page init state to set the sidebar init state
  if (document.documentElement.clientWidth < 1280) {
    if (document.documentElement.clientWidth <= 640) {
      sidebarBottom.value = 80
    }

    sidebarFloat.value = true
  } else {
    setSidebarWidth()
    // sidebarFloat.value = false
  }

  // listen window resize event
  // and adjust the width of the fixed sidebar (not the float sidebar)
  let resizeTimer = null

  window.onresize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    resizeTimer = setTimeout(() => {
      if (document.documentElement.clientWidth < 1280 && sidebarFloat.value === false) {
        // when the window resize smaller than 1280px at the first time
        // and if the sidebar not toggle to float manually

        // reset the size and position of the float catalog
        if (!toggleSidebarFloat.value) {
          resetFloatSidebarHandler()
          resetCatalogListScaleHandler()
        }

        // auto float the catalog
        sidebarFloat.value = true
      } else if (document.documentElement.clientWidth >= 1280 && sidebarFloat.value === true) {
        // when the window resize bigger (or equal) than 1280px at the first time
        // and if the sidebar not toggle to float manually

        // change the float state to fixed
        sidebarFloat.value = false
      }

      // set the fixed sidebar width when window resize
      if (!sidebarFloat.value && !toggleSidebarFloat.value) {
        setSidebarWidth()
      }

      resizeTimer = null
    }, 300)
  }
})

/**
 *
 * manual toggle catalog float state
 *
 */
const toggleSidebarFloat = useToggleSidebarFloat()

onMounted(() => {
  watch(toggleSidebarFloat, () => {
    if (toggleSidebarFloat.value) {
      // when manually change the fixed state to float
      resetFloatSidebarHandler()
      resetCatalogListScaleHandler()
      sidebarFloat.value = true
    } else {
      // when change the float state to fixed
      // reset the fixed sidebar width
      sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
      sidebarFloat.value = false
    }
  })
})

/**
 *
 * resize the float sidebar
 *
 */
let currentResizePointer = null
let startResizePointer = null
let startSidebarWidth = 0
let startSidebarHeight = 0
let startSidebarLeft = 0
let startSidebarBottom = 0
type ResizeDirectionType = 'up' | 'bottom' | 'left' | 'right' | 'up-left' | 'up-right' | 'bottom-left' | 'bottom-right' | ''
const resizeDirection = ref <ResizeDirectionType>('')
const resizeSidebarPointerDownHandler = (direction, event) => {
  if (event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    currentResizePointer = event
    startResizePointer = event
    resizeDirection.value = direction
    startSidebarWidth = sidebarWidth.value
    startSidebarHeight = sidebarHeight.value
    startSidebarLeft = sidebarLeft.value
    startSidebarBottom = sidebarBottom.value
  }
}

const resizeSidebarPointerMoveHandler = (event) => {
  if (event && startResizePointer) {
    currentResizePointer = event

    // when pointer move resize the sidebar
    // because the float sidebar is fixed based on bottom and left
    // when resize the float sidebar from bottom
    // should adjust bottom position at the same time
    if (resizeDirection.value !== 'left' && resizeDirection.value !== 'right') {
      const distance = currentResizePointer.y - startResizePointer.y

      if (resizeDirection.value === 'up' || resizeDirection.value === 'up-left' || resizeDirection.value === 'up-right') {
        sidebarHeight.value = startSidebarHeight - distance
      } else {
        sidebarHeight.value = startSidebarHeight + distance
        sidebarBottom.value = startSidebarBottom - distance
      }
    }

    if (resizeDirection.value !== 'up' && resizeDirection.value !== 'bottom') {
      const distance = currentResizePointer.x - startResizePointer.x

      if (resizeDirection.value === 'left' || resizeDirection.value === 'up-left' || resizeDirection.value === 'bottom-left') {
        sidebarWidth.value = startSidebarWidth - distance
        sidebarLeft.value = startSidebarLeft + distance
      } else {
        sidebarWidth.value = startSidebarWidth + distance
      }
    }
  }
}

const resizeSidebarPointerCancelHandler = () => {
  currentResizePointer = null
  startResizePointer = null
  resizeDirection.value = ''
  startSidebarWidth = 0
  startSidebarHeight = 0
}

/**
 *
 * move the float sidebar
 *
 */
let currentDragSidebarPointer = null
let startDragSidebarPointer = null
const dragSidebarState = ref(false)
const dragSidebarPointerDownHandler = (event) => {
  if (event) {
    dragSidebarState.value = true

    event.currentTarget.setPointerCapture(event.pointerId)
    currentDragSidebarPointer = event
    startDragSidebarPointer = event

    startSidebarLeft = sidebarLeft.value
    startSidebarBottom = sidebarBottom.value
  }
}

const dragSidebarPointerMoveHandler = (event) => {
  if (event && startDragSidebarPointer) {
    currentDragSidebarPointer = event

    const dx = currentDragSidebarPointer.x - startDragSidebarPointer.x
    const dy = currentDragSidebarPointer.y - startDragSidebarPointer.y

    sidebarLeft.value = startSidebarLeft + dx
    sidebarBottom.value = startSidebarBottom - dy
  }
}

const dragSidebarPointerCancelHandler = () => {
  dragSidebarState.value = false
  currentDragSidebarPointer = null
  startDragSidebarPointer = null
}

/**
 *
 * tree catalog type interaction
 *
 */
const catalogList = ref(null)
const catalogListScale = ref(1)
const catalogListTranslateX = ref(0)
const catalogListTranslateY = ref(0)

const resetCatalogListScaleHandler = () => {
  catalogListScale.value = 1
  catalogListTranslateX.value = 0
  catalogListTranslateY.value = 0
}

// zoom the catalog
const miniScale = ref(0.5)
const maxScale = ref(1.5)
// scroll mouse (or use trackpad) to zoom
const scrollToZoomCatalogHandler = (event) => {
  if (sidebarFloat.value && floatCatalogType.value === 'tree' && catalogList.value) {
    // console.log(event)
    event.stopPropagation()
    event.preventDefault()
    const delta = (event.wheelDelta ? event.wheelDelta : -event.deltaY)

    // pinch in the trackpad is imitate the wheel event
    // but the Ctrl key will be always true
    const dScale = event.ctrlKey ? 0.04 : 0.1

    // zoom the catalog
    const currentScale = delta > 0 ? (catalogListScale.value + dScale) : (catalogListScale.value - dScale)

    if (currentScale < miniScale.value || currentScale > maxScale.value) { return }

    catalogListScale.value = currentScale

    // get the mouse position relative to catalog (left-top as reference point)
    let mouseRelativeX = event.offsetX
    let mouseRelativeY = event.offsetY

    // console.log(event)
    // console.log(event.offsetX, event.offsetY)

    if (event.target !== event.currentTarget) {
      const eventTargetRect = event.target.getBoundingClientRect()
      const catalogListRect = catalogList.value.getBoundingClientRect()
      mouseRelativeX += eventTargetRect.x - catalogListRect.x
      mouseRelativeY += eventTargetRect.y - catalogListRect.y
    }

    // console.log(mouseRelativeX, mouseRelativeY)

    // adjust the x and y translate (on the opposite direction) to compensate the offset when scale to imitate scale origin as the mouse point
    const coefficient = delta > 0 ? dScale : -dScale

    catalogListTranslateX.value += (-mouseRelativeX * coefficient) + (catalogList.value.clientWidth * coefficient / 2)
    catalogListTranslateY.value += (-mouseRelativeY * coefficient) + (catalogList.value.clientHeight * coefficient / 2)
  }
}

// move the catalog
let currentDragCatalogPointer = null
let startDragCatalogPointer = null
let startCatalogListTranslateX = 0
let startCatalogListTranslateY = 0

// if click these DOM, don't trigger pointer event
// just execute the default action (change the anchor link of the page URL)
const exceptTagNames = ['A', 'BUTTON', 'svg', 'path']

const dragCatalogPointerDownHandler = (event) => {
  if (sidebarFloat.value && floatCatalogType.value === 'tree' && !exceptTagNames.includes(event.target.tagName) && !currentDragCatalogPointer) {
    event.currentTarget.setPointerCapture(event.pointerId)
    currentDragCatalogPointer = event
    startDragCatalogPointer = event

    startCatalogListTranslateX = catalogListTranslateX.value
    startCatalogListTranslateY = catalogListTranslateY.value
  }
}

const dragCatalogPointerMoveHandler = (event) => {
  if (!currentDragCatalogPointer || event.pointerId !== currentDragCatalogPointer.pointerId) { return }
  if (sidebarFloat.value && floatCatalogType.value === 'tree' && startDragCatalogPointer) {
    currentDragCatalogPointer = event

    const dx = currentDragCatalogPointer.x - startDragCatalogPointer.x
    const dy = currentDragCatalogPointer.y - startDragCatalogPointer.y

    catalogListTranslateX.value = startCatalogListTranslateX + dx
    catalogListTranslateY.value = startCatalogListTranslateY + dy
  }
}

const dragCatalogPointerCancelHandler = (event) => {
  if (currentDragCatalogPointer && event.pointerId === currentDragCatalogPointer.pointerId) {
    currentDragCatalogPointer = null
    startDragCatalogPointer = null
    startCatalogListTranslateX = 0
    startCatalogListTranslateY = 0
  }
}

// toggle catalog type between "tree" and "list"
const floatCatalogType = useFloatCatalogType()
const catalogContainer = ref(null)

const toggleFloatCatalogTypeHandler = () => {
  if (floatCatalogType.value === 'tree') {
    floatCatalogType.value = 'list'
  } else if (floatCatalogType.value === 'list') {
    floatCatalogType.value = 'tree'
  }
}

/**
 *
 * scroll the catalog to top or bottom when catalog type is 'list'
 */
const scrollCatalogTo = ref('')
onMounted(() => {
  watch(scrollCatalogTo, () => {
    // if (sidebarFloat.value && floatCatalogType.value === 'tree') { return }
    if (scrollCatalogTo.value === 'top') {
      catalogContainer.value.scrollTop = 0
    } else if (scrollCatalogTo.value === 'bottom') {
      catalogContainer.value.scrollTop = catalogContainer.value.scrollHeight - catalogContainer.value.clientHeight
    }
    scrollCatalogTo.value = ''
  })
})

/**
 *
 * expand or collapse all catalog
 *
 */
// set value to "expand" or "collapse" or ""
const toggleAllCatalog = useToggleAllCatalog()
</script>

<template>
  <aside
    v-show="showCatalog"
    id="sidebar"
    ref="sidebar"
    tabindex="0"
    class="flex flex-col justify-center fixed z-30 select-none will-change-transform"
    :class="sidebarFloat ? 'bg-gray-100/90 backdrop-blur-sm shadow-md shadow-gray-500 rounded-lg touch-none' : 'top-1/2 right-0 -translate-y-1/2'"
    :style="sidebarFloat ? `left: ${sidebarLeft}px; bottom: ${sidebarBottom}px` : ''"
  >
    <div v-show="sidebarFloat" class="flex">
      <button
        draggable="false"
        class="shrink-0 group pt-1 pl-1 flex justify-start items-start cursor-nwse-resize touch-none rounded-tl-lg"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up-left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b"
          :class="resizeDirection === 'up-left' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r"
          :class="resizeDirection === 'up-left' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-start cursor-ns-resize touch-none"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded"
          :class="resizeDirection === 'up' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pt-1 pr-1 flex justify-end items-start cursor-nesw-resize touch-none rounded-tr-lg"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-right' || resizeDirection === 'right' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up-right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l"
          :class="resizeDirection === 'up-right' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b"
          :class="resizeDirection === 'up-right' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
    </div>

    <div class="flex items-stretch">
      <button
        v-show="sidebarFloat"
        draggable="false"
        class="shrink-0 group cursor-ew-resize px-1 flex justify-start items-center touch-none"
        :class="resizeDirection === 'up-left' || resizeDirection === 'left' || resizeDirection === 'bottom-left' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded"
          :class="resizeDirection === 'left' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
      <div
        class="grow flex flex-col justify-start"
        :class="sidebarFloat ? '' : 'max-h-[70vh] pr-2 py-2 '"
        :style="sidebarFloat ? `width: ${sidebarWidth}px; height: ${sidebarHeight}px;` : `width: ${sidebarWidth}px`"
      >
        <button
          v-show="sidebarFloat"
          draggable="false"
          class="shrink-0 order-1 group p-1 w-full flex justify-center items-center rounded transition-colors duration-300 cursor-move touch-none"
          :class="dragSidebarState ? (flexiMode === 'blog' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800') : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'"
          @pointerdown="dragSidebarPointerDownHandler"
          @pointermove="dragSidebarPointerMoveHandler"
          @pointercancel="dragSidebarPointerCancelHandler"
          @pointerup="dragSidebarPointerCancelHandler"
        >
          <IconCustom name="system-uicons:drag" class="w-4 h-4" />
        </button>

        <div
          class="sidebar-btn-container shrink-0 py-2 flex items-center gap-2 overflow-x-auto"
          :class="sidebarFloat ? 'justify-between order-3' : 'justify-start order-2'"
        >
          <div class="flex items-center gap-2">
            <button
              class="sidebar-btn flex bg-green-100 text-green-400 hover:text-green-500 active:text-white active:bg-green-500 border border-green-400"
              @click="toggleAllCatalog = 'expand'"
            >
              <IconCustom
                name="ic:round-unfold-more"
                class="w-4 h-4"
                :class="floatCatalogType === 'tree' ? 'rotate-90' : ''"
              />
            </button>

            <button
              class="sidebar-btn flex bg-red-100 text-red-400 hover:text-red-500 active:text-white active:bg-red-500 border border-red-400"
              @click="toggleAllCatalog = 'collapse'"
            >
              <IconCustom
                name="ic:round-unfold-less"
                class="w-4 h-4"
                :class="floatCatalogType === 'tree' ? 'rotate-90' : ''"
              />
            </button>

            <button
              v-show="!sidebarFloat || floatCatalogType === 'list'"
              class="sidebar-btn flex active:text-white border"
              :class="flexiMode === 'blog' ? 'bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-400' : 'bg-green-100 text-green-400 hover:text-green-500 active:bg-green-500 border-green-400'"
              @click="scrollCatalogTo = 'top'"
            >
              <IconCustom name="material-symbols:vertical-align-top-rounded" class="w-4 h-4" />
            </button>

            <button
              v-show="!sidebarFloat || floatCatalogType === 'list'"
              class="sidebar-btn flex active:text-white border"
              :class="flexiMode === 'blog' ? 'bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-400' : 'bg-green-100 text-green-400 hover:text-green-500 active:bg-green-500 border-green-400'"
              @click="scrollCatalogTo = 'bottom'"
            >
              <IconCustom name="material-symbols:vertical-align-bottom-rounded" class="w-4 h-4" />
            </button>

            <button
              v-show="sidebarFloat"
              class="sidebar-btn flex border"
              :class="floatCatalogType === 'tree' ? (flexiMode === 'blog' ? 'bg-purple-500 hover:bg-purple-400 text-white border-purple-400' : 'bg-green-500 hover:bg-green-400 text-white border-green-400') : (flexiMode === 'blog' ? 'bg-purple-100 text-purple-400 hover:text-purple-500 border-purple-400' : 'bg-green-100 text-green-400 hover:text-green-500 border-green-400')"
              @click="toggleFloatCatalogTypeHandler"
            >
              <IconCustom name="icon-park-outline:tree-diagram" class="w-4 h-4" />
            </button>

            <button
              v-show="floatCatalogType === 'tree' && sidebarFloat"
              class="sidebar-btn flex border active:text-white"
              :class="flexiMode === 'blog' ? 'bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-400' : 'bg-green-100 text-green-400 hover:text-green-500 active:bg-green-500 border-green-400'"
              @click="resetCatalogListScaleHandler"
            >
              <IconCustom name="uil:focus-target" class="w-4 h-4" />
            </button>
          </div>

          <button
            class="shrink-0 hidden xl:flex p-1 justify-center items-center rounded border transition-colors duration-300"
            :class="sidebarFloat ? (flexiMode === 'blog' ? 'border-purple-400 bg-purple-500 hover:bg-purple-400 text-white' : 'border-green-400 bg-green-500 hover:bg-green-400 text-white') : (flexiMode === 'blog' ? 'border-purple-400 bg-purple-100 text-purple-400 hover:text-purple-500' : 'border-green-400 bg-green-100 text-green-400 hover:text-green-500')"
            @click="toggleSidebarFloat = !toggleSidebarFloat"
          >
            <IconCustom name="clarity:window-restore-line" class="w-4 h-4" />
          </button>
        </div>
        <div
          v-show="sidebarFloat && floatCatalogType === 'tree'"
          class="order-4 w-full my-2 flex sm:hidden items-center gap-1"
        >
          <label for="zoom-catalog" class="shrink-0 text-gray-400 text-xs">zoom</label>
          <input
            id="zoom-catalog"
            v-model="catalogListScale"
            type="range"
            name="zoom"
            :min="miniScale"
            :max="maxScale"
            step="0.01"
            class="grow h-1.5 focus:outline-0"
            :class="flexiMode === 'blog' ? 'accent-purple-400' : 'accent-green-400'"
          >
          <span class="shrink-0 w-6 overflow-hidden text-gray-400 text-xs text-center">{{ catalogListScale }}</span>
        </div>

        <div
          id="catalog-container"
          ref="catalogContainer"
          class="grow w-full flex flex-col scroll-smooth overscroll-none"
          :class="sidebarFloat ? (floatCatalogType === 'tree' ? 'order-2 gap-2 overflow-hidden cursor-move' : ' order-2 overflow-y-auto') : 'order-3 overflow-y-auto'"
          @pointerdown="dragCatalogPointerDownHandler"
          @pointermove="dragCatalogPointerMoveHandler"
          @pointercancel="dragCatalogPointerCancelHandler"
          @pointerup="dragCatalogPointerCancelHandler"
        >
          <ul
            ref="catalogList"
            class="shrink-0 overscroll-none"
            :class="sidebarFloat && floatCatalogType === 'tree' ? 'space-y-2 m-4 border-l border-purple-300 rounded-md touch-none' : ''"
            :style="sidebarFloat && floatCatalogType === 'tree' ? `transform: translate(${catalogListTranslateX}px, ${catalogListTranslateY}px) scale(${catalogListScale})` : ''"
            @wheel="scrollToZoomCatalogHandler"
          >
            <CatalogItem
              v-for="catalog in props.catalogs"
              :key="catalog.id"
              :item="catalog"
              :depth="catalog.depth || 2"
            />
          </ul>
        </div>
      </div>
      <button
        v-show="sidebarFloat"
        draggable="false"
        class="shrink-0 group px-1 flex justify-end items-center cursor-ew-resize touch-none"
        :class="resizeDirection === 'up-right' || resizeDirection === 'right' || resizeDirection === 'bottom-right' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded"
          :class="resizeDirection === 'right' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
    </div>

    <div v-show="sidebarFloat" class="flex">
      <button
        draggable="false"
        class="shrink-0 group pl-1 pb-1 flex justify-start items-end cursor-nesw-resize touch-none rounded-bl-lg"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-left' || resizeDirection === 'left' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom-left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t"
          :class="resizeDirection === 'bottom-left' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r"
          :class="resizeDirection === 'bottom-left' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-end cursor-ns-resize touch-none"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded"
          :class="resizeDirection === 'bottom' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pr-1 pb-1 flex justify-end items-end cursor-nwse-resize touch-none rounded-br-lg"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-right' || resizeDirection === 'right' ? (flexiMode === 'blog' ? 'bg-purple-200' : 'bg-green-200') : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom-right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l"
          :class="resizeDirection === 'bottom-right' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t"
          :class="resizeDirection === 'bottom-right' ? (flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400') : 'bg-gray-400'"
        />
      </button>
    </div>
  </aside>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <button
    v-show="showCatalog && sidebarFloat"
    class="p-3 sm:p-2 flex justify-center items-center fixed bottom-[8.5rem] sm:bottom-28 right-2 sm:right-4 z-40 active:text-white rounded-lg"
    :class="flexiMode === 'blog' ? 'text-purple-400 hover:text-purple-500 bg-purple-100 active:bg-purple-500' : 'text-green-400 hover:text-green-500 bg-green-100 active:bg-green-500' "
    @click="resetFloatSidebarHandler"
  >
    <IconCustom name="bi:layout-sidebar-inset" class="w-5 h-5" />
  </button>
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
