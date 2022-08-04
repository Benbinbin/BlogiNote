---
cover: write.jpg
---

# Write an article

BlogiNote usually use Markdown file to generate website page, so this tutorial main part is showing you how to write a Markdown file with the basic syntax and extended syntax (which also called [MDC](https://content.nuxtjs.org/guide/writing/mdc/) for short)


::TipBox{type="tip"}
you should know some basic syntax about it, you can learning it from the following two websites:

* [CommonMark](https://commonmark.org/): this website show the most basic syntax, like how to mark a header, a link, an image and so on

* [GitHub Flavored Markdown Spec (gfm)](https://github.github.com/gfm/): this website show the gfm syntax, which is another Markdown extended syntax created by Github, like supporting the footnote
::

## Cover

Before we jump into the :sleeping: boring but useful syntax about Markdown, let's add some colorful cover for this article first.

You maybe notice the header content of this article within `---` three dashes, which is written in a special format called [YAML or YML](https://yaml.org/). In one word, this format is make up of a list of `key: value` pairs,

::TipBox{type="announce"}
We add some metadata for page by add some YAML within `---` three dashes at the top of the article.

We won't see this metadata after the markdown file convert to the website page. So you shouldn't worry about the dirty header of the markdown will stain :umbrella: the article
::

we can add a cover for this article by adding the `cover: path/of/the/image` pairs.

1. I download an [image](https://unsplash.com/photos/xG8IQMqMITM) (Photo by [Aaron Burden](https://unsplash.com/@aaronburden) on [Unsplash](https://unsplash.com/)）first, and rename the file name as `write.jpg`

![image](/covers/write.jpg)

2. then put it into the folder :file_folder: `/public/covers`

3. then add the `cover: write.jpg` pair at the top of this article within `---` three dashes

4. Yeah, that's it. Now you can check the [home page](/), :tada: you will see the cover shown at the article list item right corner. But it looks transparent for accessible reason to read the description text more easily.




