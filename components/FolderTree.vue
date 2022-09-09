<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
// import fileTypeMap from '@/utils/fileType.json'

const props = defineProps<{
  rootName: string;
  rootTree: NavItem[];
  rootIndex: number;
}>()

const emits = defineEmits(['set-tree'])

const expand = ref(true)

/**
 *
 * get file type icon
 *
 */
const fileTypeMap = useFileTypeMap()

const getFileTypeIcon = (type) => {
  const fileType = fileTypeMap.value[type]

  if (!fileType) {
    return fileTypeMap.value.default.iconName
  } else {
    return fileType.iconName
  }
}

/**
 *
 * folder nav
 *
 */
const folderNavArr = ref([
  {
    title: props.rootName,
    path: []
  }
])

let folderNavPath = []

const currentTree = ref<NavItem[]>([])

currentTree.value = props.rootTree

const setFolderNavPath = (path) => {
  folderNavPath = path
  let treeTemp = props.rootTree

  const folderNavArrTemp = [{
    title: props.rootName,
    path: []
  }]

  let folderNavPathTemp = []

  if (path.length > 0) {
    path.forEach((index) => {
      folderNavPathTemp = folderNavPathTemp.concat(index)
      folderNavArrTemp.unshift({
        title: treeTemp[index].title,
        path: folderNavPathTemp
      })
      treeTemp = treeTemp[index].children
    })
  }

  currentTree.value = treeTemp
  folderNavArr.value = folderNavArrTemp

  nextTick(() => {
    rejudgeShowScrollBtn()
  })
}

const addFolderNav = (title, index) => {
  folderNavPath = folderNavPath.concat(index)

  folderNavArr.value.unshift({
    title,
    path: folderNavPath
  })

  currentTree.value = currentTree.value[index].children

  nextTick(() => {
    rejudgeShowScrollBtn()
  })
}

const setTreeHandler = () => {
  const path = [props.rootIndex, ...folderNavPath]
  emits('set-tree', path, 'drill-down')
}

/**
 *
 * scroll the folder nav
 *
 */
const showScrollBtn = ref(true)

const scrollPos = ref<'start' | 'middle' | 'end'>('start')

const folderNavContainer = ref(null)

const rejudgeShowScrollBtn = () => {
  // show of hide the scroll button
  if (folderNavContainer.value) {
    if (folderNavContainer.value.scrollWidth <= folderNavContainer.value.clientWidth) {
      showScrollBtn.value = false
    } else {
      showScrollBtn.value = true
    }

    if (folderNavContainer.value.scrollLeft + folderNavContainer.value.clientWidth >= folderNavContainer.value.scrollWidth) {
      scrollPos.value = 'end'
    } else if (folderNavContainer.value.scrollLeft === 0) {
      scrollPos.value = 'start'
    } else {
      scrollPos.value = 'middle'
    }
  }
}

onMounted(() => {
  rejudgeShowScrollBtn()
})

const scrollFolderNavHandler = (direction) => {
  if (!folderNavContainer.value) { return }
  const containerWidth = folderNavContainer.value.clientWidth

  if (direction === 'left') {
    folderNavContainer.value.scrollLeft -= containerWidth
  } else if (direction === 'right') {
    folderNavContainer.value.scrollLeft += containerWidth
  }
}

