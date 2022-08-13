<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{data: ParsedContent}>()

/**
 *
 * catalog
 * toc for markdown article
 *
 */
const showCatalog = useShowCatalog()

// set active heading
const article = ref(null)
const activeHeadings = useActiveHeadings()
let observer
onMounted(() => {
  // get headings list
  if (article.value) {
    const headingDomList = article.value.querySelectorAll('h2, h3, h4, h5, h6')
    // set intersection observer
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')
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
  activeHeadings.value.clear()
})

/**
 *
 * math formula
 * support double click to copy the formula
 *
 */
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

  if (article.value && clipboard.value) {
    const mathInlineList = article.value.querySelectorAll('.math-inline')
    const mathBlockList = article.value.querySelectorAll('.math-display')

    if (mathInlineList.length > 0) { addListener(mathInlineList, '$', '$') }
    if (mathBlockList.length > 0) { addListener(mathBlockList, '$$\n', '\n$$') }
  }
})
</script>

<template>
  <div ref="article">
    <ContentRenderer :value="props.data" class="article-container markdown-blog-container selection:text-white selection:bg-purple-400">
      <template #empty>
        <div>
          <h1>Article is empty</h1>
        </div>
      </template>
    </ContentRenderer>

    <CatalogSidebar v-if="data?.body?.toc && data.body.toc.links.length > 0" :catalogs="data.body.toc.links" />

    <button
      v-if="data?.body?.toc"
      class="p-2 hidden sm:flex justify-center items-center fixed bottom-16 right-4 z-40 border transition-colors duration-300 rounded-lg"
      :class="showCatalog ? 'text-purple-500 bg-purple-100 hover:bg-purple-50 border-purple-200' : 'text-gray-500 bg-white hover:bg-gray-100 border-gray-200'"
      @click="showCatalog = !showCatalog"
    >
      <IconCustom name="entypo:list" class="w-5 h-5" />
    </button>
  </div>
</template>

<style lang="scss">

.markdown-blog-container {
  h1 {
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply before:font-light before:mr-1 before:text-purple-300 sm:before:opacity-50 hover:sm:before:opacity-100 before:transition-opacity before:duration-300;
  }

  h2 {
    @apply py-4 text-2xl md:text-3xl before:content-['H2'] before:text-sm md:before:text-lg sm:-translate-x-6;
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
}
</style>
