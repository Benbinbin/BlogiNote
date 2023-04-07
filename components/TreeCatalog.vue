<script setup>
// use d3-hierarchy module to build the catalog tree
// d3-hierarchy documentation https://github.com/d3/d3-hierarchy/
// refer to https://observablehq.com/@d3/collapsible-tree

import { hierarchy, tree } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import { select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'

const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  catalogs: {
    type: Array,
    required: true
  }
})

/**
 *
 * size
 *
 */
// node size base on float DOM content size
// ⚠️ because the heading nodes tree is grow from left to right
// so the 'dx' is the node height actually
// and the 'dy' is the node width actually
const dx = 48; // node height
const dy = 128; // node width

const viewBox = computed(() => {
  // 41.33 is the height of control buttons container
  return `${-dy}, ${-(props.height-41.33) / 2}, ${props.width}, ${(props.height - 41.33)}`;
});

/**
 *
 * process data
 *
 */
// hierarchy data
const treeData = hierarchy({ text: 'catalog', depth: 0, children: props.catalogs });
treeData.descendants().forEach((d, i) => {
  // add 'id' property for each node as the identify
  d.id = i;
  // add '_children' as the copy fo 'children' property
  if (d.children) d._children = d.children;
  // if (d.children && d.depth >= 2) d.children = null;
});

/**
 *
 * build tree
 *
 */
// get nodes and links data
const nodesData = ref([])
const linksData = ref([])
const buildTree = () => {
  if(treeData) {
    const tinyTree = tree().nodeSize([dx, dy])(treeData);
    nodesData.value = tinyTree.descendants();
    linksData.value = tinyTree.links();
  }
}

// init build tree
buildTree()

// generate svg path based on link data
const linkPathGenerator = (link) => {
  const linkGenerator = linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);
  return linkGenerator(link);
};

/**
 *
 * color style
 *
 */
// #region color
const headingColorMap = {
  0: {
    text: 'text-gray-500',
    hoverBg: 'hover:bg-gray-100',
  },
  2: {
    text: 'text-purple-500',
    hoverBg: 'hover:bg-purple-100',
  },
  3: {
    text: 'text-red-500',
    hoverBg: 'hover:bg-red-100',
  },
  4: {
    text: 'text-green-500',
    hoverBg: 'hover:bg-green-100',
  },
  5: {
    text: 'text-blue-500',
    hoverBg: 'hover:bg-blue-100',
  },
  6: {
    text: 'text-gray-500',
    hoverBg: 'hover:bg-gray-100',
  }
}

const btnColorMap = {
  0: {
    withChildrenBg: 'bg-gray-500',
    withoutChildrenBg: 'bg-gray-200',
    border: 'border-gray-300'
  },
  2: {
    withChildrenBg: 'bg-purple-500',
    withoutChildrenBg: 'bg-purple-200',
    border: 'border-purple-300'
  },
  3: {
    withChildrenBg: 'bg-red-500',
    withoutChildrenBg: 'bg-red-200',
    border: 'border-red-300'
  },
  4: {
    withChildrenBg: 'bg-green-500',
    withoutChildrenBg: 'bg-green-200',
    border: 'border-green-300'
  },
  5: {
    withChildrenBg: 'bg-blue-500',
    withoutChildrenBg: 'bg-blue-200',
    border: 'border-blue-300'
  },
  6: {
    withChildrenBg: 'bg-gray-500',
    withoutChildrenBg: 'bg-gray-200',
    border: 'border-gray-300'
  }
}

// active heading
const activeHeadings = {
  0: undefined,
  2: inject('activeH2Heading'),
  3: inject('activeH3Heading'),
  4: inject('activeH4Heading'),
  5: inject('activeH5Heading'),
  6: inject('activeH6Heading')
}

