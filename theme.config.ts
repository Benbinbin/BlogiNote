import { defineTheme } from '@nuxt-themes/config'
export default defineTheme({
  author: 'Benbinbin',
  email: 'benthomsonbin@gmail.com',
  homePage: {
    listItemsLimit: 5
  },
  articlePage: {
    showTime: true,
    outDated: {
      show: false,
      threshold: 30
    }
  }
})
