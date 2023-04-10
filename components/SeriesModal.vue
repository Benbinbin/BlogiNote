<script setup lang="ts">
const props = defineProps<{
  currentPath: string;
  seriesName: string;
  seriesList: any;
}>()

const showSeriesModal = useState<Boolean>('showSeriesModal', () => false)

const showDetail = ref(false)

/**
 *
 * control the scroll behavior
 *
 */
// stop body scroll when series modal show up
watch(showSeriesModal, () => {
  if (!document?.body) { return }

  if (showSeriesModal.value) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}, { immediate: true })


/**
 *
 * shortcut key
 *
 */
const router = useRouter()
const itemRefs = ref<HTMLElement[]>([])
const itemNum = ref(0)
let currentIndex = -1
const ModalKeyListener = function (event:KeyboardEvent) {
  if (event.key === 'Escape') {
    // press Esc key to hide modal
    // emits('close')
    showSeriesModal.value = false
  } else if (event.key === 'ArrowDown') {
    // navigate to next item
    currentIndex = currentIndex + 1

    if (currentIndex > itemNum.value - 1) {
      currentIndex = 0
    }

    const target = itemRefs.value[currentIndex]

    if (target) {
      target.focus()
    }
  } else if (event.key === 'ArrowUp') {
    // navigate to prev item
    currentIndex = currentIndex - 1

    if (currentIndex < 0) {
      currentIndex = itemNum.value - 1
    }

    const target = itemRefs.value[currentIndex]

    if (target) {
      target.focus()
    }
  } else if (event.key === 'Enter') {
    const targetPath = props.seriesList[currentIndex]._path
    router.push({ path: targetPath })
    // emits('close')
    showSeriesModal.value = false
  }
}

onMounted(() => {
  if (document) {
    itemNum.value = itemRefs.value.length
    document.addEventListener('keyup', ModalKeyListener)
  }
})

onUnmounted(() => {
  document.removeEventListener('keyup', ModalKeyListener)
})
</script>

<template>
  <div
    class="expand-window p-4 fixed inset-0 z-[80] flex justify-center items-center"
  >
    <div
      class="expand-window absolute inset-0 -z-10 flex justify-center items-center bg-black/30 backdrop-blur"
      @click="showSeriesModal=false"
    />
    <div
      class="modal-container flex flex-col lg:max-w-4xl"
    >
      <h2 class="px-4 py-4 sm:py-6 text-lg sm:text-xl font-bold text-center bg-white border-b rounded-t-lg">
        {{ props.seriesName }}
      </h2>
      <ol
        v-if="seriesList && seriesList.length > 0"
        ref="seriesModalContentDOM"
        class="modal-content-container pl-8 md:pl-12 pr-4 py-4 list-decimal space-y-2 overflow-y-auto bg-white"
      >
        <li
          v-for="article in seriesList"
          ref="itemRefs"
          :key="article._path"
          tabindex="0"
          class="py-2 hover:text-blue-500 hover:bg-blue-100 focus:outline-blue-500 transition-colors duration-300 rounded-md"
          :class="props.currentPath === article._path ? 'text-blue-500' : 'text-gray-600'"
        >
          <NuxtLink
            :to="article._path"
            class="block px-4 space-y-2 "
            @click="showSeriesModal=false"
          >
            <h3 class="font-bold">
              {{ article.title }}
            </h3>
            <p
              v-show="showDetail && article.description"
              class="text-sm opacity-60"
            >
              {{ article.description }}
            </p>
          </NuxtLink>
        </li>
      </ol>
      <div
        v-else
        class="p-4 flex flex-col justify-center items-center space-y-2 bg-white rounded-t-lg"
      >
        <IconCustom
          name="fluent:mail-inbox-dismiss-28-filled"
          class="w-10 h-10"
        />
        <p>Oops! There is no series.</p>
      </div>
      <div
        class="p-2 grid grid-cols-2 gap-2 justify-items-stretch sticky bottom-0 inset-x-0 text-xs bg-white border-t rounded-b-lg"
      >
        <button
          class="px-4 py-2.5 flex justify-center items-center space-x-1 text-red-600 bg-red-100 hover:text-white hover:bg-red-500 focus:outline-red-500 rounded transition-colors duration-300"
          title="close window"
          @click="showSeriesModal=false"
        >
          <span>Esc</span>
        </button>

        <button
          class="px-4 py-2.5 flex justify-center items-center space-x-1 focus:outline-green-500 rounded transition-colors duration-300"
          :class="showDetail ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-600 bg-green-100 hover:text-white hover:bg-green-500 '"
          :title="showDetail ? 'Less Details' : 'More Details'"
          @click="showDetail = !showDetail"
        >
          <p><span class="hidden sm:inline">{{ showDetail ? 'Less' : 'More' }}</span> Detail</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.expand-window {
  width: 100dvw;
  height: 100dvh;
}

.modal-container {
  max-height: 80dvh;
}

.modal-content-container::-webkit-scrollbar {
  display: none;
}

</style>
