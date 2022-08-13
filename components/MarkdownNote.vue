<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{ data: ParsedContent }>()

/**
 *
 * switch the flexiMode
 *
 */
// const flexiMode = useFlexiMode()

/**
 *
 * article tree
 * transform markdown data to tree structure
 *
 */
const articleTree = []
const headingArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

// the default node setting for currentH1
// just prepare for special situation when the article missing the H1 heading
const defaultH1 = {
  node: {
    type: 'element',
    tag: 'h1',
    props: { id: '_default_heading_1' },
    children: [{
      type: 'text',
      value: 'Article'
    }]
  },
  type: 'h1',
  children: [],
  content: []
}

let currentH1 = null
let currentH2 = null
let currentH3 = null
let currentH4 = null
let currentH5 = null
let currentH6 = null

let currentParent = null

props.data.body.children.forEach((elem) => {
  if (articleTree.length === 0 && elem.tag !== 'h1') {
    currentH1 = defaultH1
    currentParent = currentH1

    articleTree.push(currentH1)
  }

  if (headingArr.includes(elem.tag)) {
    switch (elem.tag) {
      case 'h1':
        currentH1 = {
          // node: Object.assign({}, elem, { props: { id: '' } }),
          node: elem,
          type: 'h1',
          children: [],
          content: []
        }
        articleTree.push(currentH1)
        currentParent = currentH1
        break
      case 'h2':
        currentH2 = {
          // node: Object.assign({}, elem, { props: { id: '' } }),
          node: elem,
          type: 'h2',
          children: [],
          content: []
        }
        currentH1.children.push(currentH2)
        currentParent = currentH2
        break
      case 'h3':
        currentH3 = {
          // node: Object.assign({}, elem, { props: { id: '' } }),
          node: elem,
          type: 'h3',
          children: [],
          content: []
        }

        if (!currentH2) {
          currentParent.children.push(currentH3)
        } else {
          currentH2.children.push(currentH3)
        }

        currentParent = currentH3
        break
      case 'h4':
        currentH4 = {
          // node: Object.assign({}, elem, { props: { id: '' } }),
          node: elem,
          type: 'h4',
          children: [],
          content: []
        }

        if (!currentH3) {
          currentParent.children.push(currentH3)
        } else {
          currentH3.children.push(currentH4)
        }

        currentParent = currentH4
        break
      case 'h5':
        currentH5 = {
          // node: Object.assign({}, elem, { props: { id: '' } }),
          node: elem,
          type: 'h5',
          children: [],
          content: []
        }

        if (!currentH4) {
          currentParent.children.push(currentH5)
        } else {
          currentH4.children.push(currentH5)
        }
        currentParent = currentH5
        break
      case 'h6':
        currentH6 = {
          // node: Object.assign({}, elem, { props: { id: '' } }),
          node: elem,
          type: 'h6',
          children: [],
          content: []
        }

        if (!currentH5) {
          currentParent.children.push(currentH6)
        } else {
          currentH5.children.push(currentH6)
        }
        currentParent = currentH6
    }
  } else {
    currentParent.content.push({
      node: elem,
      type: elem.tag
    })
  }
})

// console.log(articleTree)

// const currentLevel = ref('h2')
// provide('currentLevel', currentLevel)

const layout = ref<'waterfall' | 'compact' | 'card'>('waterfall')
const divideColumns = ref(0)
</script>

<template>
  <div
    class="markdown-note-container selection:text-white selection:bg-green-400"
    :class="layout === 'compact' ? 'gap-x-2': ''"
    :style="layout === 'compact' ? `columns: ${divideColumns}` : ''"
  >
    <ElementCard
      v-for="(elem, index) in articleTree"
      :key="index"
      :elem="elem"
      :order="index+1"
      :class="layout === 'compact' ? 'p-2 mb-2 border rounded break-inside-avoid' : ''"
    />
  </div>
</template>

<style lang="scss">

.markdown-note-container {
  h1 {
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
  }

  h2 {
    @apply py-4 md:py-6 text-2xl;
  }

  h3 {
    @apply text-xl;
  }

  h4 {
    @apply text-lg;
  }

  h5 {
    @apply text-base;
  }
}
</style>
