<script setup lang="ts">
const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  avatarClass: {
    type: String,
    default: 'hidden lg:block w-28 h-28 rounded-full'
  },
  colorClass: {
    type: String,
    default: 'text-purple-500 bg-purple-100/20 border-purple-100'
  },
  colorStyle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class="p-10 sm:p-16 2xl:p-24 w-full flex flex-col sm:flex-row justify-between items-center sm:item-start gap-16 border-2 rounded-xl"
    :class="props.colorClass"
    :style="props.colorStyle"
  >
    <div class="space-y-4">
      <slot>
        <h1>
          Hi
        </h1>
        <p>
          This website shows my blog posts and notes.
        </p>
      </slot>
    </div>
    <img
      v-if="props.avatar"
      :src="props.avatar"
      :class="avatarClass"
      alt="avatar"
    >
  </div>
</template>

<style scoped lang="scss">
:slotted(h1), h1 {
    @apply pb-6 sm:pb-10 font-bold text-3xl sm:text-5xl;
    word-wrap: break-word;
}

:slotted(p), p {
    @apply text-lg sm:text-2xl opacity-95;
}
</style>
