import { SitemapStream, streamToPromise } from 'sitemap'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const hostname = config.hostname

  // Fetch all documents
  const docs = await serverQueryContent(event).find()

  const articles = docs.filter(doc => doc?._type === 'markdown')

  const sitemap = new SitemapStream({
    hostname
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
