<script setup lang="ts">
const pagefindPath = "/_pagefind/pagefind.js"
let pagefind: any;
// if (process.env.NODE_ENV === 'production') {
  pagefind = await import(/* @vite-ignore */pagefindPath);
  // console.log(pagefind);
// }

// search modal
const showSearchModal = useShowSearchModal()

const searchInput = ref<HTMLElement | null>(null) // get the input DOM

// when the search modal show up, auto focus the input box
onMounted(() => {
  watch(showSearchModal, () => {
    if (searchInput.value && showSearchModal.value) {
      nextTick(() => {
        searchInput.value?.focus()
      })
    }
  })
})

const focusInputHandler = () => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

const searchResults = ref<any[]>([])
let timer: any = null
const debouncedSearch = (key: string, delay = 300) => {
  if (timer) {
    clearTimeout(timer)
  }

  if (key) {
    timer = setTimeout(async () => {
      if (pagefind) {
        const search = await pagefind.search(key);
        console.log(search);
        timer = null
        if (search.results.length > 0) {
          const fiveResults = await Promise.all(search.results.slice(0, 5).map((r: any) => r.data()));
          console.log(fiveResults);
          searchResults.value = fiveResults;
        }
      }
    }, delay)
  } else {
    timer = null
    searchResults.value = []
    inputText.value = ''
  }
}

const inputText = ref('')
const inputHandler = (event: Event) => {
  const target = event.target as HTMLInputElement
  // console.log(target.value);
  if (pagefind) {
    pagefind.preload(target.value);
    debouncedSearch(target.value)
  }
}
</script>

<template>
  <div class="expand-window p-4 fixed inset-0 z-[80] flex justify-center items-start">
    <div class="expand-window absolute inset-0 -z-10 flex justify-center items-center bg-black/5 backdrop-blur"
      @click="showSearchModal =false" />
    <div class="modal-container flex flex-col w-full max-w-prose">
      <div class="px-2 py-2 flex items-center gap-4 bg-white border-b rounded-t-lg">
        <button class="flex justify-center items-center" @click="focusInputHandler">
          <IconCustom name="tabler:search" class="shrink-0 w-6 h-6 text-gray-600"></IconCustom>
        </button>

        <input ref="searchInput" type="text" @input="inputHandler" v-model="inputText" class="grow focus:outline-none">

        <button class="shrink-0 hidden sm:block px-2 py-1 text-xs text-gray-400 hover:text-gray-600 font-mono font-bold hover:bg-gray-50 border border-gray-400 hover:border-gray-600 rounded transition-colors duration-300" title="hide the search modal" @click="showSearchModal=false">Esc</button>
      </div>

      <div class="modal-content-container px-2 overflow-y-auto bg-white rounded-b-lg">
        <p>Result</p>
        <ul class="search-result p-4 space-y-2">
          <li v-for="item in searchResults" :key="item.url"
            class="p-4 hover:text-white hover:bg-purple-500 rounded transition-colors duration-300">
            <NuxtLink :to="item.url">
              <p class="font-bold">{{ item.meta.title }}</p>
              <p class="text-sm" v-html="item.excerpt"></p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
.search-result {
  mark {
    @apply bg-yellow-300;
  }
}

.modal-container {
  max-height: 80dvh;
}

.modal-content-container::-webkit-scrollbar {
  display: none;
}
</style>