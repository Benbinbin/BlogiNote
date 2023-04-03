<script setup lang="ts">
const props = defineProps<{
  data: any;
}>()

const appConfig = useAppConfig()
const route = useRoute()

/**
 *
 * theme (it's like the theme for the article)
 * it's (direct) sub-directory under the `content/article`
 * which containers the markdown file
 *
 */
const theme = ref('')
if (props.data._path) {
  const pathArr = props.data._path.split('/')

  if (pathArr.length > 3 && pathArr[1] === 'article') {
    theme.value = pathArr[2]
  }
}

/**
 *
 * article time
 *
 */
let showTime = true
// show created and updated time or not decided by appConfig
showTime = appConfig.bloginote.articlePage.showTime
// show created and updated time or not decided by page metadata
if ('showTime' in props.data) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  showTime = props.data.showTime
}

/**
 *
 * expired warning
 *
 */
let showOutdatedWarningComponent = true
// show expire warning or not decided by appConfig
showOutdatedWarningComponent = appConfig.bloginote.articlePage.outdated.show
if ('showOutdatedWarning' in props.data) {
  // show expire warning or not decided by page metadata
  // eslint-disable-next-line vue/no-setup-props-destructure
  showOutdatedWarningComponent = props.data.showOutdatedWarning
}

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
// #region series
const seriesList: any = ref([])
// show or hide series modal
const showSeriesModal = useState<Boolean>('showSeriesModal', () => false)
if (props.data?.series) {
  // if this post belong to a series
  // fetch articles list based on series
  const { data: seriesResult } = await useAsyncData(`${props.data.series}-series`, () => {
    return queryContent('article')
      .where({ series: props.data.series })
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

    if (currentArticleIndex !== -1) {
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



// if the page metadata has the information about previous or next article
// rewrite the default value
if (props.data.value?.prevArticleUrl) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  prevArticleUrl.value = props.data.value.prevArticleUrl
}

if (props.data.value?.prevArticleName) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  prevArticleName.value = props.data.value.prevArticleName
}

if (props.data.value?.nextArticleUrl) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  nextArticleUrl.value = props.data.value.nextArticleUrl
}

if (props.data.value?.nextArticleName) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  nextArticleName.value = props.data.value.nextArticleName
}
// #endregion

/**
 *
 * show or hide tags
 */
const showTags = ref(true)

/**
 *
 * math formula
 *
 */
// #region math
const clipboard = ref<null | Clipboard>(null)

