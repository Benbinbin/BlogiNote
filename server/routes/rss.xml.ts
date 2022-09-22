import RSS from 'rss'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const hostname = config.hostname

  const docs = await serverQueryContent(event).find()

  const articles = docs.filter(doc => doc?._type === 'markdown')

  const feed = new RSS({
    title: 'BlogiNote',
    site_url: hostname,
    feed_url: `${hostname}/rss.xml`
  })

  for (const article of articles) {
    feed.item({
      title: article.title,
      url: `${hostname}${article._path}`,
      description: article.description
    })
  }

  const feedString = feed.xml({ indent: true })
  event.res.setHeader('content-type', 'text/xml')
  event.res.end(feedString)
})
