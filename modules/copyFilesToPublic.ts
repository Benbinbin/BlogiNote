/**
 *
 * copy files to public folder
 *
 */
// Refer to: https://github.com/nuxt/content/issues/106#issuecomment-1002820342
import { defineNuxtModule } from '@nuxt/kit'
import fs from 'node:fs'
import path from 'node:path'

// clean the "article" folder (copy from the "content" folder) by default
const cleanContentFiles = (folderPathArr: string[] = []) => {
  folderPathArr.forEach((folderPath) => {
    const exists = fs.existsSync(folderPath)
    if (exists) {
      fs.rmSync(folderPath, { recursive: true })
    }
  })
}

// then copy all other type of files except .md from "content" folder to public folder
// so all the assets can link to inside the markdown file by relative path
const copyContentFiles = (src: string, destFolderName: string, ignore: string[] = []) => {
  // url isn't case-sensitive but folder name is case-sensitive
  // change all the folders name to lowercase when copy them to public
  const dest = destFolderName.toLowerCase()

  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    if (!fs.existsSync(dest) || !fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest)
    }
    fs.readdirSync(src).forEach((childItemName: string) => {
      copyContentFiles(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        ignore
      )
    })
  } else {
    const ext = path.extname(src) as string
    if (!ignore.includes(ext)) {
      fs.copyFileSync(src, dest)
    }
  }
}

export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook('build:before', async () => {

      // clean some folders (copied from the "content" folder at the previous build time) first
      // the value should be ['public/article'] for BlogiNote (this folder is container for all articles)
      const cleanFolders = options.clean ? options.clean : []
      cleanContentFiles(cleanFolders)

      // copy all files within the source folder (preserve the file system hierarchy)
      // to the dest folder
      // but ignore some types of file, the default value is ['.md', '.json', '.csv']
      // because these types can handle by Nuxt Content module
      const sourceFolder = options.sourceFolder ? options.sourceFolder : 'content'
      const destFolder = options.destFolder ? options.destFolder : 'public'
      const ignoreTypes = options.ignoreTypes ? options.ignoreTypes : ['.md', '.json', '.csv']
      copyContentFiles(sourceFolder, destFolder, ignoreTypes)
    })
  }
})