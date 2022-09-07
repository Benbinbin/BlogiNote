import { defineTheme } from '@nuxt-themes/config'
export default defineTheme({
  author: 'Benbinbin',
  email: 'benthomsonbin@gmail.com',
  homePage: {
    showBlogPosts: true,
    postItemLimit: 5
  },
  articlePage: {
    showTime: true,
    outDated: {
      show: true,
      threshold: 30
    }
  }
})
