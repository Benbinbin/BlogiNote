<script setup lang="ts">
const props = defineProps<{
  data: any;
}>()

const articleContainerDOM = ref<null | HTMLElement>(null)

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

if (process.client) {
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
}
// #endregion
</script>

<template>
  <!-- the "data-pagefind-body" is the index mark for pagefind -->
  <div
    ref="articleContainerDOM"
    data-pagefind-body
  >
    <ContentRenderer
      :value="props.data"
      class="markdown-post-content-container selection:text-white selection:bg-purple-400"
    >
      <template #empty>
        <div class="mx-auto font-bold">
          <p>Article is empty</p>
        </div>
      </template>
    </ContentRenderer>
  </div>
</template>

<style lang="scss">
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
    @apply ml-4;

    li {
      @apply leading-loose;
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
    @apply mx-auto my-0.5 bg-gray-50 border border-gray-300 table-auto;

    thead {
      @apply bg-gray-200;
    }

    tbody tr:nth-child(2n) {
      @apply bg-gray-100;
    }

    th {
      @apply min-w-[6rem] sm:min-w-fit;
    }

    th,
    td {
      @apply px-4 py-2 text-center border border-gray-300;
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