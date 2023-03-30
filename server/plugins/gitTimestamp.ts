/**
 * add timestamp for markdown file
 */
import { execSync } from 'node:child_process'
const runtimeConfig = useRuntimeConfig()
const isGetCreated = runtimeConfig.timestamp.created
const isGetUpdated = runtimeConfig.timestamp.updated

export default defineNitroPlugin((nitroApp) => {
  if (isGetCreated || isGetUpdated) {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
      if (file?._path?.startsWith('/article/') && file?._extension === 'md') {

        // convert the id to absolute path
        const filePath = file._id.replace(/:/g, '/')

        // get the created time
        if(isGetCreated) {
          const firstCommitTime = execSync(`git log --diff-filter=A --format=%as -- ${filePath}`, { encoding: 'utf-8' }).trim();
          file.git_time_created = firstCommitTime
        }

        // get the last updated time
        if(isGetUpdated) {
          const lastCommitTime = execSync(`git log -1 --format=%as -- ${filePath}`, { encoding: 'utf-8' }).trim();
          file.git_time_updated = lastCommitTime
        }
      }
    })
  }
})