# FAQ

::TipBox{type="announce"}
A collection of frequent ask questions.
::

## Where to write
write all your blog posts and notes inside the :file_folder: `/content/article` folder

## Choose your code highlight Theme
The block code highlight engine is Shiki, and it provides a lot of themes to highlight code.

::TipBox{type="announce"}
Each themes has its different color rules to highlight code block.

All available themes list in [this page](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme). You can select any one list here.

You can check out [this page](https://vscodethemes.com/) to preview them.
::

The default highlight theme is `'one-dark-pro'`, you can change it at the :page_facing_up `nuxt.config.ts` file, by **setting the `theme` property**.

For example I want to set the theme to `github-dark`.

So I set the configuration file as below:

```ts [nuxt.config.ts] {4}
export default defineNuxtConfig({
  content: {
    highlight: {
      theme: 'github-dark'
    }
  }
})
```

## Add some preload program languages
The block code highlight engine is Shiki, it supports to highlight hundreds of program languages.

This project has set some common program languages in advance, to make the relative block code highlight correctly.

The 11 preload program languages by default:

* `'diff'`
* `'json'`
* `'js'`
* `'ts'`
* `'css'`
* `'shell'`
* `'html'`
* `'md'`
* `'yaml'`
* `'vue'`
* `'python'`

If you want to write a code block **which doesn't belong to any default program languages list above**, you should add these program languages to the :page_facing_up `nuxt.config.ts` file first, **by setting the `preload` property**.

::TipBox{type="announce"}
All supported program languages list in [this page](https://github.com/shikijs/shiki/blob/main/docs/languages.md).

Before setting the `preload` property, you should check out the page first, to make sure that Shiki support the program language your block code belongs to.
::

For example I want to write a code block by using the `ssh-config` program language.

Firstly, I should make sure that Shiki support this program language in [this page](https://github.com/shikijs/shiki/blob/main/docs/languages.md).

Then I the configuration file as below:

```ts [nuxt.config.ts] {4}
export default defineNuxtConfig({
  content: {
    highlight: {
      preload: ['ssh-config']
    }
  }
})
```


If you want to write block code using the program language which don't support by Shiki, you can **set the block code program language to `md` or `markdown` as a fallback solution**.

But this solution has a little flaw, the `md` or `markdown` tag will show at the top-right corner of the code block, it maybe confuse your readers.

But you can fix it in a trick way, by **providing the source message** of the code at the same time, and the value contains the file extension information.

::TipBox{type="tip"}
Because the engine will auto analyze the source value, and extract the file extension to overwrite the program language value, then you can get the right program language tag at the top-right corner of the code block.
::

For example I want to write some plain text in the code block, but I have to set the program language as `md` because the Shiki don't support to highlight the `.txt` content.

But I can provide the source message `[introduction.txt]` at the same time

the code block show below with highlight and correct program language information:

```md [introduction.txt]
Thanks a lot to use BlogiNote
```

## Change avatar
## Which is my data
:file_folder: `/content/article` folder contains almost all your data.

## Update or Migrate
if you want to update or migrate your blog, you should backup your data first.

Your data created by yourself are inside the follow folders:

* :file_folder: `/content/article` folder contains almost all your data, like your blog posts and notes, your assets insert to you blog and so on.

* :file_folder: `/public/cover` folder contains all your cover images for your posts.