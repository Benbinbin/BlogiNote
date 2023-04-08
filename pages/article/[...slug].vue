<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()

/**
 *
 * fetch the article data based on the current route path
 *
 */
const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent(route.path).findOne())

/**
 *
 * catalog (it's the toc for markdown article)
 *
 */
const showCatalog = useState<Boolean>('showCatalog', () => {
  return appConfig.bloginote.articlePage.showCatalog
})

const showFooterNavMoreOptions = useState('showFooterNavMoreOptions')
const showFooterNavThemeOptions = useState('showFooterNavThemeOptions')
</script>

<template>
  <div>
    <Head>
      <Title>{{ data?.title || 'Article' }}</Title>
    </Head>
    <NuxtLayout
      name="base"
      :footer-catalog="data?.body?.toc && data.body.toc.links.length > 0"
    >
      <template
        v-if="!pending && data?._type === 'markdown' && data?.body?.toc && data.body.toc.links.length > 0"
        #header-nav-right
      >
        <button
          title="toggle catalog show or hide"
          class="w-10 h-10 flex justify-center items-center border rounded-md transition-colors duration-300"
          :class="showCatalog ? 'text-purple-500 bg-purple-100 hover:bg-purple-50 border-purple-200' : 'text-gray-500 bg-white hover:bg-gray-100 border-gray-200'"
          @click="showCatalog = !showCatalog"
        >
          <IconCustom
            name="entypo:list"
            class="w-5 h-5"
          />
        </button>
      </template>
      <MarkdownPost
        v-if="!pending && data?._type === 'markdown'"
        :data="data"
        class="container mx-auto px-6 md:px-12 py-12 lg:max-w-4xl"
      />

      <div
        v-else-if="!pending && data && (data._type === 'json' || data._type==='csv')"
        class="container mx-auto"
      >
        <div
          class="json-content-container max-h-[calc(100vh*0.8)] m-6 p-4 border rounded-lg overflow-auto"
        >
          <pre>{{ data }}</pre>
        </div>
      </div>

      <template
        v-if="!pending && data?._type === 'markdown' && data?.body?.toc && data.body.toc.links.length > 0"
        #footer-nav-right
      >
        <button
          v-show="!showFooterNavMoreOptions && !showFooterNavThemeOptions"
          class="grow px-2 py-3 flex justify-center items-center space-y-1 bg-gray-50"
          :class="showCatalog ? 'text-purple-500' : 'text-gray-500'"
          @click="showCatalog = !showCatalog"
        >
          <div class="flex flex-col justify-center items-center gap-1">
            <IconCustom
              name="entypo:list"
              class="w-6 h-6"
            />
            <p class="text-xs">
              Catalog
            </p>
          </div>
        </button>
      </template>
    </NuxtLayout>
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

</style>
