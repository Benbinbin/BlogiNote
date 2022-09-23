import { Feed } from 'feed'
import { defineEventHandler, appendHeader } from 'h3'
import { serverQueryContent } from '#content/server'
import { useRuntimeConfig } from '#imports'

// refer to https://mokkapps.de/blog/create-an-rss-feed-with-nuxt-3-and-nuxt-content-v2/
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // feed information
  const feed = new Feed({
    id: config.public.hostname,
    title: config.rss.title,
    description: config.rss.description,
    link: config.public.hostname,
    image: config.rss.image,
    copyright: config.rss.copyright
  })

  // feed items
  const docs = await serverQueryContent(event).find()

  // get all markdown files
  // the data structure is mdast
  const articles = docs.filter(doc => doc?._type === 'markdown')

  if (articles.length > 0) {
    articles.forEach((article) => {
      // let articleDate = new Date() // should we set the default date as today?
      let articleDate

      if (article.updated) {
        articleDate = new Date(article.updated)
      } else if (article.created) {
        articleDate = new Date(article.created)
      }

      feed.addItem({
        id: article._path,
        title: article.title,
        link: `${config.public.hostname}${article._path}`,
        description: article.description,
        // this property should be the full content of the article
        // but Nuxt Content now don't provide explicit method to convert mdast to html
        // although there are some solutions https://journal.maciejpedzi.ch/generating-rss-feeds-for-a-nuxt-content-site
        content: 'this should be the full content',
        date: articleDate
      })
    })
  }

  appendHeader(event, 'Content-Type', 'application/xml')

  return feed.rss2()
})
