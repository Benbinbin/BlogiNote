<script setup>
// use d3-hierarchy module to build the catalog tree
// d3-hierarchy documentation https://github.com/d3/d3-hierarchy/
// refer to https://observablehq.com/@d3/collapsible-tree

import { hierarchy, tree } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import { select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'
// import { HierarchyNode, HierarchyPointLink } from '@types/d3-hierarchy'
// const props = defineProps<{
//   width: number;
//   height: number;
//   catalogs: CatalogItem[]
// }>()


// interface CatalogItem {
  //   id: string;
  //   depth: number;
  //   text: string;
  //   children?: CatalogItem[]
  // }

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
// window size
// const windowSize = useWindowSize()

// node size base on float DOM content size
// ⚠️ because the heading nodes tree is grow from left to right
// so the 'dx' is the node height actually
// and the 'dy' is the node width actually
const dx = 48; // node height
// node width
// const dy = computed(() => {
//   const nodeWidth = windowSize.value.width / 5; // each time show 3 node and 2 line
//   return nodeWidth
// });
const dy = 128;

const viewBox = computed(() => {
  return `${-dy}, ${-props.height / 2}, ${props.width}, ${props.height}`;
});

/**
 *
 * process data
 *
 */

// let treeData = null;
// const setTreeData = () => {
// hierarchy data
const treeData = hierarchy({ text: 'catalog', depth: 0, children: props.catalogs });
treeData.descendants().forEach((d, i) => {
  // add 'id' property for each node as the identify
  d.id = i;
  // add '_children' as the copy fo 'children' property
  if (d.children) d._children = d.children;
  // if (d.children && d.depth >= 2) d.children = null;
});

// };

// setTreeData()

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
    console.log(linksData.value);
  }
}

// init build tree
buildTree()

// watch([props.height, props.width], () => {
//   console.log('rebuild');
//   buildTree()
// })


// generate svg path based on link data
const linkPathGenerator = (link) => {
  const linkGenerator = linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);
  return linkGenerator(link);
};

// generate svg text based on node data
const textGenerator = (node, type = "truncate") => {
  // text max width
  const len = Math.floor((dy).value / 14);
  const text = node.data.text

  if (text.length > len && type === "truncate") {
    return `${text.substring(0, len).trim()}...`;
  } else {
    return text;
  }
};

