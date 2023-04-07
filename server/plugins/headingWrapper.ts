/**
 *
 * wrap the heading with a <details> element
 *
 */
 // refer to a rehype plugin
 // https://github.com/Benbinbin/rehype-details-wrapper
 //
 // and the heading move to a <summary> element inside the <details> element
 // and the content below this heading between the next siblings heading (same level) will move to this <details> element
 // for example
 //
 // <h2>heading 2</h2>
 // <p>content 2</p>
 // <h3>heading 3</h3>
 // <p>content 3</p>
 // <h2>another heading 2</h2>
 // <p>content 4</p>
 //
 // will be transform to
 //
 // <details>
 //   <summary>
 //     <h2>heading 2</h2>
 //   </summary>
 //   <p>content 2</p>
 //   <details>
 //     <summary>
 //       <h3>heading 3</h3>
 //     </summary>
 //     <p>content 3</p>
 //   </details>
 // </details>
 // <details>
 //   <summary>
 //     <h2>another heading 2</h2>
 //   </summary>
 //   <p>content 4</p>
 // </details>

// eslint-disable-next-line no-inner-declarations
const headingArr = ['h2', 'h3', 'h4', 'h5', 'h6']
const headingLevelMap = {
  'h2': 2,
  'h3': 3,
  'h4': 4,
  'h5': 5,
  'h6': 6
}

interface CurrentHeadingWrapperMapType {
  'h2': any;
  'h3': any;
  'h4': any;
  'h5': any;
  'h6': any;
}

const currentHeadingWrapperMap: CurrentHeadingWrapperMapType = {
  'h2': null,
  'h3': null,
  'h4': null,
  'h5': null,
  'h6': null,
}

function wrapInDetails(headingNode: any) {
  return {
    type: 'element',
    tag: 'details',
    props: {
      open: true,
      dataHeadingId: headingNode?.props?.id
    },
    children: [
      // the first element is summary (wrap the heading node)
      {
        type: 'element',
        tag: 'summary',
        props: {},
        children: [headingNode]
      }
    ]
  }
}

// eslint-disable-next-line no-inner-declarations
function getParentWrapper(level: number) {
  let parentWrapper = currentHeadingWrapperMap[`h${level - 1}` as ('h2' | 'h3' | 'h4' | 'h5')]
  if (!parentWrapper) {
    if (level - 1 > 2) {
      const upperLevel = level - 1
      parentWrapper = getParentWrapper(upperLevel)
    } else {
      // the highest wrapper
      parentWrapper = currentHeadingWrapperMap['h2']
    }
  }
  return parentWrapper
}

// eslint-disable-next-line no-inner-declarations
function cleanDeepWrapper(level: number) {
  currentHeadingWrapperMap[`h${level + 1}` as ('h3' | 'h4' | 'h5' | 'h6')] = null

  if (level + 1 < 6) {
    const deepLevel = level + 1
    cleanDeepWrapper(deepLevel)
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    // manipulate the tree (the parsed result of markdown file)
    if (file?._path?.startsWith('/article/') && file?._extension === 'md') {
      // build a new children for article
      const newChildren: any[] = []

      let currentWrapper: any = null

      file.body.children.forEach((node: any) => {
        // if this is a heading node
        if (headingArr.includes(node.tag)) {
          // get the heading name and level from node
          const headingName = node.tag
          const headingLevel = headingLevelMap[headingName as ('h2' | 'h3' | 'h4' | 'h5' | 'h6')]

          // wrap the heading node into details element
          const wrapper = wrapInDetails(node)
          currentHeadingWrapperMap[headingName as ('h2' | 'h3' | 'h4' | 'h5' | 'h6')] = wrapper
          currentWrapper = wrapper

          // push the wrapper to the parent node
          if (headingLevel === 2) {
            newChildren.push(wrapper)
          } else {
            const parentWrapper = getParentWrapper(headingLevel)
            if (parentWrapper) {
              parentWrapper.children.push(wrapper)
            } else {
              newChildren.push(wrapper)
            }
          }

          // clean the deeper wrapper
          if (headingLevel < 6) {
            cleanDeepWrapper(headingLevel)
          }

          // set the heading path for the current heading node
          // the heading path include all the level headings in current state
          const headingPathObj = {
            h2: currentHeadingWrapperMap['h2']?.children[0]?.children[0]?.props
              ?.id,
            h3: currentHeadingWrapperMap['h3']?.children[0]?.children[0]?.props
              ?.id,
            h4: currentHeadingWrapperMap['h4']?.children[0]?.children[0]?.props
              ?.id,
            h5: currentHeadingWrapperMap['h5']?.children[0]?.children[0]?.props
              ?.id,
            h6: currentHeadingWrapperMap['h6']?.children[0]?.children[0]?.props
              ?.id,
          };

          const headingPathStr = JSON.stringify(headingPathObj);

          // record it as the data-heading-path attribute for the current heading node
          node.props.dataHeadingPath = headingPathStr;
        } else {
          // if this isn't a heading node
          if (currentWrapper) {
            currentWrapper.children.push(node)
          } else {
            newChildren.push(node)
          }
        }
      })

      file.body.children = newChildren
    }
  })
})