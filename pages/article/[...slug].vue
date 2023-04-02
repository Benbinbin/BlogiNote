<script setup lang="ts">
const route = useRoute()

/**
 *
 * fetch the article data based on the current route path
 *
 */
const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent(route.path).findOne())

console.log(data);


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