const folderNavScrollingHandler = () => {
  if (folderNavContainer.value) {
    if (folderNavContainer.value.scrollLeft + folderNavContainer.value.clientWidth >= folderNavContainer.value.scrollWidth) {
      scrollPos.value = 'end'
    } else if (folderNavContainer.value.scrollLeft === 0) {
      scrollPos.value = 'start'
    } else {
      scrollPos.value = 'middle'
    }
  }
}
</script>
<template>
  <div
    class="self-stretch max-h-full flex"
    :class="expand ? (props.rootTree.length <= 2 ? 'col-span-1 sm:col-span-2 row-span-2' : (props.rootTree.length <= 4 ? 'col-span-1 sm:col-span-2 row-span-3' : (props.rootTree.length <= 6 ? 'col-span-1 sm:col-span-2 row-span-4' : 'col-span-1 sm:col-span-2 row-span-5'))) : 'col-span-1'"
  >
    <button
      v-show="!expand"
      class="group w-full px-4 py-2 flex items-center gap-1 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors duration-300"
      @click="expand = true"
    >
      <IconCustom name="ph:folder-fill" class="w-6 h-6 text-yellow-400" />
      {{ props.rootName }}
    </button>
    <div v-show="expand" class="w-full flex flex-col">
      <div class="w-full flex justify-between items-center">
        <button
          class="shrink-0 group w-fit p-2 flex items-center gap-1 relative z-10 text-xs hover:text-yellow-500 active:text-white bg-white hover:bg-yellow-50 active:bg-yellow-500 border-t border-x rounded-t transition-colors duration-300 translate-y-px"
          @click="setTreeHandler"
        >
          <IconCustom name="ph:folder-open-fill" class="w-4 h-4 text-yellow-400 group-active:text-white" />
          {{ folderNavArr[0].title }}
        </button>
        <div
          v-show="folderNavArr.length > 1"
          ref="folderNavContainer"
          class="folder-nav-container grow flex justify-start items-center overflow-x-auto -translate-x-1 translate-y-px scroll-smooth"
          @scroll.passive="folderNavScrollingHandler"
        >
          <button
            v-for="(folder, index) in folderNavArr.slice(1)"
            :key="folder.path.length > 0 ? folder.path.join() : 'root'"
            class="shrink-0 p-2 relative border-t border-r text-xs text-gray-400 hover:text-yellow-400 rounded-tr transition-colors duration-300"
            :style="`transform: translateX(-${(index * 2)}px)`"
            @click="setFolderNavPath(folder.path)"
          >
            {{ folder.title }}
          </button>
        </div>
        <div class="shrink-0 pl-2 flex items-center gap-0.5">
          <button
            v-show="showScrollBtn"
            :disabled="scrollPos === 'start'"
            class="p-1 hidden sm:flex items-center text-green-400 hover:text-green-500 bg-green-100 hover:bg-green-200 rounded-full transition-colors duration-300"
            :class="scrollPos === 'start' ? 'opacity-30' : ''"
            @click="scrollFolderNavHandler('left')"
          >
            <IconCustom name="ic:round-keyboard-arrow-left" class="w-3.5 h-3.5" />
          </button>
          <button
            v-show="showScrollBtn"
            :disabled="scrollPos === 'end'"
            class="p-1 hidden sm:flex items-center text-green-400 hover:text-green-500 bg-green-100 hover:bg-green-200 rounded-full transition-colors duration-300"
            :class="scrollPos === 'end' ? 'opacity-30' : ''"
            @click="scrollFolderNavHandler('right')"
          >
            <IconCustom name="ic:round-keyboard-arrow-right" class="w-3.5 h-3.5" />
          </button>
          <button
            class="p-1 flex items-center text-red-300 hover:text-red-400 bg-red-50 hover:bg-red-100 rounded-full transition-colors duration-300"
            @click="expand = false"
          >
            <IconCustom name="ion:close" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        class="tree-container grow p-2 flex flex-wrap items-start gap-2 border rounded-b-lg rounded-tr-lg bg-white overflow-y-auto"
      >
        <template v-for="(item, index) in currentTree">
          <NuxtLink
            v-if="item._type"
            :key="item._path"
            :to="item._path"
            target="_blank"
            class="p-2 flex items-center gap-1 text-sm rounded hover:text-blue-500 active:text-white hover:bg-blue-100 active:bg-blue-500 transition-colors duration-300"
          >
            <IconCustom :name="getFileTypeIcon(item._type)" class="w-5 h-5" />
            {{ item.title }}
          </NuxtLink>
          <button
            v-if="item.children"
            :key="item._path"
            class="group p-2 flex items-center gap-1 text-sm rounded hover:text-yellow-500 active:text-white hover:bg-yellow-50 active:bg-yellow-500 transition-colors duration-300"
            @click="addFolderNav(item.title, index)"
          >
            <IconCustom name="ph:folder-fill" class="w-5 h-5 text-yellow-400 group-active:text-white" />
            {{ item.title }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.folder-nav-container {
  &::-webkit-scrollbar {
    display: none;
  }
}

.tree-container {
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
</style>
