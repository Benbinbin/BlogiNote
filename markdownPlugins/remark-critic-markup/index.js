import { visit } from 'unist-util-visit'

// refer to https://github.com/CriticMarkup/CriticMarkup-toolkit#the-basic-syntax
// the regular expression to match the basic syntax of CriticMarkup:
// Addition
// * syntax: ++addition++
// * HTML: <ins class="critic addition">addition</ins>

// Deletion
// * syntax: --deletion--
// * HTML: <del class="critic deletion">deletion</del>

// Substitution:
// syntax: ~~remove~>substitution~~
// this syntax may conflict with the remark-gfm strikethrough syntax https://github.com/remarkjs/remark-gfm maybe this syntax can be replaced by Addition and Deletion syntax
// so this redundant syntax won't transform in this package

// Comment
// syntax(origin): >>comment<<
// this syntax may conflict with the markdown blockquote syntax https://commonmark.org/help/
// * syntax(adjust): //comment//
// * HTML: <span class="critic comment">comment</span>

// Highlight
// * syntax: ==highlight==
// * HTML: <mark class="critic highlight">highlight</mark>

const AddRegex = /\+\+[^++]+\+\+/g
const DeleteRegex = /--[^--]+--/g
const commentRegex = /\/\/[^//]+\/\//g
const highlightRegex = /==[^==]+==/g

// refer to https://github.com/rhysd/remark-emoji
export default function remarkCriticMarkup () {
  function transformer (ast) {
    // refer to https://www.ryanfiller.com/blog/remark-and-rehype-plugins
    visit(ast, 'text', (node) => {
      let newValue = node.value

      if (AddRegex.test(newValue)) {
        newValue = newValue.replace(AddRegex, (match) => {
          return '<ins class="critic-addition">' + match.substring(2, match.length - 2) + '</ins>'
        })
      }

      if (DeleteRegex.test(newValue)) {
        newValue = newValue.replace(DeleteRegex, (match) => {
          return '<del class="critic-deletion">' + match.substring(2, match.length - 2) + '</del>'
        })
      }

      if (commentRegex.test(newValue)) {
        newValue = newValue.replace(commentRegex, (match) => {
          return '<span class="critic-comment">' + match.substring(2, match.length - 2) + '</span>'
        })
      }

      if (highlightRegex.test(newValue)) {
        newValue = newValue.replace(highlightRegex, (match) => {
          return '<mark class="critic-highlight">' + match.substring(2, match.length - 2) + '</mark>'
        })
      }

      if (newValue !== node.value) {
        Object.assign(node, { type: 'html', value: newValue })
      }
    })
  }

  return transformer
}
