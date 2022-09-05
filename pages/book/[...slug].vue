<script setup lang="ts">
const route = useRoute()
const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent(route.path).findOne())

/**
 *
 * links
 *
 */
const linksMapping = [
  {
    name: 'mdi:douban',
    regex: /douban/
  },
  {
    name: 'mdi:goodreads',
    regex: /goodreads/
  }
]

const getLinkIcon = (link) => {
  let iconName = 'mdi:link'

  for (let index = 0; index < linksMapping.length; index++) {
    const element = linksMapping[index]

    if (element.regex.test(link)) {
      iconName = element.name
      break
    }
  }
  return iconName
}

/**
 *
 * highlights
 *
 */
let currentChapter = ''
let currentChapterHighlights = []
const highlightsByChapter = [{ chapter: '_unknown_', highlights: [] }]

if (data.value && data.value?.highlights && data.value.highlights.length > 0) {
  data.value.highlights.forEach((highlight) => {
    if (highlight.chapter) {
      if (highlight.chapter !== currentChapter) {
        currentChapter = highlight.chapter
        currentChapterHighlights = [highlight]
        highlightsByChapter.push({
          chapter: currentChapter,
          highlights: currentChapterHighlights
        })
      } else {
        currentChapterHighlights.push(highlight)
      }
    } else {
      highlightsByChapter[0].highlights.push(highlight)
    }
  })
}

const collapseChapters = ref(new Set())

const toggleChapter = (chapter) => {
  if (collapseChapters.value.has(chapter)) {
    collapseChapters.value.delete(chapter)
  } else {
    collapseChapters.value.add(chapter)
  }
}

</script>

