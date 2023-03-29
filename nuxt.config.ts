import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    // baseURL: '/'
  },
  typescript: {
    shim: false
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml', '/sitemap.xml']
    }
  },
  runtimeConfig: {
    rss: {
      title: 'BlogiNote',
      description: 'BlogiNote is a website for showing your blogs and notes with flexible layouts and multiple optimizations.',
      image: 'https://bloginote.benbinbin.com/default-avatar.png',
      favicon: 'https://bloginote.benbinbin.com/default-favicon.ico',
      copyright: `All rights reserved ${(new Date()).getFullYear()}, Benbinbin`
    },
    public: {
      hostname: 'https://bloginote.benbinbin.com'
    }
  },
  modules: [
    [resolve('./modules/copyFilesToPublic'), { cleanFolders: ['public/article'] }],
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ],
  // https://content.nuxtjs.org
  content: {
    navigation: {
      fields: ['_id', '_type', 'series', 'tags']
    },
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: 'one-dark-pro',
      // check out https://content.nuxtjs.org/api/configuration#highlightpreload for the default preload languages
      // ['diff', 'json', 'js', 'ts', 'css', 'shell', 'html', 'md', 'yaml']
      // check out https://github.com/shikijs/shiki/blob/main/docs/languages.md for the available program language
      preload: ['vue', 'python', 'tsx']
    },
    markdown: {
      toc: {
        depth: 5,
        searchDepth: 5
      },
      remarkPlugins: ['remark-math', 'remark-sub', 'remark-super', 'remark-critic-markup'],
      rehypePlugins: {
        'rehype-katex': {
          output: 'htmlAndMathml'
        }
      }
    }
  }
})
