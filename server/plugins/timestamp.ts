/**
 * add timestamp for markdown file
 */
import { execSync } from 'node:child_process'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    if (file._id.endsWith('.md')) {

      const filePath = file._id.replace(/:/g, '/')

      const firstCommitTime = execSync(`git log --diff-filter=A --format=%as -- ${filePath}`, { encoding: 'utf-8' }).trim();
      const lastCommitTime = execSync(`git log -1 --format=%as -- ${filePath}`, { encoding: 'utf-8' }).trim();

      file.git_time_created = firstCommitTime
      file.git_time_updated = lastCommitTime
    }
  })
})