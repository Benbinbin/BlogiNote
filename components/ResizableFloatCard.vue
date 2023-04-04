<script setup lang="ts">
const props = defineProps<{
  startWidth: number;
  startHeight: number;
  positionPoint: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
  startX: number;
  startY: number;
}>()

const floatDOM = ref(null)
// sidebar size and position
const contentWidth = ref(props.startWidth || 0)
const contentHeight = ref(props.startHeight || 0)
const containerX = ref(props.startX || 0)
const containerY = ref(props.startY || 0)

const locationCoordinate = computed(() => {
  let styleStr;
  switch (props.positionPoint) {
    case 'leftTop':
      styleStr = `left: ${containerX.value}px; top: ${containerY.value}px`
      break;
    case 'leftBottom':
      styleStr = `left: ${containerX.value}px; bottom: ${containerY.value}px`
      break;
    case 'rightTop':
      styleStr = `right: ${containerX.value}px; top: ${containerY.value}px`
      break;
    case 'rightBottom':
      styleStr = `right: ${containerX.value}px; bottom: ${containerY.value}px`
      break;
    default:
      break;
  }
  return styleStr
})

/**
 *
 * resize
 *
 */
let currentResizePointer = null
let startResizePointer: (null | PointerEvent) = null
let startContentWidth = 0
let startContentHeight = 0
let startContainerX = 0
let startContainerY = 0

type ResizeDirectionType = 'up' | 'bottom' | 'left' | 'right' | 'up-left' | 'up-right' | 'bottom-left' | 'bottom-right' | ''

const resizeDirection = ref<ResizeDirectionType>('')

const resizeSidebarPointerDownHandler = (direction: ResizeDirectionType, event: PointerEvent) => {
  if (event) {
    const currentTarget = event.currentTarget as HTMLElement
    currentTarget.setPointerCapture(event.pointerId)
    currentResizePointer = event
    startResizePointer = event
    resizeDirection.value = direction
    startContentWidth = contentWidth.value
    startContentHeight = contentHeight.value
    startContainerX = containerX.value
    startContainerY = containerY.value
  }
}

const resizeSidebarPointerMoveHandler = (event: PointerEvent) => {
  if (event && startResizePointer) {
    currentResizePointer = event

    // when pointer move resize the sidebar
    // adjust the position based on the positionPoint type
    // e.g. if the "positionPoint" is "leftBottom"
    // so the float dom is fixed based on bottom and left
    // when resize the float dom from bottom
    // should adjust bottom position at the same time
    if (resizeDirection.value !== 'left' && resizeDirection.value !== 'right') {
      const distance = currentResizePointer.y - startResizePointer.y

      if (resizeDirection.value === 'up' || resizeDirection.value === 'up-left' || resizeDirection.value === 'up-right') {
        contentHeight.value = startContentHeight - distance
      } else {
        contentHeight.value = startContentHeight + distance
        containerY.value = startContainerY - distance
      }
    }

    if (resizeDirection.value !== 'up' && resizeDirection.value !== 'bottom') {
      const distance = currentResizePointer.x - startResizePointer.x

      if (resizeDirection.value === 'left' || resizeDirection.value === 'up-left' || resizeDirection.value === 'bottom-left') {
        contentWidth.value = startContentWidth - distance
        containerX.value = startContainerX + distance
      } else {
        contentWidth.value = startContentWidth + distance
      }
    }
  }
}

const resizeSidebarPointerCancelHandler = () => {
  currentResizePointer = null
  startResizePointer = null
  resizeDirection.value = ''
  startContentWidth = 0
  startContentHeight = 0
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

    startContainerX = containerX.value
    startContainerY = containerY.value
  }
}

