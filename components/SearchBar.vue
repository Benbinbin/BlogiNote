<script setup lang="ts">
const pagefindPath = "/_pagefind/pagefind.js"
let pagefind: any;
if (process.env.NODE_ENV === 'development') {
  pagefind = await import(/* @vite-ignore */pagefindPath);
  // console.log(pagefind);
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
  <input type="text" @input="inputHandler" v-model="inputText" class="border rounded">
  <div>
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
</template>

<style lang="scss">
.search-result {
  mark {
    @apply bg-yellow-300;
  }
}
</style>