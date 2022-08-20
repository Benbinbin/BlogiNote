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
BlogiNote can consume three types of file to generate web page, they are **Markdown** file, **JSON** file and **CSV** file:

* [:IconCustom{name='bi:markdown'} **Markdown file**]{.text-blue-500}

  The file extension name is `.md`. Open a file in this type, you can see plain text with some strange marks, like `###`, which means the level 3 heading. With some simple syntax rules, it can convert the plain text content to rich text content.

  ::TipBox{type="tip"}
  You can also learning Markdown basic syntax from the following two websites:

  * [CommonMark](https://commonmark.org/): this website shows the most basic syntax, like how to mark a header, a link, an image and so on

  * [GitHub Flavored Markdown Spec (GFM)](https://github.github.com/gfm/): this website shows the GFM syntax, which is another Markdown extended syntax created by Github, like supporting the footnote
  ::

* [:IconCustom{name='bi:filetype-json'} **JSON file**]{.text-orange-500}

  The file extension name is `.json`. Open a file in this type, you can see the content like a tree. The data of this file is in a nested hierarchical structure, layer by layer.

* [:IconCustom{name='bi:filetype-csv'} **CSV file**]{.text-green-500}

  The file extension name is `.csv`. Open a file in this type, you can see a lot of Comma, because `CSV` is the abbreviation of Comma-Separated Values. It's one of the most common file type for spreadsheet, you maybe edit many time of these files in Microsoft Excel

### Markdown
Because Markdown provides some useful syntax rules to mark the plain text content, you can easily write a blog post in rich text format, with heading, list, quote and so on.

Most of the time, you will write a blog post in Markdown file, this part will show you how to write a markdown file.

BlogiNote support basic Markdown syntax and MarkDown Components extended syntax (also called [MDC](https://content.nuxtjs.org/guide/writing/mdc/) for short)

#### Basic Syntax

##### link

**Relative Link** start with `.` and `..`
##### Code
::TipBox{type="announce"}
Firstly, you should know the concept of **highlight theme** and the **preload programming languages**.

**Highlight theme** is a color rules to decorate the code text based on the programming language.

**Preload programming languages** is a subset of programming languages which are selected out from a large amount languages, and the serve will do some work under the hook to make the code block writing in these programming languages will be highlighted correctly.

These two concept are set inside the :page_facing_up: `nuxt.config.ts` file, you can read the [*Choose your code highlight Theme*](./faq#choose-your-code-highlight-Theme) and [*Add some preload programming languages*](./faq#add-some-preload-programming-languages) these two part of the [FAQ article](./faq).
::

Markdown support two types of code:

* inline code: the code inside the paragraph, writing inline code between the **backquote**

  :memo: for example writing the markdown content as below :point_down:

  ![inline code](./images/inline-code.png)

  :gear: compiled to web page you will get the result like that :point_right: Markdown file extension name is `.md`

  ::TipBox{type="tip"}
  Usually the backquote key is under `Esc` key in your keyboard
  ::

* block code: the code show as a block, writing block code between three **backquote**

  :memo: for example writing the markdown content as below :point_down:

  ![block code](./images/block-code.png)

  :gear: compiled to web page you will get the final result as below :point_down:

  ```javascript
  console.log('hello world!')
  ```

  ::TipBox{type="warning"}
  In order to highlight the code correctly, you need to specify which programming language the code belongs to right after the three backquote
  ::

  you can also provide more information about your code block:

  * **add the file name** inside the square brackets, like `[filename]`, to specify where the code come from, and you should separated this message should from other information with a blank space

  ::TipBox{type="tip"}
  you can also add a link to specify the source of the code block, the link should start with `https`, `http` or `www`
  ::

  * **highlight some lines** of your code block by adding some number inside the curly brackets, like `{2-4, 6}` to highlight the lines from second to fourth, and the sixth line

  :memo: for example writing the markdown content as below :point_down:

  ![block code with more info](./images/block-code-with-more-info.png)

  :gear: compiled to web page you will get the final result as below :point_down:

  ```javascript [/components/content/ProseCode.vue] {2-4, 6}
  const languageColorMap = {
    theme: '#a855f7',
    bash: '#89e051',
    shell: '#89e051',
    html: '#e34c26',
    javascript: '#f1e05a',
  }
  ```

## Set title
There are many ways to set the article title:

* the markdown file name

* the heading 1 in the article (and it should be the first element in the article)

* setting the `title` property at front-matter

the priority level is `title` property > heading 1 > file name

Most of the time you only need to write a heading 1 at the begin of the article (if your article has some front-matter content, the heading 1 should be follow the front-matter).

If you don't want to write the heading 1 at the top of the article, and you don't like the file name as the article title, you can provide the `title` property at front-matter to rewrite the title of the article.

::TipBox{type="warning"}
Please don't provide the `title` property and the heading 1 at the same time, because the heading 1 will always be hidden, and only show the `title` property as the article title in web page.
::

::TipBox{type="announce"}
the url of the article is always based on the file system path and the file name.
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




