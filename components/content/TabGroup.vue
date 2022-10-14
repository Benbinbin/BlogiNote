<script setup lang="ts">
const slots = useSlots()
const { flatUnwrap } = useUnwrap()

const slotArr = slots.default()

const tabNodes = slotArr.filter((slot: any) => {
  return slot.type && slot.type.tag && slot.type.tag === 'tab-item'
})

const activeTabIndex = ref(0)
</script>
<template>
  <div class="border border-gray-200 rounded">
    <div class="tabs-header px-2 py-1 flex items-center gap-2 overflow-x-auto bg-gray-100 shadow-md rounded-t">
      <button v-for="(tab, index) in tabNodes" :key="index" class="px-4 py-2 text-sm  rounded transition-colors duration-300"
      :class="index === activeTabIndex ? 'bg-gray-300 hover:bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'"
      @click="activeTabIndex = index">
        {{tab.props.name}}
      </button>
    </div>
    <div class="p-2">
     <div v-for="(item, index) of flatUnwrap($slots.default(), ['div'])" :class="index=== activeTabIndex ? 'block' : 'hidden'">
      <ContentSlot :use="() => item" />
     </div>
    </div>
  </div>

</template>
<style lang="scss" scoped>
.tabs-header {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
