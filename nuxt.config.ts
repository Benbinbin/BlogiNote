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
    timestamp: {
      created: false,
      updated: false
    },
    rss: {
      title: 'BlogiNote',
      description: 'BlogiNote is a Nuxt Theme to build a static website for showing blog and note with flexible layouts and fancy interaction.',
      image: 'https://bloginote.benbinbin.com/default-avatar.png',
      favicon: 'https://bloginote.benbinbin.com/default-favicon.ico',
      copyright: `All rights reserved ${(new Date()).getFullYear()}, Benbinbin`
    },
    public: {
      hostname: 'https://bloginote.benbinbin.com'
    }
  },
  modules: [
    ['bloginote-copy-files-module', { cleanFolders: ['public/article'] }],
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
      remarkPlugins: ['remark-math', 'remark-sub', 'remark-super'],
      rehypePlugins: {
        'rehype-katex': {
          // the math formula will render as HTML and Mathml
          // because the Mathml <annotation> contain the formula text content
          // and enable to copy the formula from the web page
          // refer to https://katex.org/docs/options.html#:~:text=output
          output: 'mathml' // the default value is `htmlAndMathml`
        }
      }
    },
    // ignores: ['images', 'attachment']
    ignores: [],
  }
})
