import { SitemapStream, streamToPromise } from 'sitemap'
import { defineEventHandler } from 'h3'
import { serverQueryContent } from '#content/server'
import { useRuntimeConfig } from '#imports'

// refer to https://content.nuxtjs.org/guide/recipes/sitemap
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Fetch all documents
  const docs = await serverQueryContent(event).find()

  const articles = docs.filter(doc => doc?._type === 'markdown')

  const sitemap = new SitemapStream({
    hostname: config.public.hostname
  })

  for (const article of articles) {
    sitemap.write({
      url: article._path,
      changefreq: 'monthly'
    })
  }

  sitemap.end()

  return streamToPromise(sitemap)
})
