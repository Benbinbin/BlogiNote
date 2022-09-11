import { visit } from 'unist-util-visit'
import mermaid from 'mermaid'

// Reference:
// * remark and rehype plugins tutorial https://www.ryanfiller.com/blog/remark-and-rehype-plugins
// * remark example https://github.com/rhysd/remark-emoji
// * mermaid for remark plugin https://www.npmjs.com/package/@moevis/remark-mermaid-plugin
export default function remarkMermaidSVG () {
  function transformer (ast) {
    visit(ast, { type: 'code', lang: 'mermaid' }, (node) => {
      if (node.value) {
        mermaid.mermaidAPI.initialize()
        const newValue = mermaid.mermaidAPI.render('itemId', node.value)
        Object.assign(node, { type: 'html', value: newValue })
      }
    })
  }

  return transformer
}
