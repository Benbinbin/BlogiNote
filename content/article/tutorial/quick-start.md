---
articleType: note
---

# Quick Start

This tutorial will show your how to setup a project with BlogiNote in a simple way step-by-step

## Setup Environment

::TipBox{type="announce" name="Option Step"}
Steps in this part is **optional**.

This section just for the user who wants to test or preview the parsed web pages locally.

If you just need to write blog posts or notes locally (then sync or upload them to the remote repository at Github), you can **skip** this section.
::

:IconCustom{name="ph:number-circle-one-fill" IconClass="w-6 h-6 text-purple-500"} Install the Node.js at your PC first:

you can download the latest LTS Version Node.js installer from its [homepage](https://nodejs.org/en/download/) (Please select the installation package suitable for your computer system) and install it.

::TipBox{type="good" name="Recommend"}
A better way for developer to install the Node.js is using **[nvm](https://github.com/nvm-sh/nvm)**.

If you're a web developer, you may need to change the Node.js version for different projects. nvm can manage multiple Node.js versions and change the active version easily.

nvm is just for unix, Mac and windows WSL. If your PC system is windows, you can try the [nvm-windows](https://github.com/coreybutler/nvm-windows).
::

:IconCustom{name="ph:number-circle-two-fill" IconClass="w-6 h-6 text-purple-500"} then you should install the [`yarn` package](https://yarnpkg.com/) globally:

run the follow command at your terminal

```bash
npm i yarn
```

## Register Github and Vercel Account

:IconCustom{name="ph:number-circle-one-fill" IconClass="w-6 h-6 text-purple-500"} register a [Github](https://github.com/) account first

::TipBox{type="tip"}
Github is a hosting service for code.

The [source code of BlogiNote](https://github.com/Benbinbin/BlogiNote) is also hosted by it.

you need to copy the starter template from it, and put all the content to it.
::

The free plan of Github is enough for this project, because most of the files for blog are small markdown files and images files.

:IconCustom{name="ph:number-circle-two-fill" IconClass="w-6 h-6 text-purple-500"} then register a [Vercel](https://vercel.com) account

We need to deploy our project to this platform

::TipBox{type="tip"}
All you just need to do in this platform is just connecting the Github repository to the Vercel, then all heavy work will automatically run in the background.
::


## Use the Starter Template

### Fork Template

### Download Template

::TipBox{type="announce" name="Option Step"}
Steps in this part is **optional**.

This section just for the user who wants to test or preview the parsed web pages locally.

If you just need to write blog posts or notes locally (then sync or upload them to the remote repository at Github), you can **skip** this section.
::

### Deploy to Vercel


After connect Github repository to Vercel, then all heavy work will automatically run in the background.

It will run BlogiNote program to parse the markdown files to web pages first, then deploy them to a server.

All these steps will finish within a minutes (the built time based on your content), and finally you will get a link of the project.

:tada: Just click to visit your website.

::TipBox{type="tip"}
After the first deploy, Vercel platform will monitor your Github repository. When you change the content of the Github repository, Vercel will auto rebuild the website for you.

It means each time you upload the new blog article to the Github repository, you just need to wait a minutes then refresh the browser, you can see the new blog post.

Yep :IconCustom{name="twemoji:partying-face"} so easily
::


---

3. change the highlight color theme for code

4. set the preload programming language for code highlight

if you want to custom some parts of the project, please keep reading

## code highlight

if you want to change code highlight color theme, you can change the property of :page_facing_up: `nuxt.config.ts` file


