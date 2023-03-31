<script setup lang="ts">
const props = defineProps<{
  data: any;
  prevArticleUrl: string;
  nextArticleUrl: string;
}>()

// defineEmits(['showSeriesModal'])
const showSeriesModal = useState('showSeriesModal')

// const themeOptions = useTheme()
const appConfig = useAppConfig()

/**
 *
 * show article created or last updated time
 *
 */
let showTime = true
// show time or not with app config
showTime = appConfig.bloginote.articlePage.showTime

if ('showTime' in props.data) {
  // show time or not decide by page metadata
  // eslint-disable-next-line vue/no-setup-props-destructure
  showTime = props.data.showTime
}

/**
 *
 * show expired warning
 *
 */
let showOutdatedWarningComponent = true
// show expire warning or not decide by app config
showOutdatedWarningComponent = appConfig.bloginote.articlePage.outdated.show

if ('showOutdatedWarning' in props.data) {
// show expire warning or not decide by page metadata
  // eslint-disable-next-line vue/no-setup-props-destructure
  showOutdatedWarningComponent = props.data.showOutdatedWarning
}

/**
 *
 * get article category
 *
 */
const category = ref('')
if (props.data._path) {
  const pathArr = props.data._path.split('/')

  if (pathArr.length > 3 && pathArr[1] === 'article') {
    category.value = pathArr[2]
  }
}

/**
 *
 * catalog (it's like the toc for markdown article)
 *
 */
const showCatalog = useState<Boolean>('showBlogCatalog', () => {
  return appConfig.bloginote.articlePage.showBlogCatalog
})

const article = ref<HTMLElement | null>(null) // get the article DOM

// set active heading
const activeHeadings = ref(new Set<string>())
provide('activeHeadings', activeHeadings)

let observer:IntersectionObserver
onMounted(() => {
  // get headings list
  if (article.value) {
    const headingDomList = article.value.querySelectorAll('h2, h3, h4, h5, h6')
    // set intersection observer
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id') as string
        if (entry.intersectionRatio > 0) {
          activeHeadings.value.add(id)
        } else {
          activeHeadings.value.delete(id)
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

/**
 *
 * show or hide tags
 */
const showTags = ref(true)
</script>

<template>
  <div ref="article">
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
          v-if="category"
          :to="{ path: '/list', query: { category: category } }"
          target="_blank"
          class="p-2 flex items-center gap-1 text-gray-300 hover:text-white hover:bg-purple-500 focus:outline-purple-500 focus:outline-none rounded transition-colors duration-300"
        >
          <IconCustom
            name="material-symbols:category-rounded"
            class="shrink-0 w-4 h-4"
          />
          <span class="text-xs">{{ category }}</span>
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
        v-if="(props.prevArticleUrl || props.nextArticleUrl)"
        class="p-2 flex flex-wrap justify-center items-center gap-4"
      >
        <NuxtLink
          v-if="props.prevArticleUrl"
          :to="props.prevArticleUrl"
          class="p-2 flex items-center gap-1 text-xs text-gray-300 hover:text-white hover:bg-green-500 focus:outline-none rounded transition-colors duration-300"
        >
          <IconCustom
            name="ic:round-keyboard-arrow-left"
            class="w-4 h-4"
          />
          <span>Prev Article</span>
        </NuxtLink>
        <NuxtLink
          v-if="props.nextArticleUrl"
          :to="props.nextArticleUrl"
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

    <ContentRenderer
      :value="props.data"
      class="article-container markdown-post-content-container selection:text-white selection:bg-purple-400"
    >
      <template #empty>
        <div class="mx-auto font-bold">
          <p>Article is empty</p>
        </div>
      </template>
    </ContentRenderer>

    <CatalogSidebarForBlog
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      :catalogs="props.data.body.toc.links"
    />

    <button
      v-if="props.data?.body?.toc && props.data.body.toc.links.length > 0"
      class="p-2 hidden sm:flex justify-center items-center fixed bottom-16 right-4 z-40 border transition-colors duration-300 rounded-lg"
      :class="showCatalog ? 'text-purple-500 bg-purple-100 hover:bg-purple-50 border-purple-200' : 'text-gray-500 bg-white hover:bg-gray-100 border-gray-200'"
      @click="showCatalog = !showCatalog"
    >
      <IconCustom
        name="entypo:list"
        class="w-5 h-5"
      />
    </button>
  </div>
</template>

<style lang="scss">

.tags-container {
  &::-webkit-scrollbar {
    display: none;
  }
}

.markdown-post-content-container {
  // hide the h1 element if it's the first dom in the .markdown-post-content-container
  & > h1:first-child {
    @apply hidden
  }

  h2,
  h3,
  h4,
  h5,
  h6
  {
    @apply font-bold inline-block;
    a {
      @apply text-inherit hover:text-inherit no-underline hover:no-underline visited:no-underline hover:visited:no-underline;
    }
  }

  h1 {
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
  }

  h2 {
    @apply py-4 text-2xl md:text-3xl before:content-['H2'] before:text-sm md:before:text-base sm:-translate-x-5;
  }

  h3 {
    @apply py-4 text-xl md:text-2xl before:content-['H3'] before:text-sm md:before:text-base sm:-translate-x-5;
  }

  h4 {
    @apply py-2 text-lg md:text-xl before:content-['H4'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h5 {
    @apply py-2 text-lg md:text-xl before:content-['H5'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h6 {
    @apply py-2 text-lg md:text-xl before:content-['H6'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply before:font-light before:p-1 before:mr-0.5 before:rounded before:transition-opacity before:duration-300 before:cursor-pointer before:text-purple-300 before:bg-none before:opacity-50 hover:before:opacity-100;
  }

  // refine the design for detail (toggle heading)
  // refer to https://web.dev/learn/html/details/
  details summary:has(:is(h2, h3, h4, h5, h6)) {
    &::marker {
      content: none;
    }
  }

  details:not([open]) summary :is(h2, h3, h4, h5, h6) {
    @apply before:text-white before:bg-purple-500 before:opacity-100 hover:before:opacity-80
  }

  p {
    @apply text-base;
  }

  blockquote {
    @apply px-2 border-l-4 border-gray-300;
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

  p,
  blockquote,
  dl {
    @apply my-4;
  }

  table {
    @apply my-0.5;
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

  hr {
    @apply text-gray-400;
  }

  a {
    @apply text-blue-500 underline decoration-2 decoration-blue-400 hover:decoration-blue-500 visited:decoration-blue-100 hover:visited:decoration-blue-200 transition-colors duration-300;
  }

  code {
    @apply px-1 py-0.5 mx-0.5 text-sm bg-gray-100 border rounded break-words;
  }

  .math {
    @apply px-2 py-1 overflow-x-auto border-2 border-transparent rounded-md select-none transition-colors duration-300;
  }

}
</style>
