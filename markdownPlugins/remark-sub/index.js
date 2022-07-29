import { visit } from 'unist-util-visit'

// the regular expression to match the subscript format in markdown, like ~word~
const REGEX = /_[^_]+_/g

// refer to https://github.com/rhysd/remark-emoji
export default function remarkSub () {
  function transformer (ast) {
    // refer to https://www.ryanfiller.com/blog/remark-and-rehype-plugins
    visit(ast, 'text', (node) => {
      if (REGEX.test(node.value)) {
        const newValue = node.value.replace(REGEX, (match) => {
          return '<sub>' + match.substring(1, match.length - 1) + '</sub>'
        })

        Object.assign(node, { type: 'html', value: newValue })
      }
    })
  }

  return transformer
}
