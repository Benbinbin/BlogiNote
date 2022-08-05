---
cover: write.jpg
---

# Write an article

This tutorial will show all you need to know about how to write an article.

## Where to write

::TipBox{type="tldr"}
* Writing articles inside the :file_folder: `/content/article` folder
* The :page_facing_up: `/content/index.md` file set the introduction content for Home Page
* The :page_facing_up: `/content/about.md` file set the content for About Page
::

You will may get confused because the project contains :dizzy_face: a mess of sub-folders or files. But don't be panic, **most of the time you can just focus the :file_folder: `/content` folder**, which is the container for all article files.

Browser the :file_folder: `/content` folder, you can see a bunch of `*.md` file. Yep, they're the article files, which written in a special syntax call Markdown. You can read the next chapter *[How to write](#how-to-write)* learning more about it.

There're two special articles:

* :page_facing_up: `/content/index.md` this file setting the introduction content of the [Home Page](/) (the content of purple box at the top of Home Page)

* :page_facing_up: `/content/about.md` this file setting the content of [About Page](/about)

You can rewrite :page_facing_up: `/content/index.md` and :page_facing_up: `/content/about.md` these two files to change the content in Home Page or About Page

The :file_folder: `/content/article` sub folder contains all other article, like this article is under the path `/content/article/tutorial`. You can delete all the existed articles inside the :file_folder: `/content/article` folder (but please keep the `/content/article` folder), then create a new markdown file inside the :file_folder: `/content/article` folder and start to :pencil: write you own article.

## How to write
BlogiNote usually use Markdown file to generate website page, so this part will show you how to write a markdown file. BlogiNote support basic Markdown syntax and MarkDown Components extended syntax (also called [MDC](https://content.nuxtjs.org/guide/writing/mdc/) for short)


::TipBox{type="tip"}
You can also learning Markdown basic syntax from the following two websites, which explain more details:

* [CommonMark](https://commonmark.org/): this website shows the most basic syntax, like how to mark a header, a link, an image and so on

* [GitHub Flavored Markdown Spec (GFM)](https://github.github.com/gfm/): this website shows the GFM syntax, which is another Markdown extended syntax created by Github, like supporting the footnote
::

## Add a cover

::TipBox{type="tldr"}
* Put image files inside the :file_folder: `/public/covers` folder
* Add the `cover: image_file_path` property at the top of your markdown file
::

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




