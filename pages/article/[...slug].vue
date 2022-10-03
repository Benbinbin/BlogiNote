<script setup lang="ts">
/**
*
* set head meta for article page
*
*/
// add CSS stylesheet for katex
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css'
    }
  ]
})

const route = useRoute()

/**
 *
 * switch the flexiMode
 *
 */
const flexiMode = useFlexiMode()

const changeFlexiMode = () => {
  if (flexiMode.value === 'blog') {
    flexiMode.value = 'note'
  } else {
    flexiMode.value = 'blog'
  }
}

/**
 *
 * get article data
 *
 */
const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent(route.path).findOne())

/**
 *
 * series modal
 *
 */
// get series data
const seriesList: any = ref([])
if (data.value?.series) {
  const { data: seriesResult } = await useAsyncData(`${data.value.series}-series`, () => {
    return queryContent('article')
      .where({ series: data.value.series })
      .only(['title', 'description', '_path', '_type', 'seriesOrder'])
      .sort({ seriesOrder: 1, $numeric: true })
      .find()
  })

  seriesList.value = seriesResult.value
}

// show or hide series modal
// const showSeriesModal = ref(false)
const showSeriesModal = useState<Boolean>('showSeriesModal', () => false)
// provide('showSeriesModal', showSeriesModal)

// const changeSeriesModalState = (state) => {
//   showSeriesModal.value = state
// }