const dragSidebarPointerMoveHandler = (event: PointerEvent) => {
  if (event && startDragSidebarPointer) {
    currentDragSidebarPointer = event

    const dx = currentDragSidebarPointer.x - startDragSidebarPointer.x
    const dy = currentDragSidebarPointer.y - startDragSidebarPointer.y

    containerX.value = startContainerX + dx
    containerY.value = startContainerY - dy
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
    id="float-container"
    ref="floatDOM"
    tabindex="0"
    class="flex flex-col justify-center fixed z-30 select-none will-change-transform bg-gray-100 shadow-md shadow-gray-500 rounded-lg touch-none"
    :style="locationCoordinate"
  >
    <!-- resize control handlers at the top for the float DOM -->
    <div class="flex">
      <!-- up-left handler -->
      <button
        draggable="false"
        class="shrink-0 group pt-1 pl-1 flex justify-start items-start cursor-nwse-resize touch-none rounded-tl-lg transition-colors duration-300"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up-left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b transition-colors duration-300"
          :class="resizeDirection === 'up-left' ? 'bg-purple-400' : ( resizeDirection === 'up' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r transition-colors duration-300"
          :class="resizeDirection === 'up-left' ? 'bg-purple-400 group-hover:bg-purple-400' : (resizeDirection === 'up' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
      <!-- up handler -->
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-start cursor-ns-resize touch-none transition-colors duration-300"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded transition-colors duration-300"
          :class="resizeDirection === 'up' ? 'bg-purple-400' : (resizeDirection === 'up-left' || resizeDirection === 'up-right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
      <!-- up-right handler -->
      <button
        draggable="false"
        class="shrink-0 group pt-1 pr-1 flex justify-end items-start cursor-nesw-resize touch-none rounded-tr-lg transition-colors duration-300"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-right' || resizeDirection === 'right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('up-right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l transition-colors duration-300"
          :class="resizeDirection === 'up-right' ? 'bg-purple-400' : (resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'bottom-right' || resizeDirection === 'right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b transition-colors duration-300"
          :class="resizeDirection === 'up-right' ? 'bg-purple-400' : (resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'bottom-right' || resizeDirection === 'right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
    </div>

    <div class="flex items-stretch">
      <!-- resize control handler at the left for float DOM -->
      <button
        draggable="false"
        class="shrink-0 group cursor-ew-resize px-1 flex justify-start items-center touch-none transition-colors duration-300"
        :class="resizeDirection === 'up-left' || resizeDirection === 'left' || resizeDirection === 'bottom-left' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded transition-colors duration-300"
          :class="resizeDirection === 'left' ? 'bg-purple-400' : (resizeDirection === 'up-left' || resizeDirection === 'bottom-left' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>

      <div
        class="grow flex flex-col justify-start"
        :style="`width: ${contentWidth}px; height: ${contentHeight}px;`"
      >
        <!-- drag control handler at the top for the float DOM -->
        <button
          draggable="false"
          class="shrink-0 p-1 w-full flex justify-center items-center rounded transition-colors duration-300 cursor-move touch-none"
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

        <!-- content -->
        <div class="grow overflow-hidden">
          <slot>
            Hello
          </slot>
        </div>
      </div>

      <!-- resize control handler at the right for the float DOM -->
      <button
        draggable="false"
        class="shrink-0 group px-1 flex justify-end items-center transition-colors duration-300 cursor-ew-resize touch-none"
        :class="resizeDirection === 'up-right' || resizeDirection === 'right' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded transition-colors duration-300"
          :class="resizeDirection === 'right' ? 'bg-purple-400' : (resizeDirection === 'up-right' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
    </div>

    <!-- resize control handlers at the bottom for the float DOM -->
    <div class="flex">
      <button
        draggable="false"
        class="shrink-0 group pl-1 pb-1 flex justify-start items-end cursor-nesw-resize touch-none rounded-bl-lg transition-colors duration-300"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom-left', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t transition-colors duration-300"
          :class="resizeDirection === 'bottom-left' ? 'bg-purple-400' : (resizeDirection === 'bottom' || resizeDirection === 'bottom-right' || resizeDirection === 'up-left' || resizeDirection === 'left' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r transition-colors duration-300"
          :class="resizeDirection === 'bottom-left' ? 'bg-purple-400' : (resizeDirection === 'bottom' || resizeDirection === 'bottom-right' || resizeDirection === 'up-left' || resizeDirection === 'left' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-end transition-colors duration-300 cursor-ns-resize touch-none"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded transition-colors duration-300"
          :class="resizeDirection === 'bottom' ? 'bg-purple-400' : (resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pr-1 pb-1 flex justify-end items-end cursor-nwse-resize touch-none rounded-br-lg transition-colors duration-300"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-right' || resizeDirection === 'right' ? 'bg-purple-200' : ''"
        @pointerdown="resizeSidebarPointerDownHandler('bottom-right', $event)"
        @pointermove="resizeSidebarPointerMoveHandler"
        @pointercancel="resizeSidebarPointerCancelHandler"
        @pointerup="resizeSidebarPointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l transition-colors duration-300"
          :class="resizeDirection === 'bottom-right' ? 'bg-purple-400' : (resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'up-right' || resizeDirection === 'right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t transition-colors duration-300"
          :class="resizeDirection === 'bottom-right' ? 'bg-purple-400' : (resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'up-right' || resizeDirection === 'right' ? 'bg-purple-200' : 'bg-gray-200 group-hover:bg-gray-400')"
        />
      </button>
    </div>

    <!-- reset button for the float DOM location -->
    <!-- <Teleport to="body">
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
    </Teleport> -->
  </aside>
</template>

<style scoped>

</style>