const pathColorMap = {
  0: {
    normal:'stroke-gray-200',
    active:'stroke-gray-400',
  },
  2: {
    normal:'stroke-purple-200',
    active:'stroke-purple-400',
  },
  3: {
    normal:'stroke-red-200',
    active:'stroke-red-400',
  },
  4: {
    normal:'stroke-green-200',
    active:'stroke-green-400',
  },
  5: {
    normal:'stroke-blue-200',
    active:'stroke-blue-400',
  },
  6: {
    normal:'stroke-gray-200',
    active:'stroke-gray-400'
  },
}
// #endregion

/**
 *
 * interaction
 * zoom and toggle heading
 *
 */
const transform = ref({
  x: 0,
  y: 0,
  k: 1,
})

// zoom
let zoomController;
onMounted(() => {
  zoomController = zoom().scaleExtent([0.5, 5]).on("zoom", (event) => {
    transform.value = event.transform;
  });
  select("#tree-catalog").call(zoomController);
});

const resetTransform = () => {
  select("#tree-catalog")
    .transition()
    .duration(200)
    .call(zoomController.transform, zoomIdentity);
};

// toggle heading
const targetHeadingNode = ref(null)
// record and sync collapse headings
const collapsedHeadingsSet = inject('collapsedHeadingsSet')
const collapseHeadingHandler = inject('collapseHeadingHandler')
const expandHeadingHandler = inject('expandHeadingHandler')

const recursiveCheck = (node) => {
  if (node._children) {
    if (collapsedHeadingsSet.value.has(node.data.id)) {

      node.children = null
    } else {
      node.children = node._children
    }
    node._children.forEach(subNode => {
      recursiveCheck(subNode)
    })
  }
}

watch(collapsedHeadingsSet, () => {
  // if (toggleAllCatalogItemState.value === 'expand') {
  //   treeData.descendants().forEach((node) => {
  //     recursiveExpandHeadingNode(node)
  //   })
  // } else if (toggleAllCatalogItemState.value === 'collapse') {
  //   treeData.descendants().forEach((node) => {
  //     if (node.data.depth !== 0 && node._children) {
  //       node.children = null
  //     }
  //   })
  // }

  treeData.descendants().forEach((node) => {
    // recursiveExpandHeadingNode(node)
      recursiveCheck(node)
  })

  buildTree();
  // resetTransform()
  if(targetHeadingNode.value) {
    adjustTransform(targetHeadingNode.value)
    targetHeadingNode.value = null
  }
  // changeToggleAllCatalogItemState('')
}, { deep: true, immediate: true })


// adjust tree transform (translate) when manually toggle heading
const adjustTransform = (node) => {
  // const scale = 1;
  // let targetX, targetY;
  // if (isExpand) {
  //   // if expand heading, the target node is current heading node
  //   targetX = node.y;
  //   targetY = node.x;
  // } else {
  //   // if collapse heading, the target node is the parent heading node
  //   targetX = node.parent.y;
  //   targetY = node.parent.x;
  // }

  // move the target heading node to center
  // with 'dy' offset in x axis
  // to show the target heading node and the children heading nodes
  select("#tree-catalog")
    .transition()
    .duration(200)
    .call(zoomController.translateTo, node.y + dy, node.x);
};

// manually toggle heading
const currentClickNodeId = ref(null)
const toggleHeadingHandler = (node) => {
  if (!node.parent) return;
  currentClickNodeId.value = node.id
  if (node.children) {
    targetHeadingNode.value = node.parent
    collapseHeadingHandler(node.data.id)
    // if the heading node has already show the children
    // collapse it
    // node.children = null;
    // then rebuild the tree to refresh all node coordinate
    // buildTree();
    // adjustTransform(node, false);
  } else {
    // if the heading node don't show the children
    // expand it
    // node.children = node._children;
    // then rebuild the tree to refresh all node coordinate
    targetHeadingNode.value = node
    expandHeadingHandler(node.data.id)
    // buildTree();
    // adjustTransform(node, true);
  }
};

// const toggleAllCatalogItemState = inject('toggleAllCatalogItemState')

// const changeToggleAllCatalogItemState = inject('changeToggleAllCatalogItemState')

const collapseAllHeadingsHandler = inject('collapseAllHeadingsHandler')
const expandAllHeadingsHandler = inject('expandAllHeadingsHandler')

