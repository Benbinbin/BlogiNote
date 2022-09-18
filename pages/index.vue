<script setup lang="ts">
// import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
// import fileTypeMap from '@/utils/fileType.json'

const flexiMode = useFlexiMode()

/**
 *
 * switch the flexiMode
 *
 */
// const changeFlexiMode = () => {
//   if (flexiMode.value === 'blog') {
//     flexiMode.value = 'note'
//   } else {
//     flexiMode.value = 'blog'
//   }
// }

/**
 *
 * get nav data
 *
 */
const { data: navTree } = await useAsyncData('rootFolder', () => fetchContentNavigation())

// const themeOptions = useTheme()
const appConfig = useAppConfig()

/**
 *
 * blog mode
 *
 */
// Blog Posts
let articleFolder
const articleFolderFiles = []

// render blog posts or not
let showBlogPosts = true
// if ('homePage' in themeOptions.value && 'showBlogPosts' in themeOptions.value.homePage) {
showBlogPosts = appConfig.theme.homePage.showBlogPosts
// }

const queryPostsWhere = { _type: 'markdown' }
const queryPostsLimit = appConfig.theme.homePage.postItemLimit || 5
const queryPostsOnly = ['title', 'description', '_type', '_path', 'cover', 'series', 'seriesOrder', 'tags']

if (showBlogPosts && Array.isArray(navTree.value)) {
  articleFolder = navTree.value.find((item) => {
    return item._path === '/article'
  })

  if (articleFolder?.children && articleFolder.children.length > 0) {
    articleFolder.children.forEach((item) => {
      if (item._type === 'markdown' && articleFolderFiles.length < queryPostsLimit) {
        articleFolderFiles.push(item)
      }
    })
  }
}

const getCategory = (path = '') => {
  let category = ''
  const pathArr = path.split('/')

  if (pathArr.length === 3 && pathArr[1] === 'article') {
    category = pathArr[2]
  }

  return category
}

// show posts
// const showRecentPosts = ref(true)

// hide post section
const hidePostCategorySections = ref(new Set())
const togglePostCategorySectionsHandler = (category) => {
  if (hidePostCategorySections.value.has(category)) {
    hidePostCategorySections.value.delete(category)
  } else {
    hidePostCategorySections.value.add(category)
  }
}

/**
 *
 * note mode
 * data in a tree structure
 *
 */
const currentTree = ref([])

currentTree.value = navTree.value

let folderNavPath = []

const folderNavArr = ref([
  {
    title: 'Root',
    path: []
  }
])

const setTreeHandler = (path, type = 'drill-down') => {
  if (type === 'drill-down') {
    folderNavPath = folderNavPath.concat(path)
  } else if (type === 'reset') {
    folderNavPath = path
  }

  let treeTemp = navTree.value

  const folderNavArrTemp = [
    {
      title: 'Root',
      path: []
    }
  ]
  let folderNavPathTemp = []

  if (folderNavPath.length > 0) {
    folderNavPath.forEach((index) => {
      folderNavPathTemp = folderNavPathTemp.concat(index)
      folderNavArrTemp.push({
        title: treeTemp[index].title,
        path: folderNavPathTemp
      })
      treeTemp = treeTemp[index].children
    })
  }

  currentTree.value = treeTemp
  folderNavArr.value = folderNavArrTemp
}

const fileTypeMap = useFileTypeMap()
const getFileTypeIcon = (type) => {
  const fileType = fileTypeMap.value[type]

  if (!fileType) {
    return fileTypeMap.value.default.iconName
  } else {
    return fileType.iconName
  }
}
</script>

