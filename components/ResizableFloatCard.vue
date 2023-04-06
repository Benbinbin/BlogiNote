<script setup lang="ts">
const props = defineProps<{
  showResetButton: boolean;
  startWidth: number;
  startHeight: number;
  positionPoint: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
  startX: number;
  startY: number;
}>()

const floatDOM = ref(null)

// float container position
const containerX = ref(props.startX || 0)
const containerY = ref(props.startY || 0)

// float content side
const contentWidth = ref(props.startWidth || 0)
const contentHeight = ref(props.startHeight || 0)

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
 * resize content size
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

const resizePointerDownHandler = (direction: ResizeDirectionType, event: PointerEvent) => {
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

const resizePointerMoveHandler = (event: PointerEvent) => {
  if (event && startResizePointer) {
    currentResizePointer = event

    // when pointer move to resize the container
    // maybe need to adjust the position at the same time
    // e.g. if the "positionPoint" is "leftBottom"
    // so the float dom is fixed based on bottom and left
    // when resize the float dom from bottom
    // should adjust bottom position at the same time
    if (resizeDirection.value !== 'left' && resizeDirection.value !== 'right') {
      // if resize change the height (the pointer move along the Y axis)
      // maybe need to change the "containerY" at the same time
      const distanceY = currentResizePointer.y - startResizePointer.y

      if (resizeDirection.value === 'up' || resizeDirection.value === 'up-left' || resizeDirection.value === 'up-right') {
        contentHeight.value = startContentHeight - distanceY

        if (props.positionPoint === 'leftTop' || props.positionPoint === 'rightTop') {
          // if pointer is moving the top handlers
          // and the location position is on top
          // adjust the "containerY" at the same time
          containerY.value = startContainerY + distanceY
        }
      } else {
        contentHeight.value = startContentHeight + distanceY

        if (props.positionPoint === 'leftBottom' || props.positionPoint === 'rightBottom') {
          // if pointer is moving the the bottom handlers
          // and the location position is on bottom
          // adjust the "containerY" at the same time
          containerY.value = startContainerY - distanceY
        }
      }
    }

    if (resizeDirection.value !== 'up' && resizeDirection.value !== 'bottom') {
      // if resize change the width (the pointer move along the X axis)
      // maybe need to change the "containerX" at the same time
      const distanceX = currentResizePointer.x - startResizePointer.x

      if (resizeDirection.value === 'left' || resizeDirection.value === 'up-left' || resizeDirection.value === 'bottom-left') {
        contentWidth.value = startContentWidth - distanceX

        if(props.positionPoint === 'leftTop' || props.positionPoint === 'leftBottom') {
          // if pointer is moving the left handlers
          // and the location position is on left
          // adjust the "containerX" at the same time
          containerX.value = startContainerX + distanceX
        }
      } else {
        contentWidth.value = startContentWidth + distanceX

        if(props.positionPoint === 'rightTop' || props.positionPoint === 'rightBottom') {
          // if pointer is moving the right handlers
          // and the location position is on right
          // adjust the "containerX" at the same time
          containerX.value = startContainerX - distanceX
        }
      }

    }
  }
}

const resizePointerCancelHandler = () => {
  currentResizePointer = null
  startResizePointer = null
  resizeDirection.value = ''
  startContentWidth = 0
  startContentHeight = 0
}

/**
 *
 * drag to move container
 *
 */
let currentDragPointer = null
let startDragPointer: (null | PointerEvent) = null
const dragState = ref(false)
const dragPointerDownHandler = (event: PointerEvent) => {
  if (event) {
    dragState.value = true
    const currentTarget = event.currentTarget as HTMLElement
    currentTarget.setPointerCapture(event.pointerId)
    currentDragPointer = event
    startDragPointer = event

    startContainerX = containerX.value
    startContainerY = containerY.value
  }
}

const dragPointerMoveHandler = (event: PointerEvent) => {
  if (event && startDragPointer) {
    currentDragPointer = event

    const dx = currentDragPointer.x - startDragPointer.x
    const dy = currentDragPointer.y - startDragPointer.y

    if(props.positionPoint === 'leftTop' || props.positionPoint === 'leftBottom') {
      containerX.value = startContainerX + dx
    } else {
      containerX.value = startContainerX - dx
    }

    if(props.positionPoint === 'leftTop' || props.positionPoint === 'rightTop') {
      containerY.value = startContainerY + dy
    } else {
      containerY.value = startContainerY - dy
    }
  }
}

const dragPointerCancelHandler = () => {
  dragState.value = false
  currentDragPointer = null
  startDragPointer = null
}

const resetFloatCardHandler = () => {
  // float container position
  containerX.value = props.startX || 16
  containerY.value = props.startY || 80

  // float content side
  contentWidth.value = props.startWidth || 300
  contentHeight.value = props.startHeight || 300
}
</script>

<template>
  <aside
    id="float-container"
    ref="floatDOM"
    tabindex="0"
    class="flex flex-col justify-center fixed z-40 select-none will-change-transform bg-gray-100 shadow-md shadow-gray-500 rounded-lg touch-none"
    :style="locationCoordinate"
  >
    <!-- resize control handlers at the top for the float DOM -->
    <div class="flex">
      <!-- up-left handler -->
      <button
        draggable="false"
        class="shrink-0 group pt-1 pl-1 flex justify-start items-start cursor-nwse-resize touch-none rounded-tl-lg transition-colors duration-300"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('up-left', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
        @pointerdown="resizePointerDownHandler('up', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
        @pointerdown="resizePointerDownHandler('up-right', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
        @pointerdown="resizePointerDownHandler('left', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
          :class="dragState ? 'bg-purple-200 text-purple-500' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'"
          @pointerdown="dragPointerDownHandler"
          @pointermove="dragPointerMoveHandler"
          @pointercancel="dragPointerCancelHandler"
          @pointerup="dragPointerCancelHandler"
        >
          <IconCustom
            name="akar-icons:drag-horizontal"
            class="w-4 h-4"
          />
        </button>

        <!-- content -->
        <slot
          :content-width="contentWidth"
          :content-height="contentHeight"
        >
          Hello
        </slot>
      </div>

      <!-- resize control handler at the right for the float DOM -->
      <button
        draggable="false"
        class="shrink-0 group px-1 flex justify-end items-center transition-colors duration-300 cursor-ew-resize touch-none"
        :class="resizeDirection === 'up-right' || resizeDirection === 'right' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('right', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
        @pointerdown="resizePointerDownHandler('bottom-left', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
        @pointerdown="resizePointerDownHandler('bottom', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
        @pointerdown="resizePointerDownHandler('bottom-right', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
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
    <Teleport to="body">
      <Transition
        enter-from-class="translate-x-10"
        enter-active-class="transition-transform duration-500 ease"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-active-class="transition-transform duration-75 ease"
        leave-to-class="translate-x-10"
      >
        <button
          v-show="props.showResetButton"
          :data-show="props.showResetButton"
          class="p-3 sm:p-2 flex justify-center items-center fixed bottom-[8.5rem] sm:bottom-28 right-2 sm:right-4 z-40 active:text-white rounded-lg text-purple-400 hover:text-purple-500 bg-purple-100 active:bg-purple-500 border border-purple-200"
          @click="resetFloatCardHandler"
        >
          <IconCustom
            name="bi:layout-sidebar-inset"
            class="w-5 h-5"
          />
        </button>
      </Transition>
    </Teleport>
  </aside>
</template>

<style scoped>

</style>