<script setup lang="ts">
const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  colorClass: {
    type: String,
    default: 'text-purple-600 bg-purple-100'
  },
  colorStyle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class="p-8 sm:p-16 w-full flex flex-col sm:flex-row justify-between items-center sm:item-start gap-16 rounded-xl"
    :class="props.colorClass"
    :style="props.colorStyle"
  >
    <div class="space-y-8">
      <slot>
        <h1>
          Hi
        </h1>
        <p>
          This website shows my blog posts and notes.
        </p>
      </slot>
    </div>
    <img v-if="props.avatar" :src="props.avatar" alt="avatar" class="hidden sm:block w-28 h-28 rounded-full">
  </div>
</template>

<style scoped lang="scss">
:slotted(h1), h1 {
    @apply font-bold text-5xl;
}

:slotted(p), p {
    @apply text-2xl opacity-50;
}
</style>
