<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{
  series: String;
}>()

defineEmits(['close'])

const { data: seriesList, pending } = await useLazyAsyncData(`${props.series}-series`, () => {
  return queryContent<ParsedContent>('article')
    .where({ series: props.series })
    .only(['title', 'description', '_path', 'contentType', 'seriesOrder'])
    .find()
})

const showDetail = ref(false)
</script>

<template>
  <Teleport to="body">
    <div class="w-screen h-screen fixed inset-0 z-50 flex justify-center items-center">
      <div
        class="w-screen h-screen absolute inset-0 -z-10 flex justify-center items-center bg-black/5 backdrop-blur-sm"
        @click="$emit('close')"
      />
      <div v-if="pending" class="flex flex-col justify-center items-center space-x-2 text-gray-500">
        <IconCustom name="eos-icons:loading" class="w-10 h-10" />
        <p class="text-xl">
          Loading
        </p>
      </div>
      <Transition
        enter-from-class="scale-0"
        enter-active-class="transition-transform duration-300 ease-in-out"
        enter-to-class="scale-1"
      >
        <div v-if="!pending" class="modal-container">
          <div v-if="seriesList && seriesList.length > 0" class="bg-white rounded-t-lg">
            <h2 class="p-4 text-xl font-bold text-center border-b ">
              {{ props.series }}
            </h2>
            <ol class="modal-content-container pl-8 md:pl-12 pr-4 py-4 list-decimal space-y-2 overflow-y-auto">
              <li v-for="article in seriesList" :key="article._path">
                <NuxtLink
                  :to="article._path"
                  class="block px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 space-y-2 rounded-md"
                  @click="$emit('close')"
                >
                  <h3 class="font-bold">
                    {{ article.title }}
                  </h3>
                  <p v-show="showDetail && article.description" class="text-sm opacity-60">
                    {{ article.description }}
                  </p>
                </NuxtLink>
              </li>
            </ol>
          </div>
          <div v-else class="p-4 flex flex-col justify-center items-center space-y-2 bg-white rounded-t-lg">
            <img src="~/assets/icons/empty.png" alt="empty" class="w-10 h-10">
            <p>Oops! There is no article.</p>
          </div>
          <div
            class="p-2 grid grid-cols-2 gap-2 justify-items-stretch sticky bottom-0 inset-x-0 text-xs bg-white rounded-b-lg"
          >
            <button
              class="px-4 py-2.5 flex justify-center items-center space-x-1 text-red-400 bg-red-50 hover:text-red-500 hover:bg-red-100 rounded"
              title="close window"
              @click="$emit('close')"
            >
              <IconCustom name="ic:round-close" class="w-4 h-4" />
              <span>Esc</span>
            </button>

            <button
              class="px-4 py-2.5 flex justify-center items-center space-x-1 rounded"
              :class="showDetail ? 'text-white bg-green-500 hover:bg-green-400' : 'text-green-400 bg-green-50 hover:text-green-500 hover:bg-green-100'"
              :title="showDetail ? 'Less Details' : 'More Details'"
              @click="showDetail = !showDetail"
            >
              <IconCustom v-show="showDetail" name="ic:round-unfold-less" class="w-4 h-4" />
              <IconCustom v-show="!showDetail" name="ic:round-unfold-more" class="w-4 h-4" />
              <p><span class="hidden sm:inline">{{ showDetail ? 'Less' : 'More' }}</span> Detail</p>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-container {
  max-width: 80vw;
}

.modal-content-container {
  max-height: 70vh;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