const headingColorMap = {
  0: {
    text: 'text-purple-500',
    hoverBg: 'hover:bg-purple-100',
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
    withChildrenBg: 'bg-purple-500',
    withoutChildrenBg: 'bg-purple-200',
    border: 'border-purple-300'
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

const resizeTransform = () => {
  select("#tree-catalog")
    .transition()
    .duration(200)
    .call(zoomController.transform, zoomIdentity);
};

// watch([props.height, props.width], () => {
//   resizeTransform()
// })

// adjust tree transform (translate) when toggle heading
const adjustTransform = (node, isExpand) => {
  // const scale = 1;
  let targetX, targetY;
  if (isExpand) {
    // if expand heading, the target node is current heading node
    targetX = node.y;
    targetY = node.x;
  } else {
    // if collapse heading, the target node is the parent heading node
    targetX = node.parent.y;
    targetY = node.parent.x;
  }

  // move the target heading node to center
  select("#tree-catalog")
    .transition()
    .duration(200)
    .call(zoomController.translateTo, targetX, targetY);
};

// toggle (collapse or expand) heading
const currentClickNodeId = ref(null)
const toggleHeadingHandler = (node) => {
  if (!node.parent) return;
  currentClickNodeId.value = node.id
  if (node.children) {
    // if the heading node has already show the children
    // collapse it
    node.children = null;
    // then rebuild the tree to refresh all node coordinate
    buildTree();
    adjustTransform(node, false);
  } else {
    // if the heading node don't show the children
    // expand it
    node.children = node._children;
    // then rebuild the tree to refresh all node coordinate
    buildTree();
    adjustTransform(node, true);
  }
};
</script>

<template>
  <svg
    id="tree-catalog"
    class="select-none"
    :viewBox="viewBox"
  >
    <!-- gradient colors for path -->
    <defs>
      <linearGradient
        id="gradientColor0To2"
      >
        <stop
          offset="10%"
          stop-color="#a855f7"
          stop-opacity="5%"
        />
        <stop
          offset="50%"
          stop-color="#a855f7"
          stop-opacity="30%"
        />
        <stop
          offset="100%"
          stop-color="#a855f7"
          stop-opacity="100%"
        />
      </linearGradient>
      <linearGradient
        id="gradientColor2To3"
      >
        <stop
          offset="10%"
          stop-color="#ef4444"
          stop-opacity="5%"
        />
        <stop
          offset="50%"
          stop-color="#ef4444"
          stop-opacity="30%"
        />
        <stop
          offset="100%"
          stop-color="#ef4444"
          stop-opacity="100%"
        />
      </linearGradient>
      <linearGradient
        id="gradientColor3To4"
      >
        <stop
          offset="10%"
          stop-color="#22c55e"
          stop-opacity="5%"
        />
        <stop
          offset="50%"
          stop-color="#22c55e"
          stop-opacity="30%"
        />
        <stop
          offset="100%"
          stop-color="#22c55e"
          stop-opacity="100%"
        />
      </linearGradient>
      <linearGradient
        id="gradientColor4To5"
      >
        <stop
          offset="10%"
          stop-color="#3b82f6"
          stop-opacity="5%"
        />
        <stop
          offset="50%"
          stop-color="#3b82f6"
          stop-opacity="30%"
        />
        <stop
          offset="100%"
          stop-color="#3b82f6"
          stop-opacity="100%"
        />
      </linearGradient>
      <linearGradient
        id="gradientColor5To6"
      >
        <stop
          offset="10%"
          stop-color="#6b7280"
          stop-opacity="5%"
        />
        <stop
          offset="50%"
          stop-color="#6b7280"
          stop-opacity="30%"
        />
        <stop
          offset="100%"
          stop-color="#6b7280"
          stop-opacity="100%"
        />
      </linearGradient>
    </defs>
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
            stroke-width="2"
            :stroke="`url(#gradientColor${link.source.data.depth}To${link.target.data.depth})`"
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
            :class="node.id === currentClickNodeId ? 'transition-transform duration-200' : ''"
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
                  class="p-1 text-xs font-bold text-left transition-colors duration-300 rounded"
                  style="text-shadow: 0px 0px 8px #f3f4f6, -1px 0px 8px #f3f4f6, 1px 0px 8px #f3f4f6, 0px 1px 8px #f3f4f6, 0px -1px 8px #f3f4f6;"
                  :class="`${headingColorMap[node.data.depth].text} ${headingColorMap[node.data.depth].hoverBg}`"
                >{{ node.data.text }}</a>
                <span
                  v-else
                  class="p-1 text-xs font-bold text-left"
                  :class="`${headingColorMap[node.data.depth].text}`"
                >{{ node.data.text }}</span>
              </div>
            </foreignObject>

            <!-- <text
          class=""
            dy="0.35em"
            :x="node.parent ? '0.8em' : '-0.8em'"
            :text-anchor="node.parent ? 'start' : 'end'"
            :font-weight="node.parent ? 'normal' : 'bold'"
            stroke-linejoin="round"
            stroke-width="5"
            stroke="#fff"
          >
            {{ textGenerator(node) }}
          </text>
          <text
            dy="0.35em"
            :x="node.parent ? '0.8em' : '-0.8em'"
            :text-anchor="node.parent ? 'start' : 'end'"
            :font-weight="node.parent ? 'normal' : 'bold'"
          >
            {{ textGenerator(node) }}
          </text> -->


            <!-- <svg
            v-if="node.data.type === 'post'"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#9CA3AF"
            viewBox="0 0 16 16"
            x="-0.6em"
            y="-0.6em"
          >
            <path
              d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z"
            />
          </svg>
          <svg
            v-if="node.data.type === 'folder'"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            :fill="node.children ? '#93C5FD' : '#60A5FA'"
            viewBox="0 0 16 16"
            x="-0.6em"
            y="-0.6em"
          >
            <path
              d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"
            />
          </svg>
          <svg
            v-if="node.data.type === 'root'"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#60A5FA"
            viewBox="0 0 16 16"
            x="-0.6em"
            y="-0.6em"
          >
            <path
              d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"
            />
          </svg> -->
            <title>{{ textGenerator(node, "full") }}</title>
          </g>
        </TransitionGroup>
      </g>
    </g>
  </svg>
</template>

<style scoped>

</style>