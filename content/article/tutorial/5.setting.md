# Setting

BlogiNote is flexible enough to meet your needs.

## Front Matter

* `showNoteCatalog` this property is used to set whether to display the catalog of the article at initial state (when the page open first) at "note" mode

  the default value is `showNoteCatalog: false` that means the catalog of an article **won't** show

* `showBlogCatalog` this property is used to set whether to display the catalog of the article at initial state (when the page open first) at "blog" mode

  the default value is `showNoteCatalog: false` that means the catalog of an article **won't** show

* `showTime` this property is used to set whether to display the timestamp of an article (the created time and the last updated time)

  the default value is `showTime: true` that means the timestamp will show

* `outdated.show` and `outdated.threshold` these two property are used to set whether to display outdated warning of the article, and the outdated days threshold

  the default value show as below

  ```js
  export default defineAppConfig({
    theme: {
      articlePage: {
        outdated: {
          show: true,
          threshold: 30
        },
      }
    }
  })
  ```

  that means the outdated warning will show and the article outdated days threshold is 30 days (after it created or the latest updated time).