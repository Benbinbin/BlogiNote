import { defineNuxtConfig } from 'nuxt'

// Refer to: https://github.com/nuxt/content/issues/106#issuecomment-1002820342
const fs = require('fs')
const path = require('path')

// clean the "article" folder (copy from the "content" folder) first
const cleanContentFiles = (folderPath = 'public/article') => {
  const exists = fs.existsSync(folderPath)
  if (exists) {
    fs.rmSync(folderPath, { recursive: true })
  }
}

// then copy all other type of files except .md from "content" folder to public folder
// so all the assets can link to inside the markdown file by relative path
const copyContentFiles = (src, destFolderName, ignore = []) => {
  // url isn't case-sensitive but folder name is case-sensitive
  // change all the folders name to lowercase when copy them to public
  const dest = destFolderName.toLowerCase()

  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    if (!fs.existsSync(dest) || !fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest)
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyContentFiles(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        ignore
      )
    })
  } else {
    const ext = path.extname(src)
    if (!ignore.includes(ext)) {
      fs.copyFileSync(src, dest)
    }
  }
}

cleanContentFiles()
copyContentFiles('content', 'public', ['.md'])

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  app: {},
  typescript: {
    shim: false
  },
  modules: [
    '@nuxt-themes/config/module',
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ],
  // https://nuxt-themes.netlify.app/
  theme: {
    meta: {
      name: 'BlogiNote',
      description: 'A Nuxt theme for showing blog posts and snippet notes with flexible layouts and multiple optimizations.',
      author: 'Benbinbin',
      url: 'https://bloginote.benbinbin.com/'
    }
  },
  // https://content.nuxtjs.org
  content: {
    navigation: {
      fields: ['_id', '_type']
    },
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: 'one-dark-pro',
      // see the default preload languages on https://content.nuxtjs.org/api/configuration#highlightpreload
      preload: ['vue', 'python']
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