// add click event listener for a list of DOM
// make them support the feature about double click to copy the formula
const addClickListener = (list: NodeListOf<Element>, prefix: string, suffix: string) => {
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
// #endregion

/**
 *
 * catalog (it's the toc for markdown article)
 *
 */
// #region catalog
const pageScrollTop = usePageScrollTop()
const showCatalog = useState('showCatalog')
// active headings
// the active headings is the heading shown in the viewport
const activeH2Headings = ref<string | undefined>()
const activeH3Headings = ref<string | undefined>()
const activeH4Headings = ref<string | undefined>()
const activeH5Headings = ref<string | undefined>()
const activeH6Headings = ref<string | undefined>()

// provide for the catalog relative components
provide('activeH2Headings', activeH2Headings)
provide('activeH3Headings', activeH3Headings)
provide('activeH4Headings', activeH4Headings)
provide('activeH5Headings', activeH5Headings)
provide('activeH6Headings', activeH6Headings)

function setActiveHeading(heading: HTMLElement) {
  const headingPathStr = heading?.dataset?.headingPath

  if (headingPathStr) {
    const headingPathObj = JSON.parse(headingPathStr)
    activeH2Headings.value = headingPathObj['h2']
    activeH3Headings.value = headingPathObj['h3']
    activeH4Headings.value = headingPathObj['h4']
    activeH5Headings.value = headingPathObj['h5']
    activeH6Headings.value = headingPathObj['h6']
  }
}

// observer the active headings
let observer:IntersectionObserver
const articleDOM = ref<HTMLElement | null>(null) // get the article DOM

// limited the observer just work on the client side
// and only observer when the article has toc
if(process.client && props.data?.body?.toc && props.data.body.toc.links.length > 0) {
  onMounted(() => {
    if (articleDOM.value) {
      // get the headings DOM of article
      const headingDomList = articleDOM.value.querySelectorAll('h2, h3, h4, h5, h6')

      // set intersection observer for these headings DOM
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const changeHeading = entry.target
          // console.log(changeHeading);
          const id = changeHeading.id
          if (entry.intersectionRatio > 0) {
            // when the heading appear in viewport
            // reset the active headings
            setActiveHeading(changeHeading as HTMLElement)
          } else if (entry.boundingClientRect.y > 0) {
            // when the heading disappear at the bottom
            // it mean the user scroll up to see the previous content
            // so we should fallback to the previous heading
            let index;
            for (let i = 0; i < headingDomList.length; i++) {
              const item = headingDomList[i]
              if(item.id === id) {
                index = i
                break;
              }
            }
            if(index && index-1>= 0) {
              const prevHeading = headingDomList[index-1]
              setActiveHeading(prevHeading as HTMLElement)
            }
          }
        })
      })

      if (headingDomList.length > 0) {
        headingDomList.forEach((heading) => {
          observer.observe(heading)
        })
      }
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
// #endregion

</script>

<template>
  <div
    ref="articleDOM"
    class="markdown-post"
  >
    <div
      v-if="props.data.cover"
      class="my-4 w-full h-60 lg:h-72 xl:h-80 bg-cover bg-center bg-no-repeat"
      :style="`background-image: url('${props.data.cover}')`"
    />
    <div class="py-8 selection:text-white selection:bg-purple-400">
      <h1 class="py-4 text-3xl md:text-5xl font-bold text-center">
        {{ props.data.title || "Article" }}
      </h1>
      <div class="py-2 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        <NuxtLink
          v-if="theme"
          :to="{ path: '/list', query: { theme: theme } }"
          target="_blank"
          class="p-2 flex items-center gap-1 text-gray-300 hover:text-white hover:bg-purple-500 focus:outline-purple-500 focus:outline-none rounded transition-colors duration-300"
        >
          <IconCustom
            name="material-symbols:category-rounded"
            class="shrink-0 w-4 h-4"
          />
          <span class="text-xs">{{ theme }}</span>
        </NuxtLink>
        <div
          v-if="showTime"
          class="flex flex-wrap justify-center items-center gap-2 sm:gap-4"
        >
          <div
            v-if="props.data.created || props.data.git_time_created"
            class="flex items-center gap-1 text-gray-300 hover:text-gray-400 transition-colors duration-300"
          >
            <IconCustom
              name="mdi:pencil-circle"
              class="w-4 h-4"
            />
            <span class="text-xs">Created {{ (new Date(props.data.created || props.data.git_time_created)).toLocaleDateString() }}</span>
          </div>
          <div
            v-if="props.data.updated || props.data.git_time_updated"
            class="flex items-center gap-1 text-gray-300 hover:text-gray-400 transition-colors duration-300"
          >
            <IconCustom
              name="mdi:clock"
              class="w-4 h-4"
            />
            <span class="text-xs">Updated {{ (new Date(props.data.updated || props.data.git_time_updated)).toLocaleDateString() }}</span>
          </div>
        </div>
        <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <button
            v-if="props.data.series"
            class="p-2 flex items-center gap-1 text-gray-300 hover:text-white hover:bg-green-500 focus:outline-none rounded transition-colors duration-300"
            @click="showSeriesModal=true"
          >
            <IconCustom
              name="bi:collection"
              class="shrink-0 w-4 h-4"
            />
            <span class="text-xs">{{ props.data.series }}</span>
          </button>
          <button
            v-if="props.data.tags"
            class="p-2 hidden sm:flex items-center gap-1 focus:outline-blue-500 rounded transition-colors duration-300"
            :class="showTags ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'text-gray-300 hover:text-white hover:bg-blue-500 '"
            @click="showTags = !showTags"
          >
            <IconCustom
              name="bi:collection"
              class="shrink-0 w-4 h-4"
            />
            <span class="text-xs">Tags</span>
          </button>
        </div>
      </div>

      <ClientOnly>
        <OutdatedWarning
          v-if="showTime && showOutdatedWarningComponent && (props.data.updated || props.data.created)"
          :date="props.data.updated || props.data.created"
          :type="props.data.updated ? 'last updated' : 'created'"
        />
      </ClientOnly>

      <hr class="w-1/3 mx-auto">

      <div
        v-if="(prevArticleUrl || nextArticleUrl)"
        class="p-2 flex flex-wrap justify-center items-center gap-4"
      >
        <NuxtLink
          v-if="prevArticleUrl"
          :to="prevArticleUrl"
          class="p-2 flex items-center gap-1 text-xs text-gray-300 hover:text-white hover:bg-green-500 focus:outline-none rounded transition-colors duration-300"
        >
          <IconCustom
            name="ic:round-keyboard-arrow-left"
            class="w-4 h-4"
          />
          <span>Prev Article</span>
        </NuxtLink>
        <NuxtLink
          v-if="nextArticleUrl"
          :to="nextArticleUrl"
          class="p-2 flex items-center gap-1 text-xs text-gray-300 hover:text-white hover:bg-green-500 focus:outline-none rounded transition-colors duration-300"
        >
          <span>Next Article</span>
          <IconCustom
            name="ic:round-keyboard-arrow-right"
            class="w-4 h-4"
          />
        </NuxtLink>
      </div>

      <div
        v-if="props.data.tags && props.data.tags.length>0"
        v-show="showTags"
        class="p-2 tags-container flex sm:flex-wrap justify-start sm:justify-center items-center overflow-x-auto gap-2"
      >
        <NuxtLink
          v-for="tag in props.data.tags"
          :key="tag"
          :to="{ path: '/list', query: { tags: [tag] } }"
          target="_blank"
          class="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-blue-500 rounded focus:outline-blue-500 transition-colors duration-300"
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </div>

    <MarkdownPostContent :data="props.data" />

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

    <MarkdownPostCatalog
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      v-show="showCatalog"
      :catalogs="props.data.body.toc.links"
    />

    <Transition
      enter-from-class="translate-x-10"
      enter-active-class="transition-transform duration-500 ease"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-active-class="transition-transform duration-75 ease"
      leave-to-class="translate-x-10"
    >
      <button
        v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
        v-show="pageScrollTop > 100"
        class="p-2 hidden sm:flex justify-center items-center fixed bottom-16 right-4 z-40 border transition-colors duration-300 rounded-lg"
        :class="showCatalog ? 'text-purple-500 bg-purple-100 hover:bg-purple-50 border-purple-200' : 'text-gray-500 bg-white hover:bg-gray-100 border-gray-200'"
        @click="showCatalog = !showCatalog"
      >
        <IconCustom
          name="entypo:list"
          class="w-5 h-5"
        />
      </button>
    </Transition>

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

.tags-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