// const recursiveExpandHeadingNode = (node) => {
//   if(node._children) {
//     node.children = node._children
//     node.children.forEach(subNode => {
//       if(subNode._children) {
//         recursiveExpandHeadingNode(subNode)
//       }
//     })
//   }
// }

// watch(toggleAllCatalogItemState, () => {
//   if (toggleAllCatalogItemState.value === 'expand') {
//     treeData.descendants().forEach((node) => {
//       recursiveExpandHeadingNode(node)
//     })
//   } else if (toggleAllCatalogItemState.value === 'collapse') {
//     treeData.descendants().forEach((node) => {
//       if (node.data.depth !== 0 && node._children) {
//         node.children = null
//       }
//     })
//   }

//   buildTree();
//   resetTransform()
//   changeToggleAllCatalogItemState('')
// })

const syncCatalogToggleState = useState('syncCatalogToggleState')

/**
 *
 * manual change catalog type
 *
 */
const catalogType = useState('catalogType')
const toggleCatalogFloat = useState('toggleCatalogFloat')

const changeCatalogType = (value) => {
  if (value === 'sidebarList') {
    toggleCatalogFloat.value = false
  } else {
    toggleCatalogFloat.value = true
  }
  catalogType.value = value
}

const toggleFloatCatalogTypeHandler = () => {
  if (catalogType.value === 'floatTree') {
    changeCatalogType('floatList')
  } else {
    changeCatalogType('floatTree')
  }
}

const toggleCatalogFloatHandler = () => {
  if (catalogType.value === 'sidebarList') {
    changeCatalogType('floatList')
  } else {
    changeCatalogType('sidebarList')
  }
}
</script>