<template>
  <div>
    <Head>
      <Title>{{ data?.title || 'Book' }}</Title>
    </Head>
    <NuxtLayout name="base">
      <div v-if="!pending && data && data._type === 'json'" class=" mx-auto px-6 py-8 sm:py-12">
        <!-- metadata -->
        <div class="px-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-12">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <!-- cover -->
            <img
              v-if="data?.metadata?.covers?.length"
              :src="data.metadata.covers[0]"
              alt="book cover"
              class="min-h-[8rem] max-h-[20rem] object-contain"
            >
            <div class="self-stretch flex flex-col justify-between gap-4 sm:gap-8">
              <div class="space-y-4">
                <!-- title -->
                <h1
                  class="text-center sm:text-left font-bold text-xl text-gray-600 underline decoration-[12px] decoration-yellow-200 underline-offset-[-2px]"
                >
                  {{
                    data?.metadata?.title || 'book' }}
                </h1>
                <!-- stars -->
                <div
                  v-if="data?.metadata?.stars"
                  class="flex flex-wrap justify-center sm:justify-start items-center gap-1"
                >
                  <IconCustom
                    v-for="n in data.metadata.stars"
                    :key="n"
                    name="ph:star-fill"
                    class="w-4 h-4 text-yellow-400"
                  />
                </div>

                <!-- links -->
                <div class="flex flex-wrap justify-center sm:justify-start items-center gap-1">
                  <a
                    v-for="link in data.metadata.links"
                    :key="link"
                    :href="link"
                    target="_blank"
                    class="px-2 py-1 text-white bg-blue-500 hover:bg-blue-400 rounded transition-colors duration-300"
                  >
                    <IconCustom :name="getLinkIcon(link)" class="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div class="max-w-prose flex flex-col gap-2 text-xs text-gray-600">
                <!-- author -->
                <div v-if="data?.metadata?.authors && data.metadata.authors.length>0" class="flex items-start gap-1">
                  <span class="p-1 font-bold">
                    Author
                  </span>
                  <div class=" flex flex-wrap gap-1">
                    <span
                      v-for="author in data.metadata.authors"
                      :key="author"
                      class="p-1 bg-gray-100 border rounded"
                    >{{
                      author }}</span>
                  </div>
                </div>

                <!-- translator -->
                <div
                  v-if="data?.metadata?.translators && data.metadata.translators.length>0"
                  class="max-w-prose flex items-start gap-1"
                >
                  <span class="p-1 font-bold">
                    Translator
                  </span>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="translator in data.metadata.translators"
                      :key="translator"
                      class="p-1 bg-gray-100 border rounded"
                    >{{ translator }}</span>
                  </div>
                </div>

                <!-- ISBN -->
                <p v-if="data?.metadata?.isbn" class="flex items-center gap-1">
                  <span class="p-1 font-bold">ISBN</span>
                  <span class="p-1 bg-gray-100 border rounded">{{ data.metadata.isbn }}</span>
                </p>

                <!-- Press -->
                <p v-if="data?.metadata?.press" class="flex items-center gap-1">
                  <span class="p-1 font-bold">Press</span>
                  <span class="p-1 bg-gray-100 border rounded">{{ data.metadata.press }}</span>
                </p>

                <!-- Publish Date -->
                <p v-if="data?.metadata?.date" class="flex items-center gap-1">
                  <span class="p-1 font-bold">Publish</span>
                  <span class="p-1 bg-gray-100 border rounded">{{ data.metadata.date }}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-if="data?.metadata?.description || data?.metadata?.review" class="flex flex-wrap">
            <p v-if="data?.metadata?.description" class="max-w-prose p-4 text-purple-500 bg-purple-100 rounded-md">
              {{ data.metadata.description }}
            </p>
          </div>
        </div>

        <!-- review -->
        <div class="my-12 p-2">
          <div class="w-full sm:w-1/2 mx-auto p-4 flex justify-center items-center">
            <div class="grow h-0.5 bg-gray-200 rounded" />
            <IconCustom name="bi:pencil-square" class="shrink-0 m-4 w-4 h-4 text-gray-400" />
            <div class="grow h-0.5 bg-gray-200 rounded" />
          </div>
          <p v-if="data?.metadata?.review" class="max-w-prose mx-auto">
            {{ data.metadata.review }}
          </p>
        </div>

        <!-- highlights -->
        <div class="my-12 p-2">
          <div class="w-full sm:w-1/2 mx-auto  p-4 flex justify-center items-center">
            <div class="grow h-0.5 bg-gray-200 rounded" />
            <IconCustom name="bi:blockquote-left" class="shrink-0 m-4 w-4 h-4 text-gray-400" />
            <div class="grow h-0.5 bg-gray-200 rounded" />
          </div>

          <div class="mx-auto ">
            <template v-for="chapterItem in highlightsByChapter">
              <div v-if="chapterItem.highlights.length>0" :key="chapterItem.chapter">
                <button
                  v-if="chapterItem.chapter !== '_unknown_'"
                  class="my-12 p-2 text-xl font-bold hover:opacity-80 underline decoration-[12px] decoration-yellow-200 underline-offset-[-2px] rounded transition-opacity duration-300"
                  :class="collapseChapters.has(chapterItem.chapter)? 'text-yellow-600 bg-yellow-200 ' : 'text-gray-600 bg-transparent '"
                  @click="toggleChapter(chapterItem.chapter)"
                >
                  {{ chapterItem.chapter }}
                </button>

                <div
                  v-show="!collapseChapters.has(chapterItem.chapter)"
                  class="columns-1 sm:columns-2 xl:columns-3 2xl:columns-4 gap-x-6"
                >
                  <div
                    v-for="(highlight, index) in chapterItem.highlights"
                    :key="index"
                    class="mb-6 px-4 py-6 bg-gray-100 border border-gray-200 rounded-lg break-inside-avoid shadow-md shadow-transparent hover:shadow-gray-200 transition-shadow duration-300"
                  >
                    <div class="pb-6 text-gray-400 hover:text-gray-600 flex gap-2 transition-colors duration-300">
                      <IconCustom name="bi:bookmark" class="w-4 h-4 text-gray-400" />
                      <p v-if="highlight.location" class="text-xs">
                        page: {{ highlight.location }}
                      </p>
                    </div>
                    <p class="p-4">
                      {{ highlight.content }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped>

</style>
