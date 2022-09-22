<script setup lang="ts">

</script>

<template>
  <div>
    <Head>
      <Title>Subscribe</Title>
    </Head>
    <NuxtLayout name="base">
      <!-- <div class="grow flex justify-center items-center">
        <p class="text-xl font-bold text-purple-400">
          Still working on this page
        </p>
      </div> -->
      <ContentDoc class="subscribe-content-container container mx-auto lg:max-w-4xl px-6 md:px-12 py-12">
        <template #not-found>
          <div class="subscribe-content-container">
            <h1>
              Subscribe
            </h1>
            <p class="max-w-prose mx-auto p-4">
              This website does not provide any subscription option.
            </p>
            <p class="max-w-prose mx-auto p-4">
              Please check out <a href="https:/blogiNote.benbinbin.com/tutorial/subscribe" target="_blank" class="text-blue-500 hover:text-blue-600 underline font-bold transition-colors duration-300">this tutorial</a> to set up the RSS Feed and sitemap for the website.
            </p>
          </div>
        </template>
      </ContentDoc>
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

  p {
    @apply py-4 text-lg text-gray-500
  }
}
</style>
