<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <div>
    <Head>
      <Title>Subscribe</Title>
    </Head>
    <NuxtLayout name="base">
      <!-- <ContentDoc class="subscribe-content-container container mx-auto lg:max-w-4xl px-6 md:px-12 py-12"> -->
      <!-- <template #not-found> -->
      <div class="subscribe-content-container container mx-auto lg:max-w-4xl px-6 md:px-12 py-12">
        <div class="subscribe-content-container">
          <h1>
            Subscribe
          </h1>
          <p class="text-center">
            <span class="text-sm text-gray-400">click the following icons to copy</span>
          </p>
          <div class="mx-auto p-8 flex flex-wrap justify-center items-center gap-16">
            <div class="flex flex-col items-center gap-2">
              <CopyContent
                :content="`${config.public.hostname}/rss.xml`"
                :icon-name="'fa-solid:rss-square'"
                :icon-color-class="'text-orange-400'"
                :icon-size-class="'w-36 h-36'"
              />
              <NuxtLink
                to="/rss.xml"
                target="_blank"
                class="text-blue-500 hover:text-blue-600 transition-colors duration-300"
              >
                RSS
              </NuxtLink>
            </div>

            <div class="flex flex-col items-center gap-2">
              <CopyContent
                :content="`${config.public.hostname}/sitemap.xml`"
                :icon-name="'majesticons:sitemap'"
                :icon-color-class="'text-purple-400'"
                :icon-size-class="'w-36 h-36'"
              />
              <NuxtLink
                to="/sitemap.xml"
                target="_blank"
                class="text-blue-500 hover:text-blue-600 transition-colors duration-300"
              >
                Sitemap
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <!-- </template>
      </ContentDoc> -->
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
.subscribe-content-container {
  h1 {
    @apply py-8 text-3xl sm:text-5xl text-purple-500 font-bold text-center
  }

  h2 {
    @apply py-8 text-2xl font-bold text-center
  }
}
</style>
