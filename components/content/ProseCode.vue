<script lang="ts" setup>
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  }
})

const expand = ref(true)
const codeContainer = ref(null)
const codeLines = ref(3)
onMounted(() => {
  if (codeContainer.value) {
    codeLines.value = codeContainer.value.getElementsByClassName('line').length
  }
})

// based on github for different code language color
// refer to https://github.com/ozh/github-colors/blob/master/colors.json
const languageColorMap = {
  theme: '#a855f7',
  bash: '#89e051',
  shell: '#89e051',
  html: '#e34c26',
  javascript: '#f1e05a',
  js: '#f1e05a',
  css: '#563d7c',
  scss: '#c6538c',
  vue: '#41b883'
}

type CopyState = 'wait' | 'process' | 'success' | 'fail'
const copyState = ref<CopyState>('wait')
const clipboard = ref(null)

onMounted(() => {
  clipboard.value = navigator.clipboard
})

const copyHandler = () => {
  copyState.value = 'process'
  if (clipboard.value) {
    clipboard.value.writeText(props.code).then(() => {
      copyState.value = 'success'

      const timer = setTimeout(() => {
        copyState.value = 'wait'
        clearTimeout(timer)
      }, 800)
    })
      .catch(() => {
        copyState.value = 'fail'

        const timer = setTimeout(() => {
          copyState.value = 'wait'
          clearTimeout(timer)
        }, 800)
      })
  }
}
</script>

<template>
  <div class="my-4 bg-gray-900 rounded-lg overflow-hidden">
    <div class="px-4 py-2 flex justify-between items-center border-b border-gray-600">
      <div>
        <button v-show="codeLines > 3" @click="expand = !expand">
          <IconCustom
            name="material-symbols:arrow-forward-ios-rounded"
            class="w-4 h-4 text-gray-400 transition-transform duration-300"
            :class="expand ? 'rotate-90' : ''"
          />
        </button>
      </div>
      <div class="flex items-center gap-4">
        <button
          :title="copyState === 'wait' ? 'copy code' : ''"
          class="flex justify-center items-center text-gray-500 hover:text-purple-500 transition-colors duration-300"
          :class="!clipboard ? 'opacity-10' : ''"
          :disabled="copyState !== 'wait' || !clipboard"
          @click="copyHandler"
        >
          <IconCustom v-show="copyState === 'wait'" name="uil:copy" class="w-4 h-4" />
          <IconCustom v-show="copyState === 'process'" name="eos-icons:loading" class="w-4 h-4 text-purple-500" />
          <IconCustom v-show="copyState === 'success'" name="uil:check" class="w-4 h-4 text-green-500" />
          <IconCustom
            v-show="copyState === 'fail'"
            name="icon-park-outline:file-failed-one"
            class="w-4 h-4 text-red-500"
          />
        </button>

        <div class="flex items-center gap-1">
          <div
            class="w-2 h-2 rounded-full"
            :style="languageColorMap[props.language.toLowerCase()] ? `background-color: ${languageColorMap[props.language.toLowerCase()]}` : `background-color: ${languageColorMap.theme}`"
          />
          <span class="text-xs text-gray-500">{{
            $props.language || 'code'
          }}</span>
        </div>
      </div>
    </div>
    <div ref="codeContainer" class="relative px-2" :class="expand ? '' : 'max-h-[72px]'">
      <div
        v-show="!expand"
        class="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-white/30 backdrop-blur-[2px]"
      />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:slotted(pre) {
  @apply p-0 overflow-x-auto;
  counter-reset: lines;

  code {

    @apply block p-0 py-4 m-0 whitespace-pre bg-transparent border-0 rounded-none;

    .line {
      @apply block min-h-[1rem] border-l-2 border-gray-900;

      &::before {
        counter-increment: lines;
        content: counter(lines);
        @apply inline-block w-6 ml-2 mr-1 text-gray-600 text-left;
      }
    }

    .highlight {
      @apply bg-gray-700/80 border-purple-500
    }
  }
}
</style>
