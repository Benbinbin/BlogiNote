import { defineTheme } from '@nuxt-themes/config'
export default defineTheme({
  author: 'Benbinbin',
  email: 'benthomsonbin@gmail.com',
  homePage: {
    showPostList: true,
    postItemLimit: 5,
    showBookshelf: true
  },
  articlePage: {
    showTime: true,
    outDated: {
      show: false,
      threshold: 30
    }
  }
})
