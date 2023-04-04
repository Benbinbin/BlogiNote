// the alternative to Nuxt theme https://nuxt-themes.netlify.app/
export default defineAppConfig({
  bloginote: {
    meta: {
      name: 'BlogiNote',
      description: 'A Nuxt theme for showing blog posts and snippet notes with flexible layouts and multiple optimizations.',
      author: 'Benbinbin',
      url: 'https://bloginote.benbinbin.com/'
    },
    author: 'Benbinbin',
    email: 'benthomsonbin@gmail.com',
    avatar: '/default-avatar.png',
    favicon: '/default-favicon.ico',
    scrollSmooth: true,
    homePage: {
      showBlogPosts: true,
      postItemLimit: 20
    },
    subscribePage: true,
    articlePage: {
      showTime: true,
      outdated: {
        show: true,
        threshold: 30
      },
      showCatalog: true,
    },
    search: {
      exclude: [
        '/',
        '/about/',
        '/subscribe/',
        '/list/'
      ]
    },
    assetTypes: []
  }
})
