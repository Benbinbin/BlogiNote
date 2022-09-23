import { Feed } from 'feed'
import { serverQueryContent } from '#content/server'

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
      const articleDate = article.updated || article.created

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
