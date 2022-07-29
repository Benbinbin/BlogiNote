import { visit } from 'unist-util-visit'

// the regular expression to match the subscript format in markdown, like ~word~
const REGEX = /\^[^^]+\^/g

// refer to https://github.com/rhysd/remark-emoji
export default function remarkSuper () {
  function transformer (ast) {
    // refer to https://www.ryanfiller.com/blog/remark-and-rehype-plugins
    visit(ast, 'text', (node) => {
      if (REGEX.test(node.value)) {
        const newValue = node.value.replace(REGEX, (match) => {
          return '<sup>' + match.substring(1, match.length - 1) + '</sup>'
        })
        Object.assign(node, { type: 'html', value: newValue })
      }
    })
  }

  return transformer
}
