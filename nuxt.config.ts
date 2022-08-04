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
  runtimeConfig: {
    // Keys within public, will be also exposed to the client-side
    public: {
      author: 'Benbinbin',
      email: 'benthomsonbin@gmail.com'
    }
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css'
        }
      ],
      style: [
        {
          type: 'text/css',
          children: 'html, body { scroll-behavior: smooth }'
        },
        {
          type: 'text/css',
          children: 'body { overflow: overlay }'
        }
      ]
    }
  },
  typescript: {
    shim: false
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  // https://color-mode.nuxtjs.org
  // colorMode: {
  //   classSuffix: ''
  // },
  // https://content.nuxtjs.org
  content: {
    navigation: {
      fields: ['_id', '_type']
    },
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: 'one-dark-pro',
      preload: ['diff', 'html', 'css', 'ts', 'js', 'vue', 'python']
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
