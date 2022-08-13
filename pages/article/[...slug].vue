<script setup lang="ts">

const route = useRoute()

/**
 *
 * switch the flexiMode
 *
 */
const flexiMode = useFlexiMode()

/**
 *
 * get data
 *
 */

const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent(route.path).findOne())

console.log(data.value)

</script>

<template>
  <div>
    <Head>
      <Title>{{ data?.title || 'Article' }}</Title>
    </Head>
    <NuxtLayout name="base">
      <MarkdownBlog
        v-if="!pending && data && data._type === 'markdown'"
        v-show="!data.articleType || data.articleType === 'blog' || (data.articleType === 'note' && flexiMode === 'blog') "
        :data="data"
        class="container mx-auto px-6 md:px-12 py-12 lg:max-w-4xl"
      />
      <MarkdownNote
        v-if="!pending && data && data._type === 'markdown' && data.articleType === 'note'"
        v-show="flexiMode === 'note'"
        :data="data"
        class="p-6"
      />
      <div v-else-if="!pending && data && data._type === 'json'">
        <pre>{{ data }}</pre>
      </div>
    </NuxtLayout>

    <Teleport to="body">
      <ImageLightbox />
    </Teleport>
  </div>
</template>

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
    @apply pl-4 my-2;

    li {
      @apply my-1;
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
    @apply px-1 py-0.5 mx-0.5 text-sm bg-gray-100 border rounded;
  }

  .math {
    @apply px-2 py-1 border-2 border-transparent rounded-md select-none transition-colors duration-300;
  }

  .critic-addition {
    @apply bg-green-200 decoration-green-400 ;
  }

  del, .critic-deletion {
    @apply bg-red-200 decoration-red-400;
  }

  mark, .critic-highlight {
    @apply bg-yellow-200;
  }

  .critic-comment {
    @apply bg-purple-200;
  }
}
</style>