// stop body scroll when series modal show up
watch(showSeriesModal, () => {
  if (!document?.body) { return }

  if (showSeriesModal.value) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

/**
 *
 * math formula
 * support double click to copy the formula
 *
 */
const articleContainer = ref(null)
const clipboard = ref(null)

const addListener = (list, prefix, suffix) => {
  list.forEach((element) => {
    // add event listener for double click
    element.addEventListener('dblclick', (event) => {
      const target = event.currentTarget as HTMLElement

      // after click set the math element border color to 'border-purple-400'
      target.style.borderColor = '#c084fc'

      // get the LaTeX source code of math formula
      // refer to https://github.com/KaTeX/KaTeX/issues/645
      const formulaElem = target.querySelector('annotation')

      if (formulaElem && formulaElem.textContent) {
        // add '$' or '$$' prefix and suffix for inline math or block math
        const formula = prefix + formulaElem.textContent + suffix

        if (clipboard.value) {
          // write the formula to clipboard and set the math element border color based on the promise resolve result
          clipboard.value.writeText(formula).then(() => {
            target.style.borderColor = '#4ade80'
            const timer = setTimeout(() => {
              target.style.borderColor = 'transparent'
              clearTimeout(timer)
            }, 800)
          })
            .catch(() => {
              target.style.borderColor = '#f87171'

              const timer = setTimeout(() => {
                target.style.borderColor = 'transparent'
                clearTimeout(timer)
              }, 800)
            })
        }
      } else {
        target.style.borderColor = '#f87171'

        const timer = setTimeout(() => {
          target.style.borderColor = 'transparent'
          clearTimeout(timer)
        }, 800)
      }
    })
  })
}

onMounted(() => {
  clipboard.value = navigator.clipboard

  if (articleContainer.value && clipboard.value) {
    const mathInlineList = articleContainer.value.querySelectorAll('.math-inline')
    const mathBlockList = articleContainer.value.querySelectorAll('.math-display')

    if (mathInlineList.length > 0) { addListener(mathInlineList, '$', '$') }
    if (mathBlockList.length > 0) { addListener(mathBlockList, '$$\n', '\n$$') }
  }
})

/**
 *
 * show or hide image lightbox
 *
 */
const showZoomImage = useShowZoomImage()

// stop body scroll when image lightbox show up
watch(showZoomImage, () => {
  if (!document?.body) { return }
  if (showZoomImage.value !== 'hidden') {
    document.body.classList.add('overflow-hidden')
  }
  if (showZoomImage.value === 'hidden') {
    document.body.classList.remove('overflow-hidden')
  }
})
</script>

<template>
  <div ref="articleContainer">
    <Head>
      <Title>{{ data?.title || 'Article' }}</Title>
    </Head>
    <NuxtLayout name="base" :footer-catalog="data?.body?.toc && data.body.toc.links.length > 0" :footer-flexi-mode="data && data.articleType==='note'">
      <MarkdownBlog
        v-if="!pending && data && data._type === 'markdown'"
        v-show="!data.articleType || data.articleType === 'blog' || (data.articleType === 'note' && flexiMode === 'blog')"
        :data="data"
        class="container mx-auto px-6 md:px-12 py-12 lg:max-w-4xl"
      />
      <MarkdownNote
        v-if="!pending && data && data._type === 'markdown' && data.articleType === 'note'"
        v-show="flexiMode === 'note'"
        :data="data"
        class="px-4 py-12"
      />
      <div v-else-if="!pending && data && (data._type === 'json' || data._type==='csv')" class="container mx-auto ">
        <div
          class="json-content-container max-h-[calc(100vh*0.8)] m-6 p-4 border rounded-lg overflow-auto"
        >
          <pre>{{ data }}</pre>
        </div>
      </div>
    </NuxtLayout>

    <button
      v-if="!pending && data && data.articleType === 'note'"
      :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
      class="w-9 h-9 hidden sm:flex justify-center items-center gap-1 fixed bottom-4 left-4 z-20 border transition-colors duration-300 rounded-lg"
      :class="flexiMode === 'blog' ? 'flex-col bg-purple-100 hover:bg-purple-50 border-purple-200' : 'flex-row bg-green-100 hover:bg-green-50 border-green-200'"
      @click="changeFlexiMode"
    >
      <div class="shrink-0 w-1.5 h-1.5 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-500' : 'bg-green-500'" />
      <div class="shrink-0 space-y-1">
        <div class="w-1 h-1 rounded-full " :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
        <div class="w-1 h-1 rounded-full " :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
      </div>
    </button>

    <Teleport to="body">
      <SeriesModal
        v-if="data?.series && seriesList.length > 0 && showSeriesModal"
        :current-path="data._path"
        :series-name="data.series"
        :series-list="seriesList"
      />
    </Teleport>

    <Teleport to="body">
      <ImageLightbox />
    </Teleport>
  </div>
</template>

<style scope lang="scss">
.json-content-container {
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

<style lang="scss">
.article-container {
  a {
    @apply text-blue-500 underline decoration-2 decoration-blue-400 hover:decoration-blue-500 visited:decoration-blue-100 hover:visited:decoration-blue-200 transition-colors duration-300;
  }

  p {
    @apply text-base;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold;

    a {
      @apply text-inherit hover:text-inherit no-underline hover:no-underline visited:no-underline hover:visited:no-underline;
    }
  }

  p,
  blockquote,
  dl {
    @apply my-4;
  }

  table {
    @apply my-0.5;
  }

  hr {
    @apply text-gray-400;
  }

  ul,
  ol {
    @apply pl-4 my-2.5;

    li {
      @apply my-2.5;
    }
  }

  ul {
    @apply list-disc;
  }

  ol {
    @apply list-decimal;
  }

  dl {
    dt {
      @apply font-bold italic my-2;
    }

    dd {
      @apply pl-4;
    }
  }

  blockquote {
    @apply px-2 border-l-4 border-gray-300;
  }

  table {
    @apply mx-auto table-auto;

    thead tr,
    tr:nth-child(2n) {
      @apply bg-gray-100;
    }

    th,
    td {
      @apply px-4 py-2 border border-gray-200 text-center;
    }
  }

  code {
    @apply px-1 py-0.5 mx-0.5 text-sm bg-gray-100 border rounded break-words;
  }

  .math {
    @apply px-2 py-1 overflow-x-auto border-2 border-transparent rounded-md select-none transition-colors duration-300;
  }

  .critic-addition {
    @apply bg-green-200 decoration-green-400;
  }

  del,
  .critic-deletion {
    @apply bg-red-200 decoration-red-400;
  }

  mark,
  .critic-highlight {
    @apply bg-yellow-200;
  }

  .critic-comment {
    @apply bg-purple-200;
  }
}
</style>
