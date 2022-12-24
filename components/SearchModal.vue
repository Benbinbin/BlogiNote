<script setup lang="ts">
const pagefindPath = "/_pagefind/pagefind.js"

const runtimeConfig = useRuntimeConfig()
const baseURL = runtimeConfig.app.baseURL

let pagefind: any;
// if (process.env.NODE_ENV === 'production') {
  try {
      pagefind = await import(/* @vite-ignore */pagefindPath);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }
  }

  // console.log(pagefind);
// }


if (baseURL !== '/') {
  await pagefind.options({
    baseURL: baseURL
  })
}


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
const appConfig = useAppConfig()

let timer: (null | ReturnType<typeof setTimeout>) = null
const debouncedSearch = (key: string, delay:number = 300) => {
  if (timer) {
    clearTimeout(timer)
  }

  if (key) {
    timer = setTimeout(async () => {
      if (pagefind) {
        const metaResults = await pagefind.search(key);

        timer = null
        if (metaResults.results.length > 0) {
          const resultsData = await Promise.all(metaResults.results.map((r: any) => r.data()));

          let filterResults = []

          if (appConfig?.theme?.search?.exclude && appConfig.theme.search.exclude.length > 0) {
            filterResults = resultsData.filter(item => !appConfig.theme.search.exclude.includes(item.url))
          }

          searchResults.value = filterResults;
        } else {
          searchResults.value = []
        }
      }
    }, delay)
  } else {
    timer = null
    searchResults.value = []
    inputText.value = ''
  }
}

const inputText = ref<string>('')

const clearInputTextHandler = () => {
  inputText.value = ''
  searchResults.value = []
}

const inputHandler = (event: Event) => {
  const target = event.target as HTMLInputElement
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
      <div class="px-4 py-4 flex items-center gap-4 bg-white border-b rounded-t-lg">
        <button class="flex justify-center items-center" @click="focusInputHandler">
          <IconCustom name="tabler:search" class="shrink-0 w-6 h-6 text-gray-600"></IconCustom>
        </button>

        <input ref="searchInput" type="text" placeholder="Search Content" @input="inputHandler" v-model="inputText" class="grow focus:outline-none">

        <button class="shrink-0 hidden sm:block px-2 py-1 text-xs text-gray-400 hover:text-gray-600 font-mono font-bold hover:bg-gray-50 border border-gray-400 hover:border-gray-600 rounded transition-colors duration-300" title="hide the search modal" @click="showSearchModal=false">Esc</button>

        <button class="flex sm:hidden justify-center items-center text-gray-200 hover:text-gray-400 transition-colors" @click="clearInputTextHandler">
          <IconCustom name="ion:close-circle" class="w-6 h-6"></IconCustom>
        </button>
      </div>

      <div class="modal-content-container px-4 overflow-y-auto bg-white rounded-b-lg">
        <ul v-show="searchResults.length>0" class="search-result p-4 space-y-2">
          <li v-for="item in searchResults" :key="item.url"
            class="p-4 hover:text-white hover:bg-purple-500 rounded">
            <NuxtLink :to="item.url" @click="showSearchModal=false">
              <p class="font-bold">{{ item.meta.title }}</p>
              <p class="text-sm" v-html="item.excerpt"></p>
            </NuxtLink>
          </li>
        </ul>
        <div v-show="!(searchResults.length>0)" class="p-16 flex flex-col justify-center items-center space-y-8">
          <IconCustom name="fluent:mail-inbox-dismiss-28-filled" class="w-12 h-12 text-purple-400" />
          <p>Oops! There is no result.</p>
        </div>
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
  max-height: 90dvh;
}

.modal-content-container::-webkit-scrollbar {
  display: none;
}
</style>