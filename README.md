[![BlogiNote](./public/cover.jpg)](https://github.com/Benbinbin/BlogiNote)

# BlogiNote

BlogiNote is a static website template based on [Nuxt Content](https://content.nuxtjs.org).

It can be used to show your blog posts and learning notes, because BlogiNote has flexible layouts and multiple optimizations for long or short content.

:link: [Demo](#)


## Features

- content driving website, it can generate web pages based on lots of formats of files, like markdown, json, csv and more
- support [MDC syntax](https://content.nuxtjs.org/guide/writing/mdc) which supercharges markdown to be a more powerful tool, because Vue components can be used in it
- provide navigation page and filter feature to query articles more convenient

:muscle: it will keep evolving to add more features

## Setup

1. clone or download this repository to your PC

2. run the following command in terminal to install dependents

  ```bash
  # yarn
  yarn install

  # npm
  npm install
  ```

## Writing

run the following command in terminal to start a development server

```bash
npm run dev
```

 (add some markdown files) write some articles inside the `/content/article` folder, then you can preview the website at http://localhost:3000

:sparkles: you can refer to the example article at `/content/article/catalogOne/example.md`

## Deployment to static Hosting

1. run the following command in terminal to pre-render the website

  ```bash
  npm run generate
  ```

2. you will get the `dist/` directory (symlink to `.output/public`), it is ready to be deployed on any static hosting.

  :bulb: [learn more on Nuxt docs](https://v3.nuxtjs.org/guide/deploy/static-hosting).

## Development

you can also build your own template based on BlogiNote, adding some Remark plugins to extend the markdown syntax, or building some Vue components to add more custom features

## Reference

* [content-wind](https://github.com/Atinux/content-wind) - A lightweight Nuxt template to build a Markdown driven website. Powered by Nuxt Content, TailwindCSS and Iconify.