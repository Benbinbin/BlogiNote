<script lang="ts">
import { defineComponent, h, nextTick, ref } from '#imports'
import TabGroupHeader from './TabGroupHeader.vue'

// refer to @nuxt-themes/docus-edge module component: components/content/CodeGroup.vue
export default defineComponent({
  setup(props, { slots }) {

    /**
     *
     * change active tab index
     *
     */
    const tabGroupContainer = ref<null | HTMLElement>(null)
    const activeTabIndex = ref(0)

    const changeActiveTabIndexHandler = (index: number) => {
      activeTabIndex.value = index

      nextTick(() => {
        if (tabGroupContainer.value) {
            tabGroupContainer.value.scrollIntoView({ block: "nearest" })
          }
      })
    }

    return () => {
      const slotArr = slots.default?.() || []

      const tabNameArr: string[] = []
      const tabNodes = slotArr.filter((slot: any) => {
        if (slot?.type?.tag === 'TabItem') {
          if (slot.props.name) {
            tabNameArr.push(slot.props.name)
          } else {
            tabNameArr.push('Tab')
          }
          return true
        }
        return false
      })

      return h(
        'div',
        {
          ref: tabGroupContainer,
          class: 'my-4 border border-gray-200 rounded',
        },
        [
          h(
            TabGroupHeader,
            {
              activeTabIndex: activeTabIndex.value,
              tabNameArr: tabNameArr,
              'onUpdate:activeTabIndex': changeActiveTabIndexHandler,
            }
          ),
          h(
            'div',
            {
              class: 'p-2'
            },

            // map tabs to content children
            tabNodes.map((node: any, index) => {

              return h(
                'div',
                {
                  // show active tab
                  style: {
                    display: index === activeTabIndex.value ? 'block' : 'none'
                  }
                },
                [h(
                  'div',
                  [node.children?.default?.() || h('div')],
                )]
              )
            })
          )
        ]
      )
    }
  }
})
</script>
