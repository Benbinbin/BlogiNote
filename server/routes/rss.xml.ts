import RSS from 'rss'
import { serverQueryContent } from '#content/server'

// refer to https://mokkapps.de/blog/create-an-rss-feed-with-nuxt-3-and-nuxt-content-v2/
export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig()

  // const hostname = config.hostname

  const docs = await serverQueryContent(event).find()

  const articles = docs.filter(doc => doc?._type === 'markdown')

  const feed = new RSS({
    title: 'BlogiNote',
    site_url: 'https://bloginote.benbinbin.com',
    feed_url: 'https://bloginote.benbinbin.com/rss.xml',
    image_url: 'https://bloginote.benbinbin.com/default-avatar.png'
  })

  for (const article of articles) {
    feed.item({
      title: article.title,
      url: `https://bloginote.benbinbin.com${article._path}`,
      description: article.description
    })
  }

  const feedString = feed.xml({ indent: true })
  event.res.setHeader('content-type', 'text/xml')
  event.res.end(feedString)
})
