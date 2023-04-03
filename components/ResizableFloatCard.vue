<script setup lang="ts">
const props = defineProps<{
  startWidth: number;
  startHeight: number;
  positionPoint: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
  startX: number;
  startY: number;
}>()

/**
 *
 * resize
 *
 */
let currentResizePointer = null
let startResizePointer: (null | PointerEvent) = null
let startSidebarWidth = 0
let startSidebarHeight = 0
let startSidebarLeft = 0
let startSidebarBottom = 0
type ResizeDirectionType = 'up' | 'bottom' | 'left' | 'right' | 'up-left' | 'up-right' | 'bottom-left' | 'bottom-right' | ''
const resizeDirection = ref<ResizeDirectionType>('')
const resizeSidebarPointerDownHandler = (direction: ResizeDirectionType, event: PointerEvent) => {
  if (event) {
    const currentTarget = event.currentTarget as HTMLElement
    currentTarget.setPointerCapture(event.pointerId)
    currentResizePointer = event
    startResizePointer = event
    resizeDirection.value = direction
    startSidebarWidth = sidebarWidth.value
    startSidebarHeight = sidebarHeight.value
    startSidebarLeft = sidebarLeft.value
    startSidebarBottom = sidebarBottom.value
  }
}

const resizeSidebarPointerMoveHandler = (event: PointerEvent) => {
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
 * move
 *
 */
let currentDragSidebarPointer = null
let startDragSidebarPointer: (null | PointerEvent) = null
const dragSidebarState = ref(false)
const dragSidebarPointerDownHandler = (event: PointerEvent) => {
  if (event) {
    dragSidebarState.value = true
    const currentTarget = event.currentTarget as HTMLElement
    currentTarget.setPointerCapture(event.pointerId)
    currentDragSidebarPointer = event
    startDragSidebarPointer = event

    startSidebarLeft = sidebarLeft.value
    startSidebarBottom = sidebarBottom.value
  }
}

const dragSidebarPointerMoveHandler = (event: PointerEvent) => {
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
</script>

<template>
  <aside
    id="sidebar"
    ref="sidebar"
    tabindex="0"
    class="flex flex-col justify-center fixed z-30 select-none will-change-transform"
    :class="sidebarFloatForBlog ? 'bg-gray-100/90 backdrop-blur-sm shadow-md shadow-gray-500 rounded-lg touch-none' : 'top-1/2 right-0 -translate-y-1/2'"
    :style="sidebarFloatForBlog ? `left: ${sidebarLeft}px; bottom: ${sidebarBottom}px` : ''"
  >
    <!-- resize control handlers at the top for the float DOM -->
    <div
      v-show="sidebarFloatForBlog"
      class="flex"
    >
      <button
        draggable="false"
        class="shrink-0 group pt-1 pl-1 flex justify-start items-start cursor-nwse-resize touch-none rounded-tl-lg"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up-left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b"
          :class="resizeDirection === 'up-left' ? 'bg-purple-400' : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r"
          :class="resizeDirection === 'up-left' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-start cursor-ns-resize touch-none"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded"
          :class="resizeDirection === 'up' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pt-1 pr-1 flex justify-end items-start cursor-nesw-resize touch-none rounded-tr-lg"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-right' || resizeDirection === 'right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up-right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l"
          :class="resizeDirection === 'up-right' ? 'bg-purple-400' : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b"
          :class="resizeDirection === 'up-right' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
    </div>

    <div class="flex items-stretch">
      <!-- resize control handler at the left for float DOM -->
      <button
        v-show="sidebarFloatForBlog"
        draggable="false"
        class="shrink-0 group cursor-ew-resize px-1 flex justify-start items-center touch-none"
        :class="resizeDirection === 'up-left' || resizeDirection === 'left' || resizeDirection === 'bottom-left' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded"
          :class="resizeDirection === 'left' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>

      <div
        class="grow flex flex-col justify-start"
        :class="sidebarFloatForBlog ? '' : 'max-h-[70vh] pr-2 py-2 '"
        :style="sidebarFloatForBlog ? `width: ${sidebarWidth}px; height: ${sidebarHeight}px;` : `width: ${sidebarWidth}px`"
      >
        <!-- drag control handler at the top for the float DOM -->
        <button
          v-show="sidebarFloatForBlog"
          draggable="false"
          class="shrink-0 order-1 group p-1 w-full flex justify-center items-center rounded transition-colors duration-300 cursor-move touch-none"
          :class="dragSidebarState ? 'bg-purple-200 text-purple-500' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'"
          @pointerdown="dragSidebarPointerDownHandler"
          @pointermove="dragSidebarPointerMoveHandler"
          @pointercancel="dragSidebarPointerCancelHandler"
          @pointerup="dragSidebarPointerCancelHandler"
        >
          <IconCustom
            name="akar-icons:drag-horizontal"
            class="w-4 h-4"
          />
        </button>

        <div
          class="sidebar-btn-container shrink-0 py-2 flex items-center gap-2 overflow-x-auto"
          :class="sidebarFloatForBlog ? 'justify-between order-3' : 'justify-start order-2'"
        >
          <div class="flex items-center gap-2">
            <button
              class="sidebar-btn flex bg-green-100 text-green-400 hover:text-green-500 active:text-white active:bg-green-500 border border-green-400"
              @click="toggleAllCatalogState = 'expand'"
            >
              <IconCustom
                name="ic:round-unfold-more"
                class="w-4 h-4"
                :class="sidebarFloatForBlog && floatBlogCatalogType === 'tree' ? 'rotate-90' : ''"
              />
            </button>

            <button
              class="sidebar-btn flex bg-red-100 text-red-400 hover:text-red-500 active:text-white active:bg-red-500 border border-red-400"
              @click="toggleAllCatalogState = 'collapse'"
            >
              <IconCustom
                name="ic:round-unfold-less"
                class="w-4 h-4"
                :class="sidebarFloatForBlog && floatBlogCatalogType === 'tree' ? 'rotate-90' : ''"
              />
            </button>

            <button
              v-show="!sidebarFloatForBlog || floatBlogCatalogType === 'list'"
              class="sidebar-btn flex active:text-white border bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-400"
              @click="scrollCatalogTo = 'top'"
            >
              <IconCustom
                name="material-symbols:vertical-align-top-rounded"
                class="w-4 h-4"
              />
            </button>

            <button
              v-show="!sidebarFloatForBlog || floatBlogCatalogType === 'list'"
              class="sidebar-btn flex active:text-white border bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-400"
              @click="scrollCatalogTo = 'bottom'"
            >
              <IconCustom
                name="material-symbols:vertical-align-bottom-rounded"
                class="w-4 h-4"
              />
            </button>

            <button
              v-show="sidebarFloatForBlog"
              class="sidebar-btn flex border"
              :class="floatBlogCatalogType === 'tree' ? 'bg-purple-500 hover:bg-purple-400 text-white border-purple-400' : 'bg-purple-100 text-purple-400 hover:text-purple-500 border-purple-400'"
              @click="toggleFloatCatalogTypeHandler"
            >
              <IconCustom
                name="icon-park-outline:tree-diagram"
                class="w-4 h-4"
              />
            </button>

            <button
              v-show="floatBlogCatalogType === 'tree' && sidebarFloatForBlog"
              class="sidebar-btn flex border active:text-white bg-purple-100 text-purple-400 hover:text-purple-500 active:bg-purple-500 border-purple-400"
              @click="resetCatalogListScaleHandler"
            >
              <IconCustom
                name="uil:focus-target"
                class="w-4 h-4"
              />
            </button>
          </div>

          <button
            class="shrink-0 hidden xl:flex p-1 justify-center items-center rounded border transition-colors duration-300"
            :class="sidebarFloatForBlog ? 'border-purple-400 bg-purple-500 hover:bg-purple-400 text-white' : 'border-purple-400 bg-purple-100 text-purple-400 hover:text-purple-500'"
            @click="toggleSidebarFloatForBlog = !toggleSidebarFloatForBlog"
          >
            <IconCustom
              name="clarity:window-restore-line"
              class="w-4 h-4"
            />
          </button>
        </div>

        <!-- content -->
        <slot />
      </div>

      <!-- resize control handler at the right for the float DOM -->
      <button
        v-show="sidebarFloatForBlog"
        draggable="false"
        class="shrink-0 group px-1 flex justify-end items-center cursor-ew-resize touch-none"
        :class="resizeDirection === 'up-right' || resizeDirection === 'right' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded"
          :class="resizeDirection === 'right' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
    </div>

    <!-- resize control handlers at the bottom for the float DOM -->
    <div
      v-show="sidebarFloatForBlog"
      class="flex"
    >
      <button
        draggable="false"
        class="shrink-0 group pl-1 pb-1 flex justify-start items-end cursor-nesw-resize touch-none rounded-bl-lg"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom-left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t"
          :class="resizeDirection === 'bottom-left' ? 'bg-purple-400' : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r"
          :class="resizeDirection === 'bottom-left' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-end cursor-ns-resize touch-none"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded"
          :class="resizeDirection === 'bottom' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pr-1 pb-1 flex justify-end items-end cursor-nwse-resize touch-none rounded-br-lg"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-right' || resizeDirection === 'right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom-right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l"
          :class="resizeDirection === 'bottom-right' ? 'bg-purple-400' : 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t"
          :class="resizeDirection === 'bottom-right' ? 'bg-purple-400' : 'bg-gray-400'"
        />
      </button>
    </div>

    <!-- reset button for the float DOM location -->
    <Teleport to="body">
      <button
        v-show="showCatalogForBlog && sidebarFloatForBlog"
        class="p-3 sm:p-2 flex justify-center items-center fixed bottom-[8.5rem] sm:bottom-28 right-2 sm:right-4 z-40 active:text-white rounded-lg text-purple-400 hover:text-purple-500 bg-purple-100 active:bg-purple-500 border border-purple-200"
        @click="resetFloatSidebarHandler"
      >
        <IconCustom
          name="bi:layout-sidebar-inset"
          class="w-5 h-5"
        />
      </button>
    </Teleport>
  </aside>
</template>

<style scoped>

</style>