<template>
  <div>
    <Head>
      <Title>Home</Title>
    </Head>
    <NuxtLayout name="base" :footer-flexi-mode="true" :header-flexi-mode="true">
      <div v-show="flexiMode === 'blog'" class="container px-8 mx-auto">
        <div class="py-16">
          <ContentDoc>
            <template #empty>
              <IntroCard :avatar="'/default-avatar.png'" />
            </template>
            <template #not-found>
              <h1 class="py-4 text-3xl sm:text-5xl font-bold text-center text-purple-500">
                BlogiNote
              </h1>
            </template>
          </ContentDoc>
        </div>
        <div v-if="articleFolder" class="py-8">
          <!-- <h2 class="flex justify-center items-center font-bold text-xl sm:text-3xl text-gray-600">
            <button
              class="px-4 py-2 rounded-md transition-colors duration-300"
              :class="showRecentPosts ? 'text-purple-500 hover:bg-purple-100' : 'text-white bg-purple-500 hover:bg-purple-400'"
              @click="showRecentPosts = !showRecentPosts"
            >
              Blog Post
            </button>
          </h2>
          <hr class="w-1/5 my-6 mx-auto bg-purple-200"> -->

          <div class="space-y-8">
            <section class="w-full sm:w-4/5 mx-auto space-y-4">
              <!-- <NuxtLink
                to="/list"
                class="w-fit mx-auto px-2 py-1 block text-xs text-white bg-purple-500 hover:bg-purple-400 rounded"
              >
                show all
              </NuxtLink> -->
              <div
                class="scroll-container sm:px-4 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:divide-y sm:divide-gray-200"
              >
                <ContentQuery
                  v-for="item in articleFolderFiles"
                  :key="item._path"
                  :path="item._path"
                  :only="queryPostsOnly"
                >
                  <template #default="{ data }">
                    <PostListItem
                      v-for="article in data"
                      :key="article._path"
                      :article="article"
                      class="hidden sm:block"
                    />
                    <PostCardItem
                      v-for="article in data"
                      :key="article._path"
                      :article="article"
                      :list-len="data.length"
                      class="flex flex-col sm:hidden"
                    />
                  </template>
                </ContentQuery>
              </div>
            </section>

            <template v-for="category in articleFolder.children">
              <section v-if="'children' in category" :key="category._path" class="w-full sm:w-4/5 mx-auto space-y-4">
                <div class="flex justify-between items-start">
                  <h2 class="border-l-8 border-purple-500 rounded-l-sm">
                    <button
                      class="p-1 font-bold text-lg text-purple-500 hover:bg-purple-100 border rounded-r-sm transition-colors duration-300 "
                      :class="hidePostCategorySections.has(category._path) ? 'border-purple-500' : 'border-transparent'"
                      @click="togglePostCategorySectionsHandler(category._path)"
                    >
                      {{ category.title }}
                    </button>
                  </h2>
                  <NuxtLink
                    :to="{ path: '/list', query: { category: getCategory(category._path) } }"
                    class="p-2 text-xs font-bold transition-colors duration-300 rounded-lg text-purple-500 bg-purple-100 hover:bg-purple-50"
                  >
                    More
                  </NuxtLink>
                </div>
                <div
                  v-show="!hidePostCategorySections.has(category._path)"
                  class="scroll-container sm:px-4 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:divide-y
                sm:divide-gray-200"
                >
                  <ContentQuery
                    :path="category._path"
                    :where="queryPostsWhere"
                    :limit="queryPostsLimit"
                    :only="queryPostsOnly"
                  >
                    <template #default="{ data }">
                      <PostListItem
                        v-for="article in data"
                        :key="article._path"
                        :article="article"
                        class="hidden sm:block"
                      />
                      <PostCardItem
                        v-for="article in data"
                        :key="article._path"
                        :article="article"
                        :list-len="data.length"
                        class="flex flex-col sm:hidden"
                      />
                    </template>

                    <template #not-found>
                      <p>No articles found.</p>
                    </template>
                  </ContentQuery>
                </div>
              </section>
            </template>
          </div>
        </div>
      </div>
      <div v-if="navTree && navTree.length > 0" v-show="flexiMode === 'note'" class="container px-8 mx-auto">
        <div class="flex py-8 justify-between">
          <div class="folder-nav-container flex sm:flex-wrap items-center gap-1 overflow-x-auto">
            <IconCustom name="ph:folder-open-fill" class="shrink-0 w-6 h-6 text-yellow-400" />
            <div
              v-for="(folder, index) in folderNavArr"
              :key="folderNavArr.length>1 ? folder.path.join() : 'root'"
              class="shrink-0 flex items-center gap-1"
            >
              <button
                class="p-2 hover:text-green-500 active:text-white hover:bg-green-100 active:bg-green-500 rounded-md transition-colors duration-300"
                @click="setTreeHandler(folder.path, 'reset')"
              >
                {{ folder.title }}
              </button>
              <span v-if="index+1 < folderNavArr.length" class="text-gray-400">></span>
            </div>
          </div>
        </div>
        <hr class="p-4">
        <div
          class="folders-container w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-col-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 grid-flow-row-dense"
        >
          <template v-for="(item, index) in currentTree">
            <NuxtLink
              v-if="item._type"
              :key="item._path"
              :to="item._path"
              target="_blank"
              class="self-start px-4 py-2 flex items-center gap-1 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded-lg"
            >
              <IconCustom :name="getFileTypeIcon(item._type)" class="w-6 h-6" />
              {{ item.title }}
            </NuxtLink>
            <FolderTree
              v-if="item.children"
              :key="item._path"
              :root-name="item.title"
              :root-tree="item.children"
              :root-index="index"
              @set-tree="setTreeHandler"
            />
          </template>
        </div>
      </div>
    </NuxtLayout>
    <!-- <button
      :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
      class="w-9 h-9 hidden sm:flex justify-center items-center gap-1 fixed bottom-16 right-4 z-20 border transition-colors duration-300 rounded-lg"
      :class="flexiMode === 'blog' ? 'flex-col bg-purple-100 hover:bg-purple-50 border-purple-200' : 'flex-row bg-green-100 hover:bg-green-50 border-green-200'"
      @click="changeFlexiMode"
    >
      <div class="shrink-0 w-1.5 h-1.5 rounded-full" :class="flexiMode === 'blog' ? 'bg-purple-500' : 'bg-green-500'" />
      <div class="shrink-0 space-y-1">
        <div class="w-1 h-1 rounded-full " :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
        <div class="w-1 h-1 rounded-full " :class="flexiMode === 'blog' ? 'bg-purple-400' : 'bg-green-400'" />
      </div>
    </button> -->
  </div>
</template>

<style lang="scss" scoped>

.folders-container {
  grid-auto-rows: 40px
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.folder-nav-container::-webkit-scrollbar {
  display: none;
}
</style>
