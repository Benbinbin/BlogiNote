<script lang="ts" setup>
import mermaid from 'mermaid'

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
  },
  meta: {
    type: String,
    default: null
  }
})

/**
 *
 * collapse or expand the code block
 *
 */
const expand = ref(true)
const codeContainer = ref(null)
const codeLines = ref(3)

onMounted(() => {
  if (codeContainer.value) {
    codeLines.value = codeContainer.value.getElementsByClassName('line').length
  }
})

// toggle code block expand state
// and scroll the code block into view when collapse it
const codeBlockContainer = ref(null)
const toggleExpand = () => {
  expand.value = !expand.value
  if (!expand.value && codeBlockContainer.value) {
    nextTick(() => {
      codeBlockContainer.value.scrollIntoView({ block: "nearest" })
    })

  }
}

/**
 *
 * program language the block code belong to
 *
 */
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
  vue: '#41b883',
  markdown: '#083fa1',
  md: '#083fa1'
}

const programLanguage = ref('')

if(props.language) {
  programLanguage.value = props.language.toLowerCase()
}

const extensionRegex = /\.([0-9a-z]+)$/
if (props.filename) {
  const extensionMatchResult = props.filename.match(extensionRegex)
  if (extensionMatchResult && extensionMatchResult.length > 1) {
    programLanguage.value = extensionMatchResult[1].toLowerCase()
  }
}

/**
 *
 * copy block code content
 *
 */
type CopyState = 'wait' | 'process' | 'success' | 'fail'
const copyState = ref<CopyState>('wait')
const clipboard = ref<null | Navigator>(null)

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

/**
 *
 * the source (file) of block code
 *
 */
// the regular expression to match the link
// refer to https://stackoverflow.com/a/17773849/10699431
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

/**
 *
 * mermaid
 *
 */
// convert mermaid code to svg
const mermaidGraph = ref('')
onMounted(() => {
  if (props.language === 'mermaid' && props.code && document) {
    mermaid.mermaidAPI.initialize({ startOnLoad: false })
    mermaidGraph.value = mermaid.mermaidAPI.render('graphDiv', props.code)
  }
})
</script>

<template>
  <div
    ref="codeBlockContainer"
    class="my-4 rounded-lg"
    :class="props.language === 'mermaid' ? 'border border-gray-300' : ''"
  >
    <div
      class="w-full px-2 sm:px-4 py-2 flex justify-between items-center gap-2 sticky top-0 z-20 border-b rounded-t-lg"
      :class="props.language === 'mermaid' ? 'bg-gray-50 border-gray-300' : 'border-gray-600 bg-gray-900'"
    >
      <div class="shrink-0">
        <button
          v-show="codeLines > 3 && props.language !== 'mermaid'"
          @click="toggleExpand"
        >
          <IconCustom
            name="material-symbols:keyboard-arrow-down-rounded"
            class="w-4 h-4 text-gray-400 transition-transform duration-300"
            :class="expand ? '' : '-rotate-90'"
          />
        </button>
      </div>

      <div
        v-if="props.filename"
        class="code-filename-container grow flex items-center gap-2 overflow-x-auto"
      >
        <NuxtLink
          v-if="urlRegex.test(props.filename)"
          :to="props.filename"
          target="_blank"
          class=" no-underline transition-colors duration-300"
          style="text-decoration-line: none; color: #94a3b8;"
        >
          <IconCustom
            name="bi:link-45deg"
            class="shrink-0 w-4 h-4"
          />
          <!-- <span class="shrink-0 text-xs">{{ props.filename }}</span> -->
        </NuxtLink>
        <div
          v-else
          class=" flex items-center gap-2 text-gray-400 "
        >
          <IconCustom
            name="bi:file-earmark-code"
            class="shrink-0 w-4 h-4 "
          />
          <span class="shrink-0 text-xs">{{ props.filename }}</span>
        </div>
      </div>
      <div class="shrink-0 flex items-center gap-4">
        <button
          :title="copyState === 'wait' ? 'copy code' : ''"
          class="flex justify-center items-center text-gray-500 hover:text-purple-500 transition-colors duration-300"
          :class="!clipboard ? 'opacity-10' : ''"
          :disabled="copyState !== 'wait' || !clipboard"
          @click="copyHandler"
        >
          <IconCustom
            v-show="copyState === 'wait'"
            name="uil:copy"
            class="w-4 h-4"
          />
          <IconCustom
            v-show="copyState === 'process'"
            name="eos-icons:loading"
            class="w-4 h-4 text-purple-500"
          />
          <IconCustom
            v-show="copyState === 'success'"
            name="uil:check"
            class="w-4 h-4 text-green-500"
          />
          <IconCustom
            v-show="copyState === 'fail'"
            name="icon-park-outline:file-failed-one"
            class="w-4 h-4 text-red-500"
          />
        </button>

        <div class="flex items-center gap-1">
          <div
            class="w-2 h-2 rounded-full"
            :style="languageColorMap[programLanguage] ? `background-color: ${languageColorMap[programLanguage]}` : `background-color: ${languageColorMap.theme}`"
          />
          <span class="text-xs text-gray-500">{{
            programLanguage || 'code'
          }}</span>
        </div>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      v-if="props.language === 'mermaid'"
      class="mermaid p-4 rounded-b-lg"
      v-html="mermaidGraph"
    />
    <div
      v-else
      ref="codeContainer"
      class="relative px-2 bg-gray-900 rounded-b-lg"
      :class="expand ? '' : 'max-h-[72px] overflow-y-hidden'"
    >
      <div
        v-show="!expand"
        class="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-white/30 backdrop-blur-[2px] rounded-b-lg"
      />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-filename-container {
  &::-webkit-scrollbar {
    display: none;
  }
}

:slotted(pre) {
  @apply p-0 overflow-x-auto;
  counter-reset: lines;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  code {

    @apply block p-0 py-4 m-0 whitespace-pre bg-transparent border-0 rounded-none break-normal;

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
<style lang="scss">
.mermaid {
  svg {
    @apply mx-auto;
  }
}
</style>
