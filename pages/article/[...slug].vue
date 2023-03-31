<script setup lang="ts">
const route = useRoute()

/**
 *
 * fetch the article data based on the current route path
 *
 */
const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent(route.path).findOne())

console.log(data);

// the previous and next article
const prevArticleUrl = ref('')
const prevArticleName = ref('')
const nextArticleUrl = ref('')
const nextArticleName = ref('')

/**
 *
 * series articles
 *
 */
const seriesList: any = ref([])

if (data.value?.series) {
  // if this post belong to a series
  // fetch articles list based on series
  const { data: seriesResult } = await useAsyncData(`${data.value.series}-series`, () => {
    return queryContent('article')
      .where({ series: data.value?.series })
      .only(['title', 'description', '_path', '_type', 'seriesOrder'])
      .sort({ seriesOrder: 1, $numeric: true })
      .find()
  })

  seriesList.value = seriesResult.value

  // based on the series articles list
  // set the previous article and next article
  if (seriesResult.value && seriesResult.value.length > 1) {
    // find the current article index inside the series articles list
    const currentArticleIndex = seriesResult.value.findIndex(item => route.path === item._path)

    if(currentArticleIndex!==-1) {
      if (currentArticleIndex === 0) {
        // if current page is the first article in the series list
        // just set the next article
        nextArticleName.value = seriesResult.value[currentArticleIndex + 1].title
        nextArticleUrl.value = seriesResult.value[currentArticleIndex + 1]._path
      } else if (currentArticleIndex === seriesResult.value.length - 1) {
        // if current page is the last article in the series list
        // just set the previous article
        prevArticleName.value = seriesResult.value[currentArticleIndex - 1].title
        prevArticleUrl.value = seriesResult.value[currentArticleIndex - 1]._path
      } else {
        // if current page is in the middle of the series list
        // set the previous article
        nextArticleName.value = seriesResult.value[currentArticleIndex + 1].title
        nextArticleUrl.value = seriesResult.value[currentArticleIndex + 1]._path
        // set the next article
        prevArticleName.value = seriesResult.value[currentArticleIndex - 1].title
        prevArticleUrl.value = seriesResult.value[currentArticleIndex - 1]._path
      }
    }
  }
}

// show or hide series modal
const showSeriesModal = useState<Boolean>('showSeriesModal', () => false)

// if the page metadata has the information about previous or next article
// rewrite the default value
if(data.value?.prevArticleUrl) {
  prevArticleUrl.value = data.value.prevArticleUrl
}

if(data.value?.prevArticleName) {
  prevArticleName.value = data.value.prevArticleName
}

if(data.value?.nextArticleUrl) {
  nextArticleUrl.value = data.value.nextArticleUrl
}

if(data.value?.nextArticleName) {
  nextArticleName.value = data.value.nextArticleName
}

/**
 *
 * math formula
 *
 */
const clipboard = ref<null | Clipboard>(null)

// add click event listener for a list of DOM
// make them support the feature about double click to copy the formula
const addClickListener = (list: NodeListOf<Element>, prefix: string , suffix: string) => {
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

const articleContainerDOM = ref<null | HTMLElement>(null)
onMounted(() => {
  clipboard.value = navigator.clipboard

  if (articleContainerDOM.value && clipboard.value) {
    // get all the inline math <span> dom
    const mathInlineList = articleContainerDOM.value.querySelectorAll('.math-inline')
    // get all the block math <div> dom
    const mathBlockList = articleContainerDOM.value.querySelectorAll('.math-display')

    // add click event listener for each dom
    if (mathInlineList.length > 0) { addClickListener(mathInlineList, '$', '$') }
    if (mathBlockList.length > 0) { addClickListener(mathBlockList, '$$\n', '\n$$') }
  }
})
</script>

<template>
  <div ref="articleContainerDOM">
    <Head>
      <Title>{{ data?.title || 'Article' }}</Title>
    </Head>
    <NuxtLayout
      name="base"
      :footer-catalog="data?.body?.toc && data.body.toc.links.length > 0"
    >
      <MarkdownPost
        v-if="!pending && data && data._type === 'markdown'"
        :data="data"
        :prev-article-url="prevArticleUrl"
        :next-article-url="nextArticleUrl"
        class="markdown-post container mx-auto px-6 md:px-12 py-12 lg:max-w-4xl"
      />
      <div
        v-else-if="!pending && data && (data._type === 'json' || data._type==='csv')"
        class="container mx-auto "
      >
        <div
          class="json-content-container max-h-[calc(100vh*0.8)] m-6 p-4 border rounded-lg overflow-auto"
        >
          <pre>{{ data }}</pre>
        </div>
      </div>

      <div
        v-if="(prevArticleUrl || nextArticleUrl)"
        class="container lg:max-w-4xl mx-auto px-6 md:px-12 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <NuxtLink
          v-if="prevArticleUrl"
          :to="prevArticleUrl"
          class="px-4 py-6 flex justify-start items-center text-gray-600 hover:text-white hover:bg-green-500 border border-gray-400 hover:border-green-500 focus:outline-none rounded-lg transition-colors duration-300"
        >
          <div class="flex items-center gap-1">
            <IconCustom
              name="ic:round-keyboard-arrow-left"
              class="shrink-0 w-8 h-8 opacity-70"
            />
            <div class="flex flex-col gap-2">
              <p class="text-lg font-bold">
                Previous Article
              </p>
              <p
                v-if="prevArticleName"
                class="text-xs opacity-80"
              >
                {{ prevArticleName }}
              </p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink
          v-if="nextArticleUrl"
          :to="nextArticleUrl"
          class="px-4 py-6 flex justify-end items-center text-gray-600 hover:text-white hover:bg-green-500 border border-gray-400 hover:border-green-500 focus:outline-none rounded-lg transition-colors duration-300"
        >
          <div class="flex items-center gap-1">
            <div class="flex flex-col gap-2">
              <p class="text-lg font-bold text-end">
                Next Article
              </p>
              <p
                v-if="nextArticleName"
                class="text-xs opacity-80 text-end"
              >
                {{ nextArticleName }}
              </p>
            </div>
            <IconCustom
              name="ic:round-keyboard-arrow-right"
              class="shrink-0 w-8 h-8 opacity-70"
            />
          </div>
        </NuxtLink>
      </div>
    </NuxtLayout>

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
.markdown-post {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    word-wrap: break-word;
  }
}
</style>