<template>
  <div>
    <!-- tree catalog -->
    <svg
      id="tree-catalog"
      class="grow select-none"
      :viewBox="viewBox"
    >
      <!-- collapsible tree container -->
      <g
        :transform="`translate(${transform.x}, ${transform.y}) scale(${transform.k}) `"
      >

        <!-- tree links container -->
        <g
          fill="none"
          stroke="#E5E7EB"
          stroke-opacity="1"
          stroke-width="1.5"
        >
          <TransitionGroup
            enter-from-class="opacity-0"
            enter-active-class="transition-all delay-200 duration-200 ease-in"
            enter-to-class="opacity-100"
          >
            <path
              v-for="link of linksData"
              :key="link.target.id"
              :d="linkPathGenerator(link)"
              class="transition-all duration-200"
              :data-depth="link.target.data.depth"
              :data-target-id="link.target.data.id"
              :data-active-id="activeHeadings[link.target.data.depth]?.value"
              :class="link.target.data.id === activeHeadings[link.target.data.depth]?.value ? `stroke-2 ${pathColorMap[link.target.data.depth].active}` : `stroke-1 ${pathColorMap[link.target.data.depth].normal}`"
            />
          </TransitionGroup>
        </g>

        <!-- tree nodes container -->
        <g
          pointer-events="all"
          style="font: 14px sans-serif"
        >
          <TransitionGroup
            enter-from-class="opacity-0"
            enter-active-class="transition-all delay-200 duration-200 ease-in"
            enter-to-class="opacity-100"
            @after-enter="currentClickNodeId = null"
            @after-leave="currentClickNodeId = null"
          >
            <g
              v-for="node of nodesData"
              :key="node.id"
              cursor="pointer"
              :transform="`translate(${node.y}, ${node.x})`"
              class="transition-all duration-200"
            >
              <foreignObject
                :x="node.parent ? '0rem' : '-3.5rem'"
                y="-1.5rem"
                width="7rem"
                height="3rem"
              >
                <div
                  class="w-full h-full flex items-center gap-0.5"
                >
                  <button
                    v-if="node.data.depth !== 0 && node._children"
                    class="shrink-0 w-4 h-4 flex justify-center items-center border-2 rounded-full"
                    :class="`${btnColorMap[node.data.depth].border} ${btnColorMap[node.data.depth].withChildrenBg}`"
                    :disabled="!node._children"
                    @click="toggleHeadingHandler(node)"
                  >
                    <IconCustom
                      name="ion:add"
                      class="text-white transition-transform duration-200"
                      :class="node.children ? 'rotate-45' : 'rotate-0'"
                    />

                  </button>
                  <div
                    v-else
                    class="shrink-0 w-4 h-4 flex justify-center items-center"
                  >
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="`${btnColorMap[node.data.depth].withoutChildrenBg}`"
                    />
                  </div>
                  <a
                    v-if="node.data.id"
                    :href="`#${node.data.id}`"
                    class="max-w-full p-1 text-xs font-bold text-left transition-colors duration-300 rounded"
                    :class="`${headingColorMap[node.data.depth].text} ${headingColorMap[node.data.depth].hoverBg}`"
                    style="text-shadow: 0px 0px 5px #f3f4f6, -3px 0px 3px #f3f4f6, 3px 0px 3px #f3f4f6, 0px 3px 3px #f3f4f6, 0px -3px 3px #f3f4f6; word-wrap: break-word;"
                  >{{ node.data.text }}</a>
                  <span
                    v-else
                    class="p-1 text-xs font-bold text-left"
                    :class="`${headingColorMap[node.data.depth].text}`"
                    style="text-shadow: 0px 0px 5px #f3f4f6, -3px 0px 3px #f3f4f6, 3px 0px 3px #f3f4f6, 0px 3px 3px #f3f4f6, 0px -3px 3px #f3f4f6;"
                  >{{ node.data.text }}</span>
                </div>
              </foreignObject>
            </g>
          </TransitionGroup>
        </g>


      </g>
    </svg>
    <!-- control buttons container -->
    <div
      class="catalog-btn-container shrink-0 py-2 flex justify-between items-center gap-x-8 overflow-x-auto"
    >
      <div class="flex items-center gap-2">
        <button
          class="catalog-btn flex border-purple-400"
          :class="syncCatalogToggleState ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="syncCatalogToggleState = !syncCatalogToggleState"
        >
          <IconCustom
            name="ic:outline-link"
            class="w-4 h-4"
          />
        </button>

        <button
          class="catalog-btn flex text-green-400 hover:text-green-500 active:text-white bg-green-100 active:bg-green-500 border-green-400"
          @click="expandAllHeadingsHandler"
        >
          <IconCustom
            name="ic:outline-unfold-more"
            class="w-4 h-4"
          />
        </button>

        <button
          class="catalog-btn flex text-red-400 hover:text-red-500 bg-red-100 active:text-white active:bg-red-500 border-red-400"
          @click="collapseAllHeadingsHandler"
        >
          <IconCustom
            name="ic:outline-unfold-less"
            class="w-4 h-4"
          />
        </button>

        <button
          class="catalog-btn flex text-purple-400 hover:text-purple-500 bg-purple-100 active:text-white active:bg-purple-500 border-purple-400"
          @click="resetTransform"
        >
          <IconCustom
            name="ic:round-settings-backup-restore"
            class="w-4 h-4"
          />
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="catalog-btn flex border-purple-400"
          :class="catalogType === 'floatTree' ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="toggleFloatCatalogTypeHandler"
        >
          <IconCustom
            name="ic:outline-account-tree"
            class="w-4 h-4"
          />
        </button>
        <button
          class="catalog-btn hidden xl:flex border-purple-400"
          :class="(catalogType === 'floatTree' || catalogType === 'floatList') ? 'text-white bg-purple-500 hover:bg-purple-400' : 'text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500'"
          @click="toggleCatalogFloatHandler"
        >
          <IconCustom
            :name="catalogType === 'sidebarList' ? 'mingcute:miniplayer-line' : 'mingcute:expand-player-line'"
            class="w-4 h-4"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog-btn-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
.catalog-btn {
  @apply shrink-0 p-2 sm:p-1 justify-center items-center border transition-colors duration-300 rounded
}
</